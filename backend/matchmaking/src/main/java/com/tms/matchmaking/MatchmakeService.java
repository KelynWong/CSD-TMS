package com.tms.matchmaking;

import com.tms.exceptions.*;
import com.tms.match.CreateTournament;
import com.tms.match.Game;
import com.tms.match.MatchJson;
import com.tms.player.Player;
import com.tms.player.Rating;
import com.tms.player.ResultsDTO;
import com.tms.tournament.Tournament;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class MatchmakeService {

    private final RestClient restClient;
    private final String MATCH_URL;
    private final String TOURNAMENT_URL;
    private final String PLAYER_URL;

    public MatchmakeService(
            @Value("${MATCH_URL}") String MATCH_URL,
            @Value("${TOURNAMENT_URL}") String TOURNAMENT_URL,
            @Value("${PLAYER_URL}") String PLAYER_URL) {
        this.restClient = RestClient.create();
        this.MATCH_URL = MATCH_URL;
        this.TOURNAMENT_URL = TOURNAMENT_URL;
        this.PLAYER_URL = PLAYER_URL;
    }

    public void matchmake(Long tournamentId) {
        try {
            List<MatchJson> tournaments;
            tournaments = getTournamentMatches(tournamentId);
            if (tournaments != null && !tournaments.isEmpty()) {
                throw new TournamentExistsException(tournamentId);
            }
        } catch (TournamentNotFoundException e) {
            System.out.println("Tournament not found. Creating matches for tournament ID: " + tournamentId);
            List<Player> playerIds = fetchTournamentPlayerIds(tournamentId);
            int n = playerIds.size();
            int k = (int) (Math.ceil(Math.log(n) / Math.log(2)));

            List<MatchJson> matches = new ArrayList<>();
            int byes = (int) Math.pow(2, k) - n;

            // choose top x players to get byes.
            List<Player> playerRatings = fetchPlayerData(playerIds);
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

            sendCreateMatchesRequest(matches, numMatchesAtBase);
        }
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

        return new MatchJson(tournamentId, player1, player2, null, null);
    }

    private MatchJson createMatchWithoutPlayers(Long tournamentId) {
        return new MatchJson(tournamentId, null, null, null, null);
    }

    private void sendCreateMatchesRequest(List<MatchJson> matches, double numMatchesAtBase) {
        CreateTournament createTournament = new CreateTournament(matches, numMatchesAtBase);

        ResponseEntity<String> res = restClient.post()
                .uri(MATCH_URL + "/tournament")
                .contentType(MediaType.APPLICATION_JSON)
                .body(createTournament)
                .retrieve()
                .toEntity(String.class);

        if (res.getStatusCode() != HttpStatus.CREATED) {
            throw new MatchCreationException("Error creating matches");
        }
    }

    public MatchJson updateMatchRes(Long matchId, List<Game> games) {
        MatchJson match = updateGames(matchId, games);

        String winnerId = match.getWinnerId();
        String loserId = match.getPlayer1Id().equals(winnerId) ? match.getPlayer2Id()
                : match.getPlayer1Id();

        Tournament tournament = fetchTournamentData(match.getTournamentId());
        LocalDateTime endDT = tournament.getEndDT();
        updateRating(new ResultsDTO(winnerId, loserId, endDT));

//         todo: update tournament winner
//         check if match is final match.
//         if so, update tournament winner.
//        List<MatchJson> tournamentMatches = getTournamentMatches(match.getTournamentId());
//        if (match.getId().equals(tournamentMatches.get(tournamentMatches.size() - 1).getId())) {
//
//        }

        return match;
    }

    private Tournament fetchTournamentData(Long tournamentId) {
        ResponseEntity<Tournament> tournamentRes = restClient.get()
                .uri(TOURNAMENT_URL + "/id/{tournamentId}", tournamentId)
                .retrieve()
                .toEntity(Tournament.class);

        if (tournamentRes.getStatusCode() != HttpStatus.OK) {
            throw new TournamentNotFoundException(tournamentId);
        }

        return tournamentRes.getBody();
    }

    private List<Player> fetchTournamentPlayerIds(Long tournamentId) {
        ResponseEntity<List<Player>> playerIdRes = restClient.get()
                .uri(TOURNAMENT_URL + "/{tournamentId}/players", tournamentId)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<>() {
                });

        if (playerIdRes.getStatusCode() != HttpStatus.OK || playerIdRes.getBody().isEmpty()) {
            throw new NoPlayersRegisteredException("No players registered for tournament");
        }

        return playerIdRes.getBody();
    }

    private List<Player> fetchPlayerData(List<Player> playerIds) {
        ResponseEntity<List<Player>> playerRes = restClient.post()
                .uri(PLAYER_URL + "/ids")
                .body(playerIds)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<>() {
                });

        if (playerRes.getStatusCode() != HttpStatus.OK) {
            throw new PlayerNotFoundException("Player ID not registered in database.");
        }

        return playerRes.getBody();
    }

    private List<MatchJson> getTournamentMatches(Long tournamentId) {
        ResponseEntity<List<MatchJson>> matchRes = restClient.get()
                .uri(MATCH_URL + "/tournament/{tournamentId}", tournamentId)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<>() {
                });

        if (matchRes.getStatusCode() != HttpStatus.OK || matchRes.getBody().isEmpty()) {
            throw new TournamentNotFoundException(tournamentId, true);
        }

        return matchRes.getBody();
    }

    private MatchJson updateGames(Long matchId, List<Game> games) {
        ResponseEntity<MatchJson> res = restClient.post()
                .uri(MATCH_URL + "/{matchId}/games", matchId)
                .body(games)
                .retrieve()
                .toEntity(MatchJson.class);

        if (res.getStatusCode() != HttpStatus.OK) {
            throw new MatchUpdateException(matchId);
        }

        return res.getBody();
    }

    private void updateRating(ResultsDTO results) {
        ResponseEntity<List<Rating>> res = restClient.put()
                .uri(PLAYER_URL + "/ratings")
                .body(results)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<>() {
                });

        if (res.getStatusCode() != HttpStatus.OK) {
            throw new RatingUpdateException(results.getWinnerId(), results.getLoserId());
        }
    }

    // todo: add code to call tournament ms to update tournament winner
    private void updateTournamentWinner() {

    }
}