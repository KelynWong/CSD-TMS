package com.tms.match;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.tms.MatchServiceApplication;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MatchControllerTest {
    @LocalServerPort
    private int port;

    private final String baseUrl = "http://localhost:";

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private MatchRepository matches;

    @AfterEach
    void tearDown() {
        matches.deleteAll();
    }

    @Test
    void healthCheck() throws Exception {
        URI uri = new URI(baseUrl + port + "/matches/health");
        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Service is healthy", response.getBody());
    }

    @Test
    void getMatches() throws Exception {
        // Arrange
        URI uri = new URI(baseUrl + port + "/matches");
        matches.save(new Match(1L, "2", "1"));

        // Act
        ResponseEntity<Match[]> response = restTemplate.getForEntity(uri, Match[].class);

        Match[] matches = response.getBody();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, matches.length);
    }

    @Test
    void getMatch_MatchFound_ReturnMatch() throws Exception{
        // Arrange
        Match match = new Match(1L, "2", "1");
        Long id = matches.save(match).getId();
        URI uri = new URI(baseUrl + port + "/matches/" + id);

        // Act
        ResponseEntity<Match> response = restTemplate.getForEntity(uri, Match.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(id, response.getBody().getId());
    }

    @Test
    void getMatch_MatchNotFound_Return404() throws Exception{
        // Arrange
        URI uri = new URI(baseUrl + port + "/matches/1");

        // Act
        ResponseEntity<Match> response = restTemplate.getForEntity(uri, Match.class);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getMatchesByTournament() {
        // Arrange
        Long tournamentId = 1L;
        Match match1 = new Match(tournamentId, "2", "1");
        Match match2 = new Match(tournamentId, "3", "4");
        matches.save(match1);
        matches.save(match2);
        URI uri = URI.create(baseUrl + port + "/matches/tournament/" + tournamentId);

        // Act
        ResponseEntity<Match[]> response = restTemplate.getForEntity(uri, Match[].class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().length);
    }

    @Test
    void getMatchWinsByUser() {
        // Arrange
        String player1Id = "test1";
        Match match1 = new Match(1L, "test1", "test2");
        match1.setWinnerId(player1Id);
        Match match2 = new Match(1L, "test3", "test1");
        match2.setWinnerId(player1Id);
        matches.save(match1);
        matches.save(match2);

        // Act
        URI uri = URI.create(baseUrl + port + "/matches/user/win/" + player1Id);

        ResponseEntity<Match[]> response = restTemplate.getForEntity(uri, Match[].class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().length);
    }

    @Test
    void getMatchLossByUser() {
        String player1Id = "test1";
        Match match1 = new Match(1L, "test1", "test2");
        match1.setWinnerId("test1");
        Match match2 = new Match(1L, "test3", "test1");
        match2.setWinnerId("test3");
        matches.save(match1);
        matches.save(match2);

        URI uri = URI.create(baseUrl + port + "/matches/user/loss/" + player1Id);

        ResponseEntity<Match[]> response = restTemplate.getForEntity(uri, Match[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().length);
    }

    @Test
    void getMatchesPlayedByUser() {
        String player1Id = "test1";
        Match match1 = new Match(1L, "test1", "test2");
        Match match2 = new Match(1L, "test3", "test1");
        match1.setWinnerId("test3");
        match2.setWinnerId("test1");
        matches.save(match1);
        matches.save(match2);

        URI uri = URI.create(baseUrl + port + "/matches/user/played/" + player1Id);

        ResponseEntity<Match[]> response = restTemplate.getForEntity(uri, Match[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().length);
    }

    @Test
    void addMatch() {
        // Arrange
        MatchJson matchJson = new MatchJson(2L, 1L, "player3", "player4", null, null, null, null);
        URI uri = URI.create(baseUrl + port + "/matches");

        // Act
        ResponseEntity<Match> response = restTemplate.postForEntity(uri, matchJson, Match.class);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(response.getBody().getTournamentId(), 1L);
        assertEquals("player3", response.getBody().getPlayer1Id());
        assertEquals("player4", response.getBody().getPlayer2Id());
    }

    @Test
    void addTournament() {
        // Arrange
        MatchJson match1 = new MatchJson(1L, 1L, "player1", "player2", null, null, null, null);
        MatchJson match2 = new MatchJson(2L, 1L, "player3", "player4", null, null, null, null);
        List<MatchJson> matches = Arrays.asList(match1, match2);
        CreateTournament tournament = new CreateTournament(matches, 2);

        tournament.setMatches(Arrays.asList(match1, match2));
        tournament.setNumMatchesAtBase(2);
        URI uri = URI.create(baseUrl + port + "/matches/tournament");

        // Act
        ResponseEntity<Match[]> response = restTemplate.postForEntity(uri, tournament, Match[].class);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().length);
        assertEquals("player1", response.getBody()[0].getPlayer1Id());
        assertEquals("player3", response.getBody()[1].getPlayer1Id());
    }

    @Test
    void deleteMatch_MatchFound() {
        // Arrange
        Match match = new Match(1L, "player1", "player2");
        Long id = matches.save(match).getId();
        URI uri = URI.create(baseUrl + port + "/matches/" + id);

        // Act
        restTemplate.delete(uri);

        // Assert
        assertFalse(matches.findById(id).isPresent());
    }

    @Test
    void deleteMatch_MatchNotFound_Return404() {
        // Arrange
        URI uri = URI.create(baseUrl + port + "/matches/9999"); // Assuming 9999 is a non-existent ID

        // Act
        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.DELETE, null, String.class);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}