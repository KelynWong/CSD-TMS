package com.tms.tournament;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import com.tms.tournamentplayer.Player;
import com.tms.tournamentplayer.PlayerRepository;

import lombok.extern.slf4j.Slf4j;

// Using Spring Boot Integration Test Libraries
/** Start an actual HTTP server listening at a random port */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Slf4j
class TournamentControllerTest {

	@LocalServerPort
	private int port;

	private final String baseURL = "http://localhost:";

	/**
	 * Use TestRestTemplate for testing a real instance of your application as an
	 * external actor.
	 * TestRestTemplate is just a convenient subclass of RestTemplate that is
	 * suitable for integration tests.
	 * It is fault tolerant, and optionally can carry Basic authentication headers.
	 */
	@Autowired
	private TestRestTemplate restTemplate;

	@Autowired
	private TournamentRepository tournaments;
	@Autowired
	private PlayerRepository players;


	/* HELPER METHODS */
	public Tournament mockTournament(String typeOfErr) { // no err - input "noError"

		// - mock tournament objects
		String tournamentName = "Tournament Controller Testing - Invalid";
		LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
		LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
		LocalDateTime startDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
		LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
		String status = "Registration Start";
		String createdBy = "admin1";
		String winner = null;

		Tournament tournament = new Tournament(tournamentName, startDT, endDT, status, regStartDT, regEndDT, createdBy,
				winner);

		// set up any specified error
		switch (typeOfErr) {
			case "emptyName":
				tournament.setTournamentName("");
				break;
			case "regEndDTBefRegStartDT":
				tournament.setRegStartDT(regEndDT);
				tournament.setRegEndDT(regStartDT);
				break;
			case "regEndDTAftStartDT":
				tournament.setStartDT(regEndDT);
				tournament.setRegEndDT(startDT);
				break;
			case "endDTBefStartDT":
				tournament.setStartDT(endDT);
				tournament.setEndDT(startDT);
				break;
			case "wrongStatus":
				tournament.setStatus("HAHAHAHA WRONG");
				break;
			default:
				// no err - tournament is valid
				tournament.setTournamentName("Tournament Controller Testing - Valid");
				break;
		}

		return tournament;
	}

	public void restart(Long id) {
		tournaments.deleteById(id);
	}

	/* START OF TESTING */
	@Test
	public void getTournaments_Success() throws Exception {
		URI uri = new URI(baseURL + port + "/tournaments");
		Long currentCount = tournaments.count();

		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		// Need to use array with a ReponseEntity here
		ResponseEntity<Tournament[]> result = restTemplate.getForEntity(uri, Tournament[].class);
		Tournament[] tournamentArr = result.getBody();

		assertEquals(200, result.getStatusCode().value());
		assertEquals(currentCount + 1, tournamentArr.length); // tbc add repopulate data

		// delete
		restart(t_id);

	}

	@Test
	public void getTournament_ValidTournamentId_Success() throws Exception {
		// - mock objects
		Tournament tournament = mockTournament("noError");

		Long t_id = tournaments.save(tournament).getId();
		URI uri = new URI(baseURL + port + "/tournaments/id/" + t_id);

		ResponseEntity<Tournament> result = restTemplate.getForEntity(uri, Tournament.class);

		assertEquals(200, result.getStatusCode().value());
		assertEquals("Tournament Controller Testing - Valid", result.getBody().getTournamentName());
		assertEquals("Registration Start", result.getBody().getStatus()); // to delete

		// delete
		restart(t_id);
	}

	@Test
	public void getTournament_InvalidTournamentId_Failure() throws Exception {
		// - mock objects
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();
		tournaments.deleteById(t_id);
		URI uri = new URI(baseURL + port + "/tournaments/id/" + t_id);

		ResponseEntity<Tournament> result = restTemplate.getForEntity(uri, Tournament.class);

		assertEquals(404, result.getStatusCode().value());
	}

	@Test
	public void getTournamentsByStatus_ValidTournamentId_Success() throws Exception {

		// - mock objects
		Tournament tournament = mockTournament("noError"); // status : Registration Start
		Tournament savedTournament = tournaments.save(tournament);

		Long t_id = savedTournament.getId();
		
		String t_status = savedTournament.getStatus();
		URI uri = new URI(baseURL + port + "/tournaments/status/" + t_status.replace(" ", ""));

		ResponseEntity<Tournament[]> result = restTemplate.getForEntity(uri, Tournament[].class);
		Tournament[] tournamentArr = result.getBody();

		assertEquals(200, result.getStatusCode().value());
		assertTrue(tournamentArr.length > 0);

		// delete
		restart(t_id);
	}

	// @Test
	// public void getTournamentsByStatus_InvalidStatus_Failure() throws Exception {

	// String wrongStatus = "HahahahaWRONG";

	// URI uri = new URI(baseURL + port + "/tournaments/status/" + wrongStatus);

	// ResponseEntity<Tournament[]> result = restTemplate.getForEntity(uri,
	// Tournament[].class);

	// assertEquals(500, result.getStatusCode().value()); // might be 404

	// }

	@Test
	public void addTournament_ValidInput_Success() throws Exception {
		URI uri = new URI(baseURL + port + "/tournaments");

		// - mock objects
		Tournament tournament = mockTournament("noError");

		ResponseEntity<Tournament> result = restTemplate.postForEntity(uri, tournament, Tournament.class);
		Long t_id = result.getBody().getId();

		assertEquals(201, result.getStatusCode().value());
		assertEquals(tournament.getTournamentName(), result.getBody().getTournamentName());

		// After test
		restart(t_id);
	}

	@Test
	public void addTournament_InvalidInput_Failure() throws Exception {
		URI uri = new URI(baseURL + port + "/tournaments");

		String[] errArr = { "emptyName", "regEndDTBefRegStartDT", "regEndDTAftStartDT", "endDTBefStartDT",
				"wrongStatus" };

		for (String err : errArr) {
			Tournament tournament = mockTournament(err);
			ResponseEntity<Tournament> result = restTemplate.postForEntity(uri, tournament, Tournament.class);

			assertEquals(409, result.getStatusCode().value());

		}

	}

	@Test
	public void addTournament_SameName_Failure() throws Exception {
		URI uri = new URI(baseURL + port + "/tournaments");

		// - mock objects
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		ResponseEntity<Tournament> result = restTemplate.postForEntity(uri, tournament, Tournament.class);

		assertEquals(409, result.getStatusCode().value());

		restart(t_id);

	}

	@Test
	public void updateTournament_Success() throws Exception {
		// - mock objects
		Tournament newTournament = mockTournament("noError");
		Long t_id = tournaments.save(newTournament).getId();

		URI put_uri = new URI(baseURL + port + "/tournaments/" + t_id);

		newTournament.setTournamentName("Tournament Controller Testing - Updated");

		ResponseEntity<Tournament> result = restTemplate.exchange(put_uri, HttpMethod.PUT,
				new HttpEntity<>(newTournament), Tournament.class);

		assertEquals(200, result.getStatusCode().value());
		assertEquals(newTournament.getTournamentName(), result.getBody().getTournamentName());

		// After test
		restart(t_id);

	}

	@Test
	public void updateTournament_InvalidId_Failure() throws Exception {
		// - mock objects
		Tournament newTournament = mockTournament("noError");
		Long t_id = tournaments.save(newTournament).getId();

		tournaments.deleteById(t_id);

		URI uri = new URI(baseURL + port + "/tournaments/" + t_id);

		newTournament.setId(Long.valueOf(1));
		ResponseEntity<Tournament> result = restTemplate.exchange(uri, HttpMethod.PUT, new HttpEntity<>(newTournament),
				Tournament.class);

		assertEquals(404, result.getStatusCode().value());
	}

	@Test
	public void updateTournament_InvalidInput_Failure() throws Exception {
		// - mock objects
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		URI uri = new URI(baseURL + port + "/tournaments/" + t_id); // [tbc]hardcode

		String[] errArr = { "emptyName", "regEndDTBefRegStartDT", "regEndDTAftStartDT", "endDTBefStartDT",
				"wrongStatus" };

		for (String err : errArr) {
			Tournament newTournament = mockTournament(err);

			ResponseEntity<Tournament> result = restTemplate.exchange(uri, HttpMethod.PUT,
					new HttpEntity<>(newTournament),
					Tournament.class);

			assertEquals(409, result.getStatusCode().value());
		}

	}

	@Test
	public void deleteTournamnet_ValidTournamentId_Success() throws Exception {

		// - mock objects
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		String p_id = "userTesting123";
		Player player = players.save(new Player(p_id, new ArrayList<>()));

		// map the player and tournament
		List<Player> playerList = new ArrayList<>();
		List<Tournament> tournamentList = new ArrayList<>();

		playerList.add(player);
		tournamentList.add(tournament);
		tournament.setPlayers(playerList);
		player.setTournaments(tournamentList);

		players.save(player);
		tournaments.save(tournament);

		URI uri = new URI(baseURL + port + "/tournaments/" + t_id);

		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);

		assertEquals(200, result.getStatusCode().value());
		// An empty Optional should be returned by "findById" after deletion
		Optional<Tournament> emptyValue = Optional.empty();
		assertEquals(emptyValue, tournaments.findById(t_id));
	}

	@Test
	public void deleteTournamnet_InValidTournamentId_Failure() throws Exception {

		// - mock objects
		Tournament newTournament = mockTournament("noError");
		Long t_id = tournaments.save(newTournament).getId();

		tournaments.deleteById(t_id);

		URI uri = new URI(baseURL + port + "/tournaments/" + t_id);

		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);

		assertEquals(404, result.getStatusCode().value());
	}
}
