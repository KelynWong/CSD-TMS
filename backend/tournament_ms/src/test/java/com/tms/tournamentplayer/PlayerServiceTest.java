package com.tms.tournamentplayer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tms.TestHelper;
import com.tms.exception.*;
import com.tms.tournament.*;

@ExtendWith(MockitoExtension.class)
public class PlayerServiceTest {

    @Mock
    private TournamentRepository tournaments;
    @Mock
    private PlayerRepository players;
    @Mock
    private AutoStatusUpdateService autoStatusUpdateService;

    @InjectMocks
    private PlayerService playerService;
    @InjectMocks
    private TestHelper helper;

    /* TEST CASES */

    @Test // case 1 : valid tournament id (return playerList)
    void getAllPlayersByTournamentId_ValidTournamentId_ReturnTournaments() {
        // Arrange
        // - mock objects (tournament and playerList)
        Tournament tournament = helper.createTournamentObj();
        Long t_id = tournament.getId();
        Optional<Tournament> optTournament = Optional.of(tournament);

        Player player = helper.createPlayerObj();
        List<Player> playerList = new ArrayList<>();
        playerList.add(player);

        // - mock methods/operations
        when(tournaments.findById(t_id)).thenReturn(optTournament);
        doNothing().when(autoStatusUpdateService).autoUpdateTournament(tournament);
        // what to do with - return tournament.getPlayers();

        // Act
        List<Player> retrievedPlayerList = playerService.getAllPlayersByTournamentId(t_id);

        // Assert
        assertNotNull(retrievedPlayerList);
        verify(tournaments).findById(t_id);
        verify(autoStatusUpdateService).autoUpdateTournament(tournament);
    }

    @Test // case 2 : invalid tournament id (throw TournamentNotFoundException)
    void getAllPlayersByTournamentId_InvalidTournamentId_ThrowException() {
        // Arrange
        // - mock objects (tournament and playerList)
        Long id = 0L;

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(Optional.empty());

        // Act
        // Assert
        assertThrows(TournamentNotFoundException.class, () -> playerService.getAllPlayersByTournamentId(id));
        verify(tournaments).findById(id);
    }

    @Test // case 1 : valid player (return tournamentList)
    void getAllTournamentsByPlayerId_Valid_ReturnTournaments() {
        // Arrange
        // - mock objects (player)
        Player player = helper.createPlayerObj();
        String p_id = player.getId();
        Optional<Player> optPlayer = Optional.of(player);

        Tournament tournament = helper.createTournamentObj();
        List<Tournament> tournamentList = new ArrayList<>();
        tournamentList.add(tournament);

        // - mock methods/operations
        when(players.findById(p_id)).thenReturn(optPlayer);
        // doNothing().when(autoStatusUpdateService).autoUpdateTournaments(tournamentList);

        // Act
        List<Tournament> retrievedTournamentList = playerService.getAllTournamentsByPlayerId(p_id);

        // Assert
        assertNotNull(retrievedTournamentList);
        verify(players).findById(p_id);
        // verify(autoStatusUpdateService).autoUpdateTournaments(tournamentList);
    }

    @Test // case 2 : invalid tournament id (throw PlayerNotFoundException)
    void getAllTournamentsByPlayerId_InvalidTournamentId_ThrowException() {
        // Arrange
        // - mock objects
        String id = "invalid";

        // - mock methods/operations
        when(players.findById(id)).thenReturn(Optional.empty());

        // Act
        // Assert
        assertThrows(PlayerNotFoundException.class, () -> playerService.getAllTournamentsByPlayerId(id));
        verify(players).findById(id);
    }

    @Test // getPlayer - case 1 : found player (return player)
    void getPlayer_Found_ReturnPlayer() {
        // Arrange
        // - mock object (player)
        Player player = helper.createPlayerObj();
        String id = player.getId();
        Optional<Player> optPlayer = Optional.of(player);
        // - mock methods/operations
        when(players.findById(id)).thenReturn(optPlayer);

        // Act
        Player savedPlayer = playerService.getPlayer(id);

        // Assert
        assertNotNull(savedPlayer);
        verify(players).findById(id);
    }

    @Test // getPlayer - case 2 : not found player (return null)
    void getPlayer_NotFound_ReturnNull() {
        // Arrange
        // - mock id
        String id = "";
        // - mock methods/operations
        when(players.findById(id)).thenReturn(Optional.empty());

        // Act
        Player savedPlayer = playerService.getPlayer(id);

        // Assert
        assertNull(savedPlayer);
        verify(players).findById(id);
    }

    @Test // case 1 : new player id (return player)
    void createPlayer_playerIdDontExist_returnPlayer() {
        // Arrange
        // - mock objects (player obj)
        Player player = helper.createPlayerObj();
        String id = player.getId();

        // - mock operations
        when(players.existsById(id)).thenReturn(false);
        when(players.save(player)).thenReturn(player);

        // Act
        Player createdPlayer = playerService.createPlayer(id);

        // Assert
        assertNotNull(createdPlayer);
        assertEquals(createdPlayer.getId(), id);
        verify(players).existsById(id);
        verify(players).save(player);

    }

    @Test // case 2 : player id exist (return null)
    void createPlayer_playerIdExist_returnNull() {
        // Arrange
        // - mock objects (player obj)
        String id = "existLiao";

        // - mock operations
        when(players.existsById(id)).thenReturn(true);

        // Act
        Player createdPlayer = playerService.createPlayer(id);

        // Assert
        assertNull(createdPlayer);
        verify(players).existsById(id);

    }

    @Test // case 1 : player not map to tournment (return mappedPlayer)
    void addPlayerToTournament_PlayerNotInTournament_returnPlayer() {
        // Arrange
        // - mock objects (player and tournament)
        Player player = helper.createPlayerObj();
        Tournament tournament = helper.createTournamentObj();

        // - mock operations
        when(players.save(player)).thenReturn(player);

        // Act
        Player mappedPlayer = playerService.addPlayerToTournament(player, tournament);

        // verify
        assertEquals(1, mappedPlayer.getTournaments().size());
        verify(players).save(player);

    }

    @Test // case 2 : player mapped to tournament liao (return mappedPlayer)
    void addPlayerToTournament_PlayerAlrdyInTournament_returnPlayer() {
        // Arrange
        // - mock objects (player and tournament)
        Player player = helper.createPlayerObj();
        Tournament tournament = helper.createTournamentObj();
        helper.mapTournamentPlayerInDB(tournament, player);

        // - mock operations
        when(players.save(player)).thenReturn(player);

        // Act
        Player mappedPlayer = playerService.addPlayerToTournament(player, tournament);

        // verify
        assertEquals(1, mappedPlayer.getTournaments().size());
        verify(players).save(player);

    }

    @Test // case 1 : player is map to tournament (return player)
    void removePlayerFromTournament_PlayerInTournament_returnPlayer() {
        // Arrange
        // - mock objects (player and tournament -> map them)
        Player player = helper.createPlayerObj();
        Tournament tournament = helper.createTournamentObj();
        tournament.addPlayer(player);

        // - mock operations
        when(players.save(player)).thenReturn(player);

        // Act
        Player unmappedPlayer = playerService.removePlayerFromTournament(player, tournament);

        // verify
        assertEquals(0, unmappedPlayer.getTournaments().size());
        verify(players).save(player);

    }

    @Test // case 2 : player is not map to tournament (return null)
    void removePlayerFromTournament_PlayerNotInTournament_returnNull() {
        // Arrange
        // - mock objects (player and tournament)
        Player player = helper.createPlayerObj();
        Tournament tournament = helper.createTournamentObj();

        // Act
        Player unmappedPlayer = playerService.removePlayerFromTournament(player, tournament);

        // verify
        assertNull(unmappedPlayer);

    }

    @Test // case 1 : valid player with no mapping to tournaments
    void deletePlayer_FoundWithoutMapping_returnPlayer() {
        // Arrange
        // - mock objects (player)
        Player player = helper.createPlayerObj();
        String id = player.getId();
        Optional<Player> optPlayer = Optional.of(player);

        // - mock methods/operations
        when(players.findById(id)).thenReturn(optPlayer);
        doNothing().when(players).delete(player);

        // Act
        Player deletedPlyaer = playerService.deletePlayer(id);

        // Assert
        assertNotNull(deletedPlyaer);
        verify(players).findById(id);
        verify(players).delete(player);
    }

    @Test // case 2 : valid player with mapping to tournaments
    void deletePlayer_FoundWithMapping_returnPlayer() {
        // Arrange
        // - mock objects (player and tournament)
        Player player = helper.createPlayerObj();
        Tournament tournament = helper.createTournamentObj();
        tournament.addPlayer(player);

        String p_id = player.getId();
        Optional<Player> optPlayer = Optional.of(player);

        // - mock methods/operations
        when(players.findById(p_id)).thenReturn(optPlayer);
        when(players.save(player)).thenReturn(player); // from removeAllPlayerTournament
        doNothing().when(players).delete(player);

        // Act
        Player deletedPlayer = playerService.deletePlayer(p_id);

        // Assert
        assertNotNull(deletedPlayer);
        verify(players).findById(p_id);
        verify(players).save(player);
        verify(players).delete(player);
    }

    @Test // case 3 : invalid player
    void deletePlayer_NotFound_returnNull() {
        // Arrange
        // - mock objects (player)
        String id = "";

        // - mock methods/operations
        when(players.findById(id)).thenReturn(Optional.empty());

        // Act
        Player retrievedPlayer = playerService.deletePlayer(id);

        // Assert
        assertNull(retrievedPlayer);
        verify(players).findById(id);
    }

}
