package com.tms.matchmaking;

import com.tms.exceptions.TournamentExistsException;
import com.tms.exceptions.TournamentNotFoundException;
import com.tms.match.Game;
import com.tms.match.MatchJson;
import com.tms.player.Player;
import com.tms.player.ResultsDTO;
import com.tms.tournament.Tournament;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class MatchmakeService {

    private final ApiManager apiManager;

    public MatchmakeService(ApiManager apiManager) {
        this.apiManager = apiManager;
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
            for (int i = 0; i < numMatchesRemaining; i++) {
                MatchJson match = createMatchWithoutPlayers(tournamentId);
                matches.add(match);
            }

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
}