package com.tms.tournamentplayer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.URI;
import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import com.tms.TestHelper;
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

	/* HELPER CLASS */
	private TestHelper helper = new TestHelper(tournaments, players);

	/* START OF TESTING */
	@Test // getAllRegisteredPlayerByTournamentId - case 1 : valid tournament id
	public void getAllRegisteredPlayerByTournamentId_ValidTournamentId_Success() throws Exception {

		// input - valid tournament id (create tournament and player -> map them)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		String p_id = "userTesting123";
		Player player = players.save(new Player(p_id, new ArrayList<>()));

		helper.mapTournamentPlayer(tournament, player);

		// call the api
		// - prepare the uri
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players");
		// - perform the get request : need to use array with a ReponseEntity here
		ResponseEntity<Player[]> result = restTemplate.getForEntity(uri, Player[].class);
		Player[] playerArr = result.getBody();

		// verify the output - 200 (OK) : got tournament's players (ans is only 1, check if tt is correct)
		assertEquals(200, result.getStatusCode().value());
		assertEquals(1, playerArr.length);

		// helper.reset
		helper.reset(t_id, p_id);

	}

	@Test // getAllRegisteredPlayerByTournamentId - case 2 : invalid tournament id
	public void getAllRegisteredPlayerByTournamentId_InvalidTournamentId_Failure() throws Exception {

		// input - invalid tournament id (create tournament -> del it)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		tournaments.deleteById(t_id);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players");
		String result = restTemplate.getForObject(uri, String.class);

		// verify output - 404 (TournamentNotFoundException)
		assertTrue(result.contains("\"status\":404"));

	}

	@Test // getTournamentsByPlayer - case 1 : valid player id
	public void getTournamentsByPlayer_ValidPlayerId_Success() throws Exception {

		// input - valid player id (create player and tournament -> map them)
		Player player = players.save(helper.createTestPlayer());
		Tournament tournament = tournaments.save(helper.createTestTournament("noError"));

		helper.mapTournamentPlayer(tournament, player);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/players/" + player.getId());
		ResponseEntity<Tournament[]> result = restTemplate.getForEntity(uri, Tournament[].class);
		Tournament[] tournamentArr = result.getBody();

		// verify the output - 200 (OK) : got player's tournaments (ans is only 1, check if tt is correct)
		assertEquals(200, result.getStatusCode().value());
		assertEquals(1, tournamentArr.length); 

		// helper.reset
		helper.reset(tournament.getId(), player.getId());

	}

	@Test // getTournamentsByPlayer - case 2 : invalid player id
	public void getTournamentsByPlayer_InvalidPlayerId_Failure() throws Exception {

		// input - invalid player id (create player -> del it)
		Player player = players.save(helper.createTestPlayer());
		players.deleteById(player.getId());

		// call the api 
		URI uri = new URI(baseURL + port + "/tournaments/players/" + player.getId());
		String result = restTemplate.getForObject(uri, String.class);

		// verify output - 404 (PlayerNotFoundException)
		assertTrue(result.contains("\"status\":404"));

	}

	@Test // isRegistered - case 1 : valid tournament id and player is registered
	public void isRegistered_ValidTournamentIdAndPlayerRegistered_Success() throws Exception {
		
		// input - all valid and got mapping (create tournament and player -> map them)
		Tournament tournament = tournaments.save(helper.createTestTournament("noError"));
		Player player = players.save(helper.createTestPlayer());

		Long t_id = tournament.getId();
		String p_id = player.getId();

		helper.mapTournamentPlayer(tournament, player);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id);
		String result = restTemplate.getForObject(uri, String.class);

		// verify output - 200 (OK) : player registered (result true)
		assertTrue(result.contains("\"status\":200"));
		assertTrue(result.contains("\"IsRegistered\":true"));

		// helper.reset
		helper.reset(t_id, p_id);

	}

	@Test // isRegistered - case 2 : valid tournament id and player is not registered
	public void isRegistered_ValidTournamentIdAndPlayerNotRegistered_Success() throws Exception {
		
		// input - all valid but no mapping (create tournament and player) 
		Long t_id = tournaments.save(helper.createTestTournament("noError")).getId();
		String p_id = players.save(helper.createTestPlayer()).getId();

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id);
		String result = restTemplate.getForObject(uri, String.class);

		// verify output - 200 (OK) : player not registered (result false)
		assertTrue(result.contains("\"status\":200"));
		assertTrue(result.contains("\"IsRegistered\":false"));

		// helper.reset 
		helper.reset(t_id, p_id);

	}

	@Test // isRegistered - case 3 : invalid tournament id
	public void isRegistered_InvalidTournamentId_Failure() throws Exception {
		
		// input - invalid tournament id (create tournament and player -> del tournament)
		Long t_id = tournaments.save(helper.createTestTournament("noError")).getId();
		String p_id = players.save(helper.createTestPlayer()).getId();

		tournaments.deleteById(t_id);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id);
		String result = restTemplate.getForObject(uri, String.class);

		// verify output result - 404 (TournamentNotFoundException)
		assertTrue(result.contains("\"status\":404"));

		// helper.reset
		helper.reset(null, p_id);
	}

	@Test // registerPlayer - case 1 : valid tournament id and not registered player
	public void registerPlayer_ValidTournamentId_NotRegisteredPlayer_Success() throws Exception {

		// input - valid tournament id (create tournament and player)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/register");
		ResponseEntity<Player> result = restTemplate.postForEntity(uri, tournament, Player.class);
		String result_id = result.getBody().getId();

		// verify output result - 200 (OK) : player-tournament map successful (check if correct player id returned)
		assertEquals(200, result.getStatusCode().value());
		assertEquals(p_id, result_id);

		// helper.reset
		helper.reset(t_id, p_id);

	}

	@Test // registerPlayer - case 2 : valid tournament id and registered player
	public void registerPlayer_ValidTournamentId_RegisteredPlayer_Success() throws Exception {

		// input - valid tournament id (create tournament and player -> map them)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		helper.mapTournamentPlayer(tournament, player);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/register");
		ResponseEntity<Player> result = restTemplate.postForEntity(uri, tournament, Player.class);
		String result_id = result.getBody().getId();

		// verify output result - 200 (OK) : player-tournament map successful (check if correct player id returned)
		assertEquals(200, result.getStatusCode().value());
		assertEquals(p_id, result_id);

		// helper.reset
		helper.reset(t_id, p_id);

	}

	@Test // registerPlayer - case 3 : invalid tournament id
	public void registerPlayer_InvalidTournamentId_Failure() throws Exception {

		// input - invalid tournament id (create tournament and player -> del tournament)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		tournaments.deleteById(t_id);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/register");
		ResponseEntity<Player> result = restTemplate.postForEntity(uri, tournament, Player.class);

		// verify output result - 404 (TournamentNotFoundException)
		assertEquals(404, result.getStatusCode().value());

		// helper.reset
		helper.reset(null, p_id);

	}

	@Test // deregisterPlayer - case 1 : both id are valid
	public void deregisterPlayer_ValidTournamentAndPlayerId_Success() throws Exception {

		// input - valid tournament and player id (create both obj -> map them)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		helper.mapTournamentPlayer(tournament, player);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/deregister");

		ResponseEntity<Player> result = restTemplate.exchange(uri, HttpMethod.PUT, null, Player.class);
		String result_id = result.getBody().getId();

		// verify output result - 200 (OK) : player-tournament mapping removed (check correct player id returned)
		assertEquals(200, result.getStatusCode().value());
		assertEquals(result_id, p_id);

		// helper.reset
		helper.reset(t_id, p_id);

	}

	@Test // deregisterPlayer - case 2 : tournament id not valid
	public void deregisterPlayer_InvalidTournamentId_Failure() throws Exception {

		// input - invalid tournament id but valid player id (create both obj -> del tournament)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();
		tournaments.deleteById(t_id);

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/deregister");
		ResponseEntity<Player> result = restTemplate.exchange(uri, HttpMethod.PUT, null, Player.class);

		// verify output result - 404 (TournamentNotFoundException)
		assertEquals(404, result.getStatusCode().value());

		// helper.reset
		helper.reset(null, p_id);

	}

	@Test // deregisterPlayer - case 3 : player id not valid
	public void deregisterPlayer_InvalidPlayerId_Failure() throws Exception {

		// input - invalid player id but valid tournament id (create both obj -> map them -> del player)
		Tournament tournament = helper.createTestTournament("noError");
		Long t_id = tournaments.save(tournament).getId();

		Player player = new Player("userTesting234", new ArrayList<>());
		String p_id = players.save(player).getId();

		helper.mapTournamentPlayer(tournament, player);

		players.deleteById(p_id);

		// call the api
		URI uri = new URI(baseURL + port + "/tournaments/" + t_id + "/players/" + p_id + "/deregister");
		ResponseEntity<Player> result = restTemplate.exchange(uri, HttpMethod.PUT, null, Player.class);
		
		// verify output result - 404 (PlayerNotFoundException)
		assertEquals(404, result.getStatusCode().value());

		// helper.reset
		helper.reset(null, p_id);

	}

	@Test // delete player - case 1 : valid player id w no tournament mapping
	public void deletePlayer_ValidPlayerId_Success() throws Exception {
		
		// input - valid player id (create player)
		Player player = helper.createTestPlayer();
		String p_id = players.save(player).getId();

		// call api
		URI uri = new URI(baseURL + port + "/tournaments/players/" + p_id);
		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);

		// verify the output - 200 (OK) : player deleted
		assertEquals(200, result.getStatusCode().value());
		Optional<Player> emptyValue = Optional.empty(); // findbyId alw return Optional dtype
		assertEquals(emptyValue, players.findById(p_id));
	}

	@Test // delete player - case 2 : valid player id w tournament mapping
	public void deletePlayer_ValidPlayerIdWithTournamentMapping_Success() throws Exception {
		
		// input - valid player w mapping (create both player and tournament -> map them)
		Player player = helper.createTestPlayer();
		String p_id = players.save(player).getId();

		Tournament tournament = tournaments.save(helper.createTestTournament("noError"));
		helper.mapTournamentPlayer(tournament, player); // map them

		// call api
		URI uri = new URI(baseURL + port + "/tournaments/players/" + p_id);
		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);

		// verify the output - 200 (OK) : player deleted (check empty optional is returned) 
		assertEquals(200, result.getStatusCode().value());
		Optional<Player> emptyValue = Optional.empty(); // findbyId alw return Optional dtype
		assertEquals(emptyValue, players.findById(p_id));
	}

	@Test // delete player - case 3 : invalid player id
	public void deletePlayer_InvalidPlayerId_Failure() throws Exception {
		
		// input - invalid player id (create new player -> delete it)
		Player player = helper.createTestPlayer();
		String p_id = players.save(player).getId();
		players.deleteById(p_id);

		// call api
		URI uri = new URI(baseURL + port + "/tournaments/players/" + p_id);
		ResponseEntity<Void> result = restTemplate.exchange(uri, HttpMethod.DELETE, null, Void.class);

		// verify the output - 404 (PlayerNotFoundException)
		assertEquals(404, result.getStatusCode().value());
	}

}
