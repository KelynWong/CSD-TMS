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
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class ApiManager {

    private final RestClient restClient;
    private final String MATCH_URL;
    private final String TOURNAMENT_URL;
    private final String PLAYER_URL;

    public ApiManager(
            @Value("${MATCH_URL}") String MATCH_URL,
            @Value("${TOURNAMENT_URL}") String TOURNAMENT_URL,
            @Value("${PLAYER_URL}") String PLAYER_URL) {
        this.restClient = RestClient.create();
        this.MATCH_URL = MATCH_URL;
        this.TOURNAMENT_URL = TOURNAMENT_URL;
        this.PLAYER_URL = PLAYER_URL;
    }

    List<Player> fetchTournamentPlayerIds(Long tournamentId) {
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

    List<Player> fetchPlayerData(List<Player> playerIds) {
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

    void sendCreateMatchesRequest(List<MatchJson> matches, double numMatchesAtBase) {
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

    List<MatchJson> getTournamentMatches(Long tournamentId) {
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

    Tournament fetchTournamentData(Long tournamentId) {
        ResponseEntity<Tournament> tournamentRes = restClient.get()
                .uri(TOURNAMENT_URL + "/id/{tournamentId}", tournamentId)
                .retrieve()
                .toEntity(Tournament.class);

        if (tournamentRes.getStatusCode() != HttpStatus.OK) {
            throw new TournamentNotFoundException(tournamentId);
        }

        return tournamentRes.getBody();
    }

    MatchJson updateGames(Long matchId, List<Game> games) {
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

    void updateRating(ResultsDTO results) {
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

    void updateTournamentWinner(Long id, String userId) {
        ResponseEntity<String> res = restClient.put()
                .uri(TOURNAMENT_URL + "/{id}/winner", id)
                .body(userId)
                .retrieve()
                .toEntity(String.class);

        if (res.getStatusCode() != HttpStatus.OK) {
            throw new TournamentWinnerUpdateException(id, userId);
        }
    }
}
