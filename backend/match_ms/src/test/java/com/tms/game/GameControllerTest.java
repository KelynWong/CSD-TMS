package com.tms.game;

import com.tms.MatchServiceApplication;
import com.tms.match.Match;
import com.tms.match.MatchJson;
import com.tms.match.MatchRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes= MatchServiceApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GameControllerTest {

    @LocalServerPort
    private int port;

    private final String baseUrl = "http://localhost:";

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private GameRepository games;

    @Autowired
    private MatchRepository matches;

    @AfterEach
    void tearDown() {
        games.deleteAll();
        matches.deleteAll();
    }

    @Test
    void getAllGamesByMatchId_ReturnAllGames() {
        // Arrange
        Match match = new Match(1L, "2", "1");
        Long matchId = matches.save(match).getId();
        Game game1 = new Game(1L, match,( short) 1,  (short) 2, (short) 1);
        Game game2 = new Game(1L, match, (short) 1,  (short) 2, (short) 1);
        games.save(game1);
        games.save(game2);
        URI uri = URI.create(baseUrl + port + "/matches/" + matchId +"/games");

        // Act
        ResponseEntity<Game[]> response = restTemplate.getForEntity(uri, Game[].class);
        Game[] games = response.getBody();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, games.length);


    }

    @Test
    void addGames_GameNotEmpty_GameSizeLessThan3_ReturnMatchJson() {
        // Arrange
        Match match = new Match(1L, "2", "1");
        Long matchId = matches.save(match).getId();
        Game game1 = new Game(( short) 1,  (short) 21, (short) 1);
        Game game2 = new Game((short) 1,  (short) 21, (short) 1);
        List<Game> games = Arrays.asList(game1, game2);
        URI uri = URI.create(baseUrl + port + "/matches/" + matchId +"/games");

        // Act
        ResponseEntity<MatchJson> response = restTemplate.postForEntity(uri, games, MatchJson.class);
        MatchJson matchJson = response.getBody();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(matchId, matchJson.getId());
        assertEquals(2, matchJson.getGames().size());
    }

    @Test
    void addGames_GameEmpty_ThrowIllegalArgumentException() {
        // Arrange
        Match match = new Match(1L, "2", "1");
        Long matchId = matches.save(match).getId();
        List<Game> games = Arrays.asList();
        URI uri = URI.create(baseUrl + port + "/matches/" + matchId +"/games");

        // Act
        ResponseEntity<MatchJson> response = restTemplate.postForEntity(uri, games, MatchJson.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void addGames_SizeMoreThan3_ThrowIllegalArgumentException() throws Exception {
        // Arrange
        Match match = new Match(1L, "2", "1");
        Long matchId = matches.save(match).getId();
        Game game1 = new Game(( short) 1,  (short) 21, (short) 1);
        Game game2 = new Game((short) 1,  (short) 21, (short) 1);
        Game game3 = new Game((short) 1,  (short) 21, (short) 1);
        Game game4 = new Game((short) 1,  (short) 21, (short) 1);
        List<Game> games = Arrays.asList(game1, game2, game3, game4);
        URI uri = new URI(baseUrl + port + "/matches/" + matchId +"/games");

        // Act
        ResponseEntity<MatchJson> response = restTemplate.postForEntity(uri, games, MatchJson.class);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void updateGame()  {
        // Arrange
        Match match = new Match(1L, "2", "1");
        Long matchId = matches.save(match).getId();
        Game game = new Game(match, (short) 1, (short) 21, (short) 1);
        Long gameId = games.save(game).getId();
        Game newGame = new Game((short) 1, (short) 21, (short) 19);
        URI uri = URI.create(baseUrl + port + "/matches/" + matchId +"/games/" + gameId);

        // Act
        ResponseEntity<Game> response = restTemplate.exchange(uri, HttpMethod.PUT, new HttpEntity<>(newGame), Game.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(19, response.getBody().getPlayer2Score());


    }

    @Test
    void deleteGame() {
        // Arrange
        Match match = new Match(1L, "2", "1");
        Long matchId = matches.save(match).getId();
        Game game = new Game(match, (short) 1, (short) 21, (short) 1);
        Long gameId = games.save(game).getId();
        URI uri = URI.create(baseUrl + port + "/matches/" + matchId +"/games/" + gameId);

        // Act
        ResponseEntity<?> response = restTemplate.exchange(uri, HttpMethod.DELETE, null, Object.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(games.findById(gameId).isPresent());
    }


}