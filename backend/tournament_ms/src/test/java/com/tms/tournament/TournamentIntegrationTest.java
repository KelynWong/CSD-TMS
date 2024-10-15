package com.tms.tournament;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;

import com.tms.tournamentplayer.Player;

import lombok.extern.slf4j.Slf4j;

// Using Spring Boot Integration Test Libraries
/** Start an actual HTTP server listening at a random port*/
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Slf4j
class TournamentIntegrationTest {

	@LocalServerPort
	private int port;

	private final String baseURL = "http://localhost:";

	/**
	 * Use TestRestTemplate for testing a real instance of your application as an external actor.
	 * TestRestTemplate is just a convenient subclass of RestTemplate that is suitable for integration tests.
 	 * It is fault tolerant, and optionally can carry Basic authentication headers.
	 */
	@Autowired
	private TestRestTemplate restTemplate;

	@Autowired
	private TournamentRepository tournaments;

	// @Autowired
	// private PlayerRepository players;

	// @AfterEach
	// void tearDown() {

	// 	// clear the database after each test
	// 	tournaments.deleteAll();
	// 	players.deleteAll();
	// }

    @Test
	public void getTournament_Success() throws Exception {
		URI uri = new URI(baseURL + port + "/tournaments");
		// Tournaments.save(new Tournament("Gone With The Wind"));
		
		// Need to use array with a ReponseEntity here
		ResponseEntity<Tournament[]> result = restTemplate.getForEntity(uri, Tournament[].class);
		Tournament[] tournamentList = result.getBody();
		
		assertEquals(200, result.getStatusCode().value());
		assertEquals(6, tournamentList.length); // [TBC] 6 is hardcode, need to change
	}

	@Test
	public void getTournament_ValidTournamentId_Success() throws Exception {
		// - mock objects
        Long id = Long.valueOf(0);
        String tournamentName = "New Badminton Tournament";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        String status = "Scheduled";
        String createdBy = "admin1";
        String winner = null;
        List<Player> players = new ArrayList<>();

        Tournament tournament = new Tournament(id, tournamentName, startDT, endDT, status, regStartDT, regEndDT, createdBy, winner, players); 

		Long t_id = tournaments.save(tournament).getId();
		log.info("t_id" + t_id);
		URI uri = new URI(baseURL + port + "/tournaments/id/" + t_id);
		
		ResponseEntity<Tournament> result = restTemplate.getForEntity(uri, Tournament.class);
			
		assertEquals(200, result.getStatusCode().value());
		assertEquals("New Badminton Tournament", result.getBody().getTournamentName());

		// delete (not working)
		tournaments.deleteById(id);
	}

	@Test
	public void getTournament_InvalidTournamentId_Failure() throws Exception {
		URI uri = new URI(baseURL + port + "/tournaments/id/4"); // [TBC] 4 is hardcoded but it is a invalid id currently
		
		ResponseEntity<Tournament> result = restTemplate.getForEntity(uri, Tournament.class);
			
		assertEquals(404, result.getStatusCode().value());
	}

	@Test
	public void addTournament_Success() throws Exception {
		URI uri = new URI(baseURL + port + "/tournaments");

		// - mock objects
        // Long id = Long.valueOf(0);
        String tournamentName = "Tournament Integration Testing ";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        String status = "Scheduled";
        String createdBy = "admin1";
        String winner = null;
        // List<Player> players = new ArrayList<>();

        Tournament tournament = new Tournament(tournamentName, startDT, endDT, status, regStartDT, regEndDT, createdBy, winner);
		ResponseEntity<Tournament> result = restTemplate.postForEntity(uri, tournament, Tournament.class);
		// Long t_id = result.getBody().getId();
			
		assertEquals(201, result.getStatusCode().value());
		assertEquals(tournament.getTournamentName(), result.getBody().getTournamentName());

		// After test
		// tournaments.deleteById(t_id);
	}

	// @Test
	// public void updateTournament_Success() throws Exception {
	// 	URI uri = new URI(baseURL + port + "/tournaments");

	// 	// - mock objects
    //     Long id = Long.valueOf(0);
    //     String tournamentName = "";
    //     LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
    //     LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
    //     LocalDateTime startDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
    //     LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
    //     String status = "Scheduled";
    //     String createdBy = "admin1";
    //     String winner = null;
    //     List<Player> players = new ArrayList<>();

    //     Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);

	// 	ResponseEntity<Tournament> result = restTemplate.postForEntity(uri, tournament, Tournament.class);
			
	// 	assertEquals(201, result.getStatusCode().value());
	// 	assertEquals(tournament.getTournamentName(), result.getBody().getTournamentName());
	// }







}
