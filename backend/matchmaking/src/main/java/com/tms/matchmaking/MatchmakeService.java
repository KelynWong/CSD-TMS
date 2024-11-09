package com.tms.matchmaking;

import com.tms.exceptions.TournamentExistsException;
import com.tms.exceptions.TournamentNotFoundException;
import com.tms.match.Game;
import com.tms.match.MatchJson;
import com.tms.message.MessageService;
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
    private final MessageService messageService;

    public MatchmakeService(ApiManager apiManager, RatingCalculator ratingCalc, MessageService messageService) {
        this.apiManager = apiManager;
        this.ratingCalc = ratingCalc;
        this.messageService = messageService;
    }

    /**
     * @param tournamentId ID of the tournament to matchmake
     * @return List of MatchJson objects representing the matches created
     */
    public List<MatchJson> matchmake(Long tournamentId, String pairingStrategy) {
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
            int numPlayers = playerIds.size();
            int numRounds = (int) (Math.ceil(Math.log(numPlayers) / Math.log(2))); // k is height of tree, or number of rounds in tournament

            int byes = (int) Math.pow(2, numRounds) - numPlayers;
            // choose top x players to get byes.
            List<Player> playerRatings = apiManager.fetchPlayerData(playerIds);
            playerRatings = shuffleRatings(playerRatings);
            List<Player> byePlayers = playerRatings.subList(0, byes);

            // create matches for byes
            for (int i = 0; i < byes; i++) {
                List<Player> matchPlayers = byePlayers.subList(i, i + 1);
                MatchJson match = new MatchJson(tournamentId, matchPlayers);
                matches.add(match);
            }

            // create remaining matches for base layer
            List<Player> remainingPlayers = playerRatings.subList(byes, numPlayers);

            PairingStrategy strategy = PairingStrategyFactory.getPairingStrategy(pairingStrategy);
            matches.addAll(strategy.pairPlayers(remainingPlayers, tournamentId));

            double numMatchesAtBase = Math.pow(2, numRounds - 1);
            double numMatchesRemaining = (Math.pow(2, numRounds) - 1) - numMatchesAtBase;

            // create matches for the rest of the tree
            // Create a list with the element repeated multiple times
            List<MatchJson> repeatedMatches = Collections.nCopies((int) numMatchesRemaining,
                    createMatchWithoutPlayers(tournamentId));

            // Add all elements to the matches list
            matches.addAll(repeatedMatches);
            apiManager.sendCreateMatchesRequest(matches, numMatchesAtBase);

            Tournament tournament = apiManager.fetchTournamentData(tournamentId);
            Map<String, Player> idToPlayer = mapPlayersById(playerRatings);
            messageService.sendMessagesToSQS(tournament, matches, idToPlayer, numRounds);

            return matches;
        }
        return matches;
    }

    /**
     * Shuffle the ratings of the players to randomize the match pairings
     *
     * @param players List of players to shuffle
     * @return List of players with shuffled ratings
     */
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

    /**
     * Create a match with the given tournament ID and no players
     *
     * @param tournamentId ID of the tournament
     * @return MatchJson object representing the match
     */
    private MatchJson createMatchWithoutPlayers(Long tournamentId) {
        return new MatchJson(tournamentId, null, null);
    }

    /**
     * Update the result of a match and update the player ratings
     *
     * @param matchId ID of the match
     * @param games List of games in the match
     * @return MatchJson object representing the updated match
     */
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

    /**
     * Set up the simulation of a tournament
     *
     * @param tournamentId ID of the tournament
     * @return TournamentSimSetup object containing maps of the matches and players
     */
    private TournamentSimSetup setupTournamentSimulation(Long tournamentId) {
        List<Player> playerIds = apiManager.fetchTournamentPlayerIds(tournamentId);
        List<Player> playerRatings = apiManager.fetchPlayerData(playerIds);
        List<MatchJson> matches = apiManager.getTournamentMatches(tournamentId);

        Map<Long, MatchJson> idToMatch = mapMatchesById(matches);
        Map<String, Player> idToPlayer = mapPlayersById(playerRatings);

        setParentMatches(idToMatch);
        return new TournamentSimSetup(idToMatch, idToPlayer);
    }

    /**
     * Simulate a tournament multiple times and return the players and their percentages
     *
     * @param tournamentId ID of the tournament
     * @return List of TournamentSimRes objects representing the simulation results
     */
    public List<TournamentSimRes> simManyTournament(Long tournamentId) {
        final int NUM_SIMULATIONS = 10000;
        TournamentSimSetup setup = setupTournamentSimulation(tournamentId);
        Map<Long, MatchJson> idToMatch = setup.getIdToMatch();
        Map<String, Player> idToPlayer = setup.getIdToPlayer();

        Random random = new Random();
        Map<String, Float> results = new HashMap<>();
        for (int i = 0; i < NUM_SIMULATIONS; i++) {
            Map<Long, MatchJson> clone = deepCloneMap(idToMatch);
            simulateMatches(clone, idToPlayer, random, false);
            List<MatchJson> valuesList = new ArrayList<>(clone.values());
            MatchJson finalMatch = valuesList.get(valuesList.size() - 1);
            String winnerId = finalMatch.getWinnerId();
            results.put(winnerId, results.getOrDefault(winnerId, 0f) + 1);
        }

        // Convert counts to percentages
        results.replaceAll((key, value) -> {
            BigDecimal percentage = BigDecimal.valueOf((value / NUM_SIMULATIONS) * 100);
            percentage = percentage.setScale(1, RoundingMode.HALF_UP);
            return percentage.floatValue();
        });

        List<TournamentSimRes> resList = new ArrayList<>();
        for (Map.Entry<String, Float> entry : results.entrySet()) {
            TournamentSimRes res = new TournamentSimRes();
            res.setPlayerName(idToPlayer.get(entry.getKey()).getFullname());
            res.setRank(idToPlayer.get(entry.getKey()).getRank());
            res.setWinRate(entry.getValue());
            resList.add(res);
        }

        return resList;
    }

    /**
     * Deep clone a map of MatchJson objects
     *
     * @param original Original map to clone
     * @return Cloned map of MatchJson objects
     */
    private Map<Long, MatchJson> deepCloneMap(Map<Long, MatchJson> original) {
        Map<Long, MatchJson> clone = new LinkedHashMap<>();
        for (Map.Entry<Long, MatchJson> entry : original.entrySet()) {
            Long clonedKey = entry.getKey();
            MatchJson clonedValue = new MatchJson(entry.getValue());
            clone.put(clonedKey, clonedValue);
        }
        return clone;
    }

    /**
     * Simulate a tournament and return the results
     *
     * @param tournamentId ID of the tournament
     * @return List of MatchJson objects representing the matches in the tournament
     */
    public List<MatchJson> simTournament(Long tournamentId) {
        TournamentSimSetup setup = setupTournamentSimulation(tournamentId);
        Map<Long, MatchJson> idToMatch = setup.getIdToMatch();
        Map<String, Player> idToPlayer = setup.getIdToPlayer();

        Random random = new Random();
        simulateMatches(idToMatch, idToPlayer, random, true);
        return new ArrayList<>(idToMatch.values());
    }

    /**
     * Maps a list of MatchJson objects to a LinkedHashMap with their IDs as keys.
     *
     * @param matches List of MatchJson objects to be mapped.
     * @return A LinkedHashMap where the keys are the IDs of the MatchJson objects and the values are the MatchJson objects themselves.
     */
    private Map<Long, MatchJson> mapMatchesById(List<MatchJson> matches) {
        return matches.stream()
                .collect(Collectors.toMap(
                        MatchJson::getId,
                        Function.identity(),
                        (existing, replacement) -> existing,
                        LinkedHashMap::new
                ));
    }

    /**
     * Maps a list of Player objects to a Map with their IDs as keys.
     *
     * @param playerRatings List of Player objects to be mapped.
     * @return A Map where the keys are the IDs of the Player objects and the values are the Player objects themselves.
     */
    private Map<String, Player> mapPlayersById(List<Player> playerRatings) {
        return playerRatings.stream()
                .collect(Collectors.toMap(Player::getId, Function.identity()));
    }

    /**
     * Sets the parent matches for each match in the given map.
     *
     * @param idToMatch Map of match IDs to MatchJson objects.
     */
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

    /**
     * Simulates matches and games updates the results in place.
     *
     * @param idToMatch Map of match IDs to MatchJson objects.
     * @param idToPlayer Map of player IDs to Player objects.
     * @param random Random instance for generating random outcomes.
     * @param simulateGames Flag indicating whether to simulate individual games within matches.
     */
    private void simulateMatches(Map<Long, MatchJson> idToMatch, Map<String, Player> idToPlayer, Random random,
                                 boolean simulateGames) {
        for (MatchJson match : idToMatch.values()) {
            if (match.getPlayer1Id() != null && match.getPlayer2Id() != null) {
                Player player1 = idToPlayer.get(match.getPlayer1Id());
                Player player2 = idToPlayer.get(match.getPlayer2Id());

                double player1Rating = player1.getRating().getRating();
                double player1Deviation = player1.getRating().getRatingDeviation();
                double player2Rating = player2.getRating().getRating();
                double player2Deviation = player2.getRating().getRatingDeviation();

                double winProb = ratingCalc.calcWinProb(player1Rating, player1Deviation, player2Rating, player2Deviation);
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

    /**
     * Updates the next match with the winner of the current match.
     *
     * @param idToMatch Map of match IDs to MatchJson objects.
     * @param match The current MatchJson object whose winner will be set in the next match.
     */
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

    /**
     * Simulates games and returns a list of Game objects with the results.
     *
     * @param player1Wins Flag indicating whether player 1 wins the match.
     * @param random Random instance for generating random outcomes.
     * @return List of Game objects representing the simulated games.
     */
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