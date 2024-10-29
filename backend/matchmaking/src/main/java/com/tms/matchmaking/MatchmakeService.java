package com.tms.matchmaking;

import com.tms.exceptions.TournamentExistsException;
import com.tms.exceptions.TournamentNotFoundException;
import com.tms.match.Game;
import com.tms.match.MatchJson;
import com.tms.player.Player;
import com.tms.player.RatingCalculator;
import com.tms.player.ResultsDTO;
import com.tms.tournament.Tournament;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class MatchmakeService {

    private final ApiManager apiManager;
    private final RatingCalculator ratingCalc;

    public MatchmakeService(ApiManager apiManager, RatingCalculator ratingCalc) {
        this.apiManager = apiManager;
        this.ratingCalc = ratingCalc;
    }

    public List<MatchJson> matchmake(Long tournamentId) {
        List<MatchJson> matches = new ArrayList<>();
        try {
            List<MatchJson> tournaments;
            tournaments = apiManager.getTournamentMatches(tournamentId);
            if (tournaments != null && !tournaments.isEmpty()) {
                throw new TournamentExistsException(tournamentId);
            }
        } catch (TournamentNotFoundException e) {
            System.out.println("Tournament not found. Creating matches for tournament ID: " + tournamentId);
            List<Player> playerIds = apiManager.fetchTournamentPlayerIds(tournamentId);
            int n = playerIds.size();
            int k = (int) (Math.ceil(Math.log(n) / Math.log(2))); // k is height of tree, or number of rounds in tournament

            int byes = (int) Math.pow(2, k) - n;
            // choose top x players to get byes.
            List<Player> playerRatings = apiManager.fetchPlayerData(playerIds);
            playerRatings = shuffleRatings(playerRatings);
            List<Player> byePlayers = playerRatings.subList(0, byes);

            // create matches for byes
            for (int i = 0; i < byes; i++) {
                List<Player> matchPlayers = byePlayers.subList(i, i + 1);
                MatchJson match = createMatch(tournamentId, matchPlayers);
                matches.add(match);
            }

            // create remaining matches for base layer
            List<Player> remainingPlayers = playerRatings.subList(byes, n);
            int start = 0;
            int end = remainingPlayers.size() - 1;

            // pair strong players with weak players
            while (start <= end) {
                List<Player> matchPlayers = new ArrayList<>();
                matchPlayers.add(remainingPlayers.get(start));
                if (start != end) {
                    matchPlayers.add(remainingPlayers.get(end));
                }
                MatchJson match = createMatch(tournamentId, matchPlayers);
                matches.add(match);
                start++;
                end--;
            }

            double numMatchesAtBase = Math.pow(2, k - 1);
            double numMatchesRemaining = (Math.pow(2, k) - 1) - numMatchesAtBase;

            // create matches for the rest of the tree
            // Create a list with the element repeated multiple times
            List<MatchJson> repeatedMatches = Collections.nCopies((int) numMatchesRemaining,
                    createMatchWithoutPlayers(tournamentId));

            // Add all elements to the matches list
            matches.addAll(repeatedMatches);
            apiManager.sendCreateMatchesRequest(matches, numMatchesAtBase);
            return matches;
        }
        return matches;
    }

    private List<Player> shuffleRatings(List<Player> players) {
        List<Player> shuffledRatings = new ArrayList<>(players);
        int start = 0;

        while (start < shuffledRatings.size()) {
            int end = start;
            double currentRating = shuffledRatings.get(start).getRating().getRating();

            // Find the end of the current rating group
            while (end < shuffledRatings.size() && shuffledRatings.get(end).getRating().getRating() == currentRating) {
                end++;
            }

            // Shuffle the sublist of players with the same rating
            Collections.shuffle(shuffledRatings.subList(start, end));

            // Move to the next group
            start = end;
        }

        return shuffledRatings;
    }

    private MatchJson createMatch(Long tournamentId, List<Player> matchPlayers) {
        String player1;
        String player2 = null;

        if (matchPlayers.size() == 2) {
            player1 = matchPlayers.get(0).getId();
            player2 = matchPlayers.get(1).getId();
        } else if (matchPlayers.size() == 1) {
            player1 = matchPlayers.get(0).getId();
        } else {
            throw new IllegalArgumentException("Invalid number of players");
        }

        return new MatchJson(tournamentId, player1, player2);
    }

    private MatchJson createMatchWithoutPlayers(Long tournamentId) {
        return new MatchJson(tournamentId, null, null);
    }

    public MatchJson updateMatchRes(Long matchId, List<Game> games) {
        // update games in match ms
        MatchJson match = apiManager.updateGames(matchId, games);

        // update player ratings
        String winnerId = match.getWinnerId();
        String loserId = match.getPlayer1Id().equals(winnerId) ? match.getPlayer2Id()
                : match.getPlayer1Id();
        Tournament tournament = apiManager.fetchTournamentData(match.getTournamentId());
        LocalDateTime endDT = tournament.getEndDT();
        apiManager.updateRating(new ResultsDTO(winnerId, loserId, endDT));

        // check if match is final match.
        // if so, update tournament winner.
        List<MatchJson> tournamentMatches = apiManager.getTournamentMatches(match.getTournamentId());
        if (match.getId().equals(tournamentMatches.get(tournamentMatches.size() - 1).getId())) {
            apiManager.updateTournamentWinner(match.getTournamentId(), winnerId);
        }

        return match;
    }

    private Map<Long, MatchJson> setupTournamentSimulation(Long tournamentId,
                                                           Map<String, Player> idToPlayer) {
        List<Player> playerIds = apiManager.fetchTournamentPlayerIds(tournamentId);
        List<Player> playerRatings = apiManager.fetchPlayerData(playerIds);
        List<MatchJson> matches = apiManager.getTournamentMatches(tournamentId);

        Map<Long, MatchJson> idToMatch = mapMatchesById(matches);
        idToPlayer.putAll(mapPlayersById(playerRatings));

        setParentMatches(idToMatch);
        return idToMatch;
    }

    public Map<Player, Float> simManyTournament(Long tournamentId) {
        final int NUM_SIMULATIONS = 1000;
        Map<String, Player> idToPlayer = new HashMap<>();
        Map<Long, MatchJson> idToMatch = setupTournamentSimulation(tournamentId, idToPlayer);

        Random random = new Random();
        Map<Player, Float> results = new HashMap<>();
        for (int i = 0; i < NUM_SIMULATIONS; i++) {
            Map<Long, MatchJson> clone = deepCloneMap(idToMatch);
            simulateMatches(clone, idToPlayer, random, false);
            List<MatchJson> valuesList = new ArrayList<>(clone.values());
            MatchJson finalMatch = valuesList.get(valuesList.size() - 1);
            String winnerId = finalMatch.getWinnerId();
            Player winner = idToPlayer.get(winnerId);
            results.put(winner, results.getOrDefault(winner, 0f) + 1);
        }

        // Convert counts to percentages
        results.replaceAll((key, value) -> {
            BigDecimal percentage = BigDecimal.valueOf((value / NUM_SIMULATIONS) * 100);
            percentage = percentage.setScale(1, RoundingMode.HALF_UP);
            return percentage.floatValue();
        });
        return results;
    }

    private Map<Long, MatchJson> deepCloneMap(Map<Long, MatchJson> original) {
        Map<Long, MatchJson> clone = new LinkedHashMap<>();
        for (Map.Entry<Long, MatchJson> entry : original.entrySet()) {
            Long clonedKey = entry.getKey();
            MatchJson clonedValue = new MatchJson(entry.getValue());
            clone.put(clonedKey, clonedValue);
        }
        return clone;
    }

    public List<MatchJson> simTournament(Long tournamentId) {
        Map<String, Player> idToPlayer = new HashMap<>();
        Map<Long, MatchJson> idToMatch = setupTournamentSimulation(tournamentId, idToPlayer);

        Random random = new Random();
        simulateMatches(idToMatch, idToPlayer, random, true);
        return new ArrayList<>(idToMatch.values());
    }

    private Map<Long, MatchJson> mapMatchesById(List<MatchJson> matches) {
        return matches.stream()
                .collect(Collectors.toMap(
                        MatchJson::getId,
                        Function.identity(),
                        (existing, replacement) -> existing,
                        LinkedHashMap::new
                ));
    }

    private Map<String, Player> mapPlayersById(List<Player> playerRatings) {
        return playerRatings.stream()
                .collect(Collectors.toMap(Player::getId, Function.identity()));
    }

    private void setParentMatches(Map<Long, MatchJson> idToMatch) {
        for (MatchJson match : idToMatch.values()) {
            if (match.getLeft() != null) {
                MatchJson leftMatch = idToMatch.get(match.getLeft());
                leftMatch.setParent(match.getId());
            }

            if (match.getRight() != null) {
                MatchJson rightMatch = idToMatch.get(match.getRight());
                rightMatch.setParent(match.getId());
            }
        }
    }

    private void simulateMatches(Map<Long, MatchJson> idToMatch, Map<String, Player> idToPlayer, Random random,
                                 boolean simulateGames) {
        for (MatchJson match : idToMatch.values()) {
            if (match.getPlayer1Id() != null && match.getPlayer2Id() != null) {
                Player player1 = idToPlayer.get(match.getPlayer1Id());
                Player player2 = idToPlayer.get(match.getPlayer2Id());

                double winProb = ratingCalc.calcWinProb(player1.getRating().getRating(), player1.getRating().getRatingDeviation(),
                        player2.getRating().getRating(), player2.getRating().getRatingDeviation());
                boolean player1Wins = getMatchWinner(random, winProb);
                match.setWinnerId(player1Wins ? match.getPlayer1Id() : match.getPlayer2Id());
                if (simulateGames) {
                    match.setGames(simulateGames(player1Wins, random));
                }

                if (match.getParent() != null) {
                    updateNextMatch(idToMatch, match);
                }
            }
        }
    }

    private void updateNextMatch(Map<Long, MatchJson> idToMatch, MatchJson match) {
        MatchJson nextMatch = idToMatch.get(match.getParent());
        if (nextMatch.getPlayer1Id() == null) {
            nextMatch.setPlayer1Id(match.getWinnerId());
        } else {
            nextMatch.setPlayer2Id(match.getWinnerId());
        }
    }

    private boolean getMatchWinner(Random random, double winProb) {
        return random.nextDouble() < winProb;
    }

    private List<Game> simulateGames(boolean player1Wins, Random random) {
        List<Game> games = new ArrayList<>();
        int numGames = random.nextBoolean() ? 2 : 3; // Randomly decide between 2 or 3 games

        for (int i = 0; i < numGames; i++) {
            int loserPoints = random.nextInt(15) + 5; // Random points between 5 and 19 for the loser
            short player1Score, player2Score;

            if (numGames == 2 || i == 2) {
                player1Score = player1Wins ? 21 : (short) loserPoints;
                player2Score = player1Wins ? (short) loserPoints : 21;
            } else if (i == 0) {
                boolean player1WinsGame = random.nextBoolean();
                player1Score = player1WinsGame ? 21 : (short) loserPoints;
                player2Score = player1WinsGame ? (short) loserPoints : 21;
            } else {
                boolean player1WinsFirstGame = games.get(0).getPlayer1Score() == 21;
                player1Score = player1WinsFirstGame ? (short) loserPoints : 21;
                player2Score = player1WinsFirstGame ? 21 : (short) loserPoints;
            }

            games.add(new Game((short) (i + 1), player1Score, player2Score));
        }

        return games;
    }
}