package com.tms.tournamentplayer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
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
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.tms.tournament.Tournament;
import com.tms.tournament.TournamentRepository;

import lombok.extern.slf4j.Slf4j;

// Using Spring Boot Integration Test Libraries
/** Start an actual HTTP server listening at a random port */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Slf4j
public class PlayerControllerTest {

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
		String tournamentName = "Player Controller Testing - Invalid";
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
				tournament.setTournamentName("Player Controller Testing - Valid");
				break;
		}

		return tournament;
	}

	public void mapTournamentPlayer(Tournament tournament, Player player) {
		// map the player and tournament
		List<Player> playerList = new ArrayList<>();
		List<Tournament> tournamentList = new ArrayList<>();

		playerList.add(player);
		tournamentList.add(tournament);
		tournament.setPlayers(playerList);
		player.setTournaments(tournamentList);

		players.save(player);
		tournaments.save(tournament);
	}

	public void restart(Long t_id, String p_id) {

		if (t_id == null) {
			// if no tournament, just del player
			players.deleteById(p_id);
		} else if (p_id == null) {
			// if no player, just del tournament
			tournaments.deleteById(t_id);

		} else {
			// if got both
			Tournament t = tournaments.findById(t_id).get();
			Player p = players.findById(p_id).get();
			// - remove the mapping
			t.setPlayers(new ArrayList<>());
			p.setTournaments(new ArrayList<>());
			// - save the changes
			players.save(p);
			tournaments.save(t);
			// - delete both objects
			tournaments.deleteById(t_id);
			players.deleteById(p_id);
		}

	}

	/* START OF TESTING */
	@Test // getAllRegisteredPlayerByTournamentId - case 1 : valid tournament id
	public void getAllRegisteredPlayerByTournamentId_ValidTournamentId_Success() throws Exception {

		// input - create tournament and player
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		String p_id = "userTesting123";
		Player player = players.save(new Player(p_id, new ArrayList<>()));

		// map the player and tournament
		mapTournamentPlayer(tournament, player);

		// prepare the uri
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players");

		// perform the get request - need to use array with a ReponseEntity here
		ResponseEntity<Player[]> result = restTemplate.getForEntity(uri, Player[].class);
		Player[] playerArr = result.getBody();

		assertEquals(200, result.getStatusCode().value());
		assertEquals(1, playerArr.length);

		// delete
		restart(t_id, p_id);

	}

	@Test // getAllRegisteredPlayerByTournamentId - case 2 : invalid tournament id
	public void getAllRegisteredPlayerByTournamentId_InvalidTournamentId_Failure() throws Exception {

		// input - create invalid tournament
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		tournaments.deleteById(t_id);

		// prepare the uri
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players");
		// call api
		String result = restTemplate.getForObject(uri, String.class);
		// verify output
		assertTrue(result.contains("\"status\":404"));

	}

	@Test // getTournamentsByPlayer - case 1 : valid player id
	public void getTournamentsByPlayer_ValidPlayerId_Success() throws Exception {

		// input
		Player player = players.save(new Player("usertesting123", new ArrayList<>()));
		Tournament tournament = tournaments.save(mockTournament("noError"));

		mapTournamentPlayer(tournament, player);

		// function
		URI uri = new URI(baseURL + port + "/tournaments/players/" + player.getId());

		ResponseEntity<Tournament[]> result = restTemplate.getForEntity(uri, Tournament[].class);
		Tournament[] tournamentArr = result.getBody();

		// output validation
		assertEquals(200, result.getStatusCode().value());
		assertEquals(1, tournamentArr.length); // tbc add repopulate data

		// reset
		restart(tournament.getId(), player.getId());

	}

	@Test // getTournamentsByPlayer - case 2 : invalid player id
	public void getTournamentsByPlayer_InvalidPlayerId_Failure() throws Exception {

		// input
		Player player = players.save(new Player("usertesting123", new ArrayList<>()));
		players.deleteById(player.getId());

		// prepare the uri
		URI uri = new URI(baseURL + port + "/tournaments/players/" + player.getId());
		// call api
		String result = restTemplate.getForObject(uri, String.class);
		// verify output
		assertTrue(result.contains("\"status\":404"));

	}

	@Test // isRegistered - case 1 : valid tournament id and player is registered
	public void isRegistered_ValidTournamentIdAndPlayerRegistered_Success() throws Exception {
		// input - valid tournament
		Tournament tournament = tournaments.save(mockTournament("noError"));
		Player player = players.save(new Player("usertesting123", new ArrayList<>()));

		Long t_id = tournament.getId();
		String p_id = player.getId();

		mapTournamentPlayer(tournament, player);

		// prepare the uri
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id);
		// call api
		String result = restTemplate.getForObject(uri, String.class);

		// verify output
		assertTrue(result.contains("\"IsRegistered\":true"));

		restart(t_id, p_id);

	}

	@Test // isRegistered - case 2 : valid tournament id and player is not registered
	public void isRegistered_ValidTournamentIdAndPlayerNotRegistered_Success() throws Exception {
		// input - valid tournament
		Tournament tournament = tournaments.save(mockTournament("noError"));
		Player player = players.save(new Player("usertesting123", new ArrayList<>()));

		Long t_id = tournament.getId();
		String p_id = player.getId();

		// prepare the uri
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id);
		// call api
		String result = restTemplate.getForObject(uri, String.class);

		// verify output
		assertTrue(result.contains("\"IsRegistered\":false"));

		restart(t_id, p_id);

	}

	@Test // isRegistered - case 3 : invalid tournament id
	public void isRegistered_InvalidTournamentId_Failure() throws Exception {
		// input - valid tournament
		Tournament tournament = tournaments.save(mockTournament("noError"));
		Player player = players.save(new Player("usertesting123", new ArrayList<>()));

		Long t_id = tournament.getId();
		String p_id = player.getId();

		tournaments.deleteById(t_id);

		// prepare the uri
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id);
		// call api
		String result = restTemplate.getForObject(uri, String.class);

		// verify output
		assertTrue(result.contains("\"status\":404"));

		restart(null, p_id);
	}

	@Test // registerPlayer - case 1 : valid tournament id
	public void registerPlayer_ValidTournamentId_Success() throws Exception {

		// input - tournament and player
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/register");

		ResponseEntity<Player> result = restTemplate.postForEntity(uri, tournament, Player.class);
		// List<Tournament> t_list = result.getBody().getTournaments(); // technically
		// no tournament in the json
		String result_id = result.getBody().getId();

		// verify output result
		assertEquals(200, result.getStatusCode().value());
		// assertEquals(1, t_list.size()); // t_list end up null
		assertEquals(p_id, result_id);

		// reset
		restart(t_id, p_id);

	}

	@Test // registerPlayer - case 2 : invalid tournament id
	public void registerPlayer_InvalidTournamentId_Failure() throws Exception {

		// input - tournament and player
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();
		tournaments.deleteById(t_id);

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/register");

		ResponseEntity<Player> result = restTemplate.postForEntity(uri, tournament, Player.class);

		// verify output result
		assertEquals(404, result.getStatusCode().value());

		// reset
		restart(null, p_id);

	}

	@Test // deregisterPlayer - case 1 : both id are valid
	public void deregisterPlayer_ValidTournamentAndPlayerId_Success() throws Exception {

		// input - tournament and player
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		mapTournamentPlayer(tournament, player);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/deregister");

		ResponseEntity<Player> result = restTemplate.exchange(uri, HttpMethod.PUT, null, Player.class);
		String result_id = result.getBody().getId();

		// verify output result
		assertEquals(200, result.getStatusCode().value());
		assertEquals(result_id, p_id);

		// reset
		restart(t_id, p_id);

	}

	@Test // deregisterPlayer - case 2 : tournament id not valid
	public void deregisterPlayer_InvalidTournamentId_Failure() throws Exception {

		// input - tournament and player
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();
		tournaments.deleteById(t_id);

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/deregister");

		ResponseEntity<Player> result = restTemplate.exchange(uri, HttpMethod.PUT, null, Player.class);
		String result_id = result.getBody().getId();

		// verify output result
		assertEquals(404, result.getStatusCode().value());

		// reset
		restart(null, p_id);

	}

	@Test // deregisterPlayer - case 3 : player id not valid
	public void deregisterPlayer_InvalidPlayerId_Failure() throws Exception {

		// input - tournament and player
		Tournament tournament = mockTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		mapTournamentPlayer(tournament, player);

		players.deleteById(p_id);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/deregister");

		ResponseEntity<Player> result = restTemplate.exchange(uri, HttpMethod.PUT, null, Player.class);
		// verify output result
		assertEquals(404, result.getStatusCode().value());

		// reset
		restart(null, p_id);

	}

	@Test // delete player - case 1 : valid player id w no tournament mapping
	public void deletePlayer_ValidPlayerId_Success() throws Exception {
		// input - valid player id
		Player player = new Player("usertesting123", new ArrayList<>());
		String p_id = players.save(player).getId();
		// call api
		URI uri = new URI(baseURL + port + "/tournaments/players/" + p_id);

		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);
		// verify the output
		assertEquals(200, result.getStatusCode().value());
		Optional<Player> emptyValue = Optional.empty();
		assertEquals(emptyValue, players.findById(p_id));
	}

	@Test // delete player - case 2 : valid player id w tournament mapping
	public void deletePlayer_ValidPlayerIdWithTournamentMapping_Success() throws Exception {
		// input - valid player and tournament
		Player player = new Player("usertesting123", new ArrayList<>());
		String p_id = players.save(player).getId();

		Tournament tournament = tournaments.save(mockTournament("noError"));
		mapTournamentPlayer(tournament, player);

		// call api
		URI uri = new URI(baseURL + port + "/tournaments/players/" + p_id);

		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);
		// verify the output
		assertEquals(200, result.getStatusCode().value());
		Optional<Player> emptyValue = Optional.empty();
		assertEquals(emptyValue, players.findById(p_id));
	}

	@Test // delete player - case 3 : invalid player id
	public void deletePlayer_InvalidPlayerId_Failure() throws Exception {
		// input - invalid player
		Player player = new Player("usertesting123", new ArrayList<>());
		String p_id = players.save(player).getId();
		players.deleteById(p_id);

		// call api
		URI uri = new URI(baseURL + port + "/tournaments/players/" + p_id);

		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);
		// verify the output
		assertEquals(404, result.getStatusCode().value());
	}

}
