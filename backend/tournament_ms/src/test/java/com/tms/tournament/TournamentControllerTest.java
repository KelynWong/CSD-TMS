package com.tms.tournament;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.*;
import java.net.URI;
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

import com.tms.TestHelper;
import com.tms.TournamentServiceApplication;
import com.tms.tournamentplayer.Player;
import com.tms.tournamentplayer.PlayerRepository;

import lombok.extern.slf4j.Slf4j;

// Using Spring Boot Integration Test Libraries
/** Start an actual HTTP server listening at a random port */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = TournamentServiceApplication.class)
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

	/* HELPER CLASS */
	@Autowired
	private TestHelper helper;

	/* START OF TESTING */
	@Test // getTournaments - case 1 : success (only one case)
	public void getTournaments_Success() throws Exception {

		// input - current # of tournaments in db before adding & add 1 tournament to db
		Long currentCount = tournaments.count();

		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments");
		ResponseEntity<Tournament[]> result = restTemplate.getForEntity(uri, Tournament[].class); // need to use array with a ReponseEntity here
		Tournament[] tournamentArr = result.getBody();

		// verify the output - 200 (OK) : check if current count got increase aft adding 1 more tournament
		assertEquals(200, result.getStatusCode().value());
		assertEquals(currentCount + 1, tournamentArr.length);

		// reset
		helper.reset(t_id, null);

	}

	@Test // getTournamentById - case 1 : valid tournament id
	public void getTournamentById_ValidTournamentId_Success() throws Exception {

		// input - get a valid tournament id (create tournament -> save in db)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/id/" + t_id);
		ResponseEntity<Tournament> result = restTemplate.getForEntity(uri, Tournament.class);

		// verify the output - 200 (OK) : check if returned name is same as added name
		assertEquals(200, result.getStatusCode().value());
		assertEquals("Tournament Controller Testing - Valid", result.getBody().getTournamentName());

		// reset
		helper.reset(t_id, null);
	}

	@Test // getTournamentById - case 2 : invalid tournament id
	public void getTournamentById_InvalidTournamentId_Failure() throws Exception {
		// input - invalid tournament id (create tournament -> save in db -> del it in
		// db)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();
		tournaments.deleteById(t_id);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/id/" + t_id); // form the uri of the api
		ResponseEntity<Tournament> result = restTemplate.getForEntity(uri, Tournament.class); // call the api

		// verify the output - 404 (TournamentNotFoundException)
		assertEquals(404, result.getStatusCode().value());
	}

	@Test // getTournamentsByStatus - case 1 : valid status
	public void getTournamentsByStatus_ValidStatus_Success() throws Exception {

		// input - valid tournament id (create tournament w no err)
		Tournament tournament = helper.createTestTournament("noError"); // tournament status : Registration Start
		Tournament savedTournament = tournaments.save(tournament);

		Long t_id = savedTournament.getId();
		String t_status = savedTournament.getStatus();

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/status/" + t_status.replace(" ", "")); // del the spacing from status

		ResponseEntity<Tournament[]> result = restTemplate.getForEntity(uri, Tournament[].class);
		Tournament[] tournamentArr = result.getBody();

		// verify the output - 200 (OK) : check tt tournament arr returned is not empty
		assertEquals(200, result.getStatusCode().value());
		assertTrue(tournamentArr.length > 0);

		// reset
		helper.reset(t_id, null);
	}

	@Test // getTournamentsByStatus - case 2 : invalid status
	public void getTournamentsByStatus_InvalidStatus_Failure() throws Exception {

		// input - invalid status
		String wrongStatus = "HahahahaWRONG";

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/status/" + wrongStatus);
		String result = restTemplate.getForObject(uri, String.class);

		// verify output - 409 (InvalidTournamentStatusException)
		assertTrue(result.contains("\"status\":409"));

	}

	@Test // addTournament - case 1 : valid input
	public void addTournament_ValidInput_Success() throws Exception {

		// input - valid tournament w no error (create tournament w no err)
		Tournament tournament = helper.createTestTournament("noError");

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments");
		ResponseEntity<Tournament> result = restTemplate.postForEntity(uri, tournament, Tournament.class);
		Long t_id = result.getBody().getId();

		// verify the output - 201 (Created) : tournament creation successful (check if
		// the name of returned tournament is same as the one saved)
		assertEquals(201, result.getStatusCode().value());
		assertEquals(tournament.getTournamentName(), result.getBody().getTournamentName());

		// reset
		helper.reset(t_id, null);
	}

	@Test // addTournament - case 2 : invalid input
	public void addTournament_InvalidInput_Failure() throws Exception {

		// format the uri
		URI uri = new URI(baseURL + port + "/tournaments");
		// list the possible input errors
		String[] errArr = { "emptyName", "regEndDTBefRegStartDT", "regEndDTAftStartDT", "endDTBefStartDT",
				"wrongStatus" };

		// loop thr the errors
		for (String err : errArr) {
			// input - tournament with specified err
			Tournament tournament = helper.createTestTournament(err);
			// call the api
			ResponseEntity<Tournament> result = restTemplate.postForEntity(uri, tournament, Tournament.class);
			// verify the output - 409 (TournamentInvalidInputException)
			assertEquals(409, result.getStatusCode().value());

		}

	}

	@Test // addTournament - case 3 : same name (ie tournament exist exception)
	public void addTournament_SameName_Failure() throws Exception {

		// input - save a tournament in db first (create tournament -> save in db)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		// call the api - try to re-add the same tournament
		URI uri = new URI(baseURL + port + "/tournaments");
		ResponseEntity<Tournament> result = restTemplate.postForEntity(uri, tournament, Tournament.class);

		// verify the output - 409 (TournamentExistException)
		assertEquals(409, result.getStatusCode().value());

		// reset
		helper.reset(t_id, null);

	}

	@Test // updateTournament - case 1 : valid tournament id and input
	public void updateTournament_Success() throws Exception {

		// input - all valid (create tournament w no err -> save it in db -> modify it)
		Tournament newTournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(newTournament).getId();

		newTournament.setTournamentName("Tournament Controller Testing - Updated");

		// call the api
		URI put_uri = new URI(baseURL + port + "/tournaments/" + t_id);
		ResponseEntity<Tournament> result = restTemplate.exchange(put_uri, HttpMethod.PUT,
				new HttpEntity<>(newTournament), Tournament.class);

		// verify the output - 200 (OK) : update successful (make sure the change in
		// tournament name was saved in db correctly)
		assertEquals(200, result.getStatusCode().value());
		assertEquals("Tournament Controller Testing - Updated", result.getBody().getTournamentName());

		// reset
		helper.reset(t_id, null);

	}

	@Test // updateTournament - case 2 : invalid tournament id
	public void updateTournament_InvalidId_Failure() throws Exception {

		// input - invalid tournament id (create tournament -> del it)
		Tournament newTournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(newTournament).getId();

		tournaments.deleteById(t_id);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id);
		ResponseEntity<Tournament> result = restTemplate.exchange(uri, HttpMethod.PUT, new HttpEntity<>(newTournament),
				Tournament.class);

		// verify the output - 404 (TournamentNotFoundException)
		assertEquals(404, result.getStatusCode().value());
	}

	@Test // updateTournament - case 3 : invalid input
	public void updateTournament_InvalidInput_Failure() throws Exception {

		// preparation (create a valid tournament to update)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		// format the uri
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id);

		// list of possible input errors
		String[] errArr = { "emptyName", "regEndDTBefRegStartDT", "regEndDTAftStartDT", "endDTBefStartDT",
				"wrongStatus" };

		// loop thr each error
		for (String err : errArr) {
			// input - invalid tournament (create tournament with specified err)
			Tournament newTournament = helper.createTestTournament(err);

			// call the api
			ResponseEntity<Tournament> result = restTemplate.exchange(uri, HttpMethod.PUT,
					new HttpEntity<>(newTournament), Tournament.class);

			// verify the output - 409 (TournamentInvalidInputException)
			assertEquals(409, result.getStatusCode().value());
		}

		// reset
		helper.reset(t_id, null);

	}

	// updateTournament - case 4 : same name (ie tournament exist exception)

	@Test // updateStatusByTournamentId - case 1 : valid status and tournament id
	public void updateStatusByTournamentId_ValidStatusAndTournamentId_Success() throws Exception {
		
		// input - all valid (create tournament w no err -> save it in db -> modify it)
		Tournament newTournament = tournaments.save(helper.createTestTournament("noError"));
		Long t_id = newTournament.getId();

		String newStatus = "Registration Start"; // valid status

		// call the api
		URI put_uri = new URI(baseURL + port + "/tournaments/" + t_id + "/status");
		ResponseEntity<Tournament> result = restTemplate.exchange(put_uri, HttpMethod.PUT,
				new HttpEntity<>(newStatus), Tournament.class);

		// verify the output - 200 (OK) : update successful (make sure the change in
		// tournament name was saved in db correctly)
		assertEquals(200, result.getStatusCode().value());
		assertEquals(newStatus, result.getBody().getStatus());

		// reset
		helper.reset(t_id, null);

	}

	@Test // updateStatusByTournamentId - case 2 : valid tournament id but invalid status
	public void updateStatusByTournamentId_InvalidStatus_Failure() throws Exception {
		
		// input - valid tournament id but invalid status (create tournament w no err -> save it in db -> modify it)
		Tournament newTournament = tournaments.save(helper.createTestTournament("noError"));
		Long t_id = newTournament.getId();

		String newStatus = "HAHAByeBye"; // invalid status

		// call the api
		URI put_uri = new URI(baseURL + port + "/tournaments/" + t_id + "/status");
		ResponseEntity<Tournament> result = restTemplate.exchange(put_uri, HttpMethod.PUT,
				new HttpEntity<>(newStatus), Tournament.class);

		// verify the output - 409 (InvalidTournamentStatusException)
		assertEquals(409, result.getStatusCode().value());

		// reset
		helper.reset(t_id, null);

	}

	@Test // updateStatusByTournamentId - case 3 : invalid tournament id
	public void updateStatusByTournamentId_InvalidTournamentId_Success() throws Exception {
		
		// input - invalid tournament (create tournament -> save it in db -> del it)
		Tournament newTournament = tournaments.save(helper.createTestTournament("noError"));
		Long t_id = newTournament.getId();

		tournaments.deleteById(t_id);

		String newStatus = "Registration Start"; // valid status

		// call the api
		URI put_uri = new URI(baseURL + port + "/tournaments/" + t_id + "/status");
		ResponseEntity<Tournament> result = restTemplate.exchange(put_uri, HttpMethod.PUT,
				new HttpEntity<>(newStatus), Tournament.class);

		// verify the output - 404 (TournamentNotFoundException)
		assertEquals(404, result.getStatusCode().value());

		// reset
		helper.reset(t_id, null);

	}

	@Test // deleteTournament - case 1 : valid tournament id with player mapping
	public void deleteTournament_ValidTournamentIdWithPlayerMapping_Success() throws Exception {

		// input - valid tournament id (create tournament and player -> map them)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		Player player = helper.createTestPlayer();
		String p_id = player.getId();

		helper.mapTournamentPlayer(tournament, player);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id);
		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);

		// verify the output - 200 (OK) : tournament deleted successfully (Empty
		// optional shld be returned aft deletion)
		assertEquals(200, result.getStatusCode().value());
		Optional<Tournament> emptyValue = Optional.empty();
		assertEquals(emptyValue, tournaments.findById(t_id));

		// reset
		helper.reset(null, p_id);

	}

	@Test // deleteTournament - case 2 : valid tournament with no mapping
	public void deleteTournament_ValidTournamentIdWithNoMapping_Success() throws Exception {

		// input - valid tournament id (create tournament)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id);
		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);

		// verify the output - 200 (OK) : tournament deleted successfully (Empty
		// optional shld be returned aft deletion)
		assertEquals(200, result.getStatusCode().value());
		Optional<Tournament> emptyValue = Optional.empty();
		assertEquals(emptyValue, tournaments.findById(t_id));

	}

	@Test // deleteTournament - case 3 : invalid tournament id
	public void deleteTournament_InValidTournamentId_Failure() throws Exception {

		// input - invalid tournament id (create tournament -> del it)
		Tournament newTournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(newTournament).getId();

		tournaments.deleteById(t_id);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id);
		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);

		// verify the output - 404 (TournamentNotFoundException)
		assertEquals(404, result.getStatusCode().value());
	}
}
