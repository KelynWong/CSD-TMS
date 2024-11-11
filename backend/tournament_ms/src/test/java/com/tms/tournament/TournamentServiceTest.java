package com.tms.tournament;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.EmptyResultDataAccessException;

import com.tms.TestHelper;
import com.tms.exception.TournamentNotFoundException;
import com.tms.tournamentplayer.*;

import lombok.extern.slf4j.Slf4j;

@ExtendWith(MockitoExtension.class)
@Slf4j
public class TournamentServiceTest {

    @Mock
    private TournamentRepository tournaments;

    @InjectMocks
    private TournamentServiceImpl tournamentService;

    @Mock
    private AutoStatusUpdateService autoStatusUpdateService;

    @InjectMocks
    private TestHelper helper;

    /* Unit Testing */

    /* listTournaments() */
    @Test
    void listTournaments_ReturnTournaments() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTournamentObj();
        List<Tournament> tournamentList = new ArrayList<>();
        tournamentList.add(tournament);

        // - mock methods/operations
        when(tournaments.findAll()).thenReturn(tournamentList);
        doNothing().when(autoStatusUpdateService).autoUpdateTournaments(tournamentList);

        // Act
        List<Tournament> retrievedTournamentList = tournamentService.listTournaments();

        // Assert
        assertNotNull(retrievedTournamentList);
        verify(tournaments).findAll();
        verify(autoStatusUpdateService).autoUpdateTournaments(tournamentList);
    }

    /*
     *  getTournamentsByStatus()
     *  // Assumption : its valid status 
     */
     @Test
     void getTournamentsByStatus_ReturnTournaments() {
         // Arrange
         // - mock objects
         Tournament tournament = helper.createTournamentObj();
         List<Tournament> tournamentList = new ArrayList<>();
         tournamentList.add(tournament);
         TournamentStatus status = tournament.getStatus();
 
         // - mock methods/operations
         when(tournaments.findAll()).thenReturn(tournamentList);
         doNothing().when(autoStatusUpdateService).autoUpdateTournaments(tournamentList);
         when(tournaments.findByStatus(status)).thenReturn(tournamentList);
 
         // Act
         List<Tournament> retrievedTournamentList = tournamentService.getTournamentsByStatus(status);
 
         // Assert
         assertNotNull(retrievedTournamentList);
         verify(tournaments).findAll();
         verify(autoStatusUpdateService).autoUpdateTournaments(tournamentList);
         verify(tournaments).findByStatus(status);
    }

    /*
     *  getTournamentsByTournamentName()
     *  // Assumption : its valid status 
     */
    @Test
    void getTournamentsByTournamentName_ReturnTournaments() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTournamentObj();
        List<Tournament> tournamentList = new ArrayList<>();
        tournamentList.add(tournament);
        String name = tournament.getTournamentName();

        // - mock methods/operations
        when(tournaments.findByTournamentName(name)).thenReturn(tournamentList);
        doNothing().when(autoStatusUpdateService).autoUpdateTournaments(tournamentList);

        // Act
        List<Tournament> retrievedTournamentList = tournamentService.getTournamentsByTournamentName(name);

        // Assert
        assertNotNull(retrievedTournamentList);
        verify(tournaments).findByTournamentName(name);
        verify(autoStatusUpdateService).autoUpdateTournaments(tournamentList);
   }

    /*
     * getTournament()
     * 1. Found
     * 2. Not Found
     */
    @Test
    void getTournament_Found_ReturnTournament() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTournamentObj();
        Long id = tournament.getId();

        Optional<Tournament> optTournament = Optional.of(tournament);

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(optTournament);
        doNothing().when(autoStatusUpdateService).autoUpdateTournament(tournament);

        // Act
        Tournament savedTournament = tournamentService.getTournament(id);

        // Assert
        assertNotNull(savedTournament);
        verify(tournaments).findById(id);
        verify(autoStatusUpdateService).autoUpdateTournament(tournament);
    }

    @Test
    void getTournament_NotFound_ReturnNull() {
        // Arrange
        // - mock objects
        Long id = 0L;

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(Optional.empty());

        // Act
        Tournament tournament = tournamentService.getTournament(id);

        // Assert
        assertNull(tournament);
        verify(tournaments).findById(id);
    }

    /*
     * addTournament()
     * - Assumption : input validation done alrdy in controller
     */
    @Test
    void addTournament_NewName_ReturnSavedTournament() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTournamentObj();

        // - mock methods/operations
        when(tournaments.save(any(Tournament.class))).thenReturn(tournament);

        // Act
        Tournament savedTournament = tournamentService.addTournament(tournament);

        // Assert
        assertNotNull(savedTournament);
        verify(tournaments).save(tournament);

    }

    /*
     * updateTournament()
     * 1. Found
     * 2. NotFound
     *  - Assumption : Input validation done in controller
     */
    @Test
    void updateTournament_Found_ReturnSavedTournament() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTournamentObj();
        Long id = tournament.getId();

        Optional<Tournament> optTournament = Optional.of(tournament);

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(optTournament);
        when(tournaments.save(any(Tournament.class))).thenReturn(tournament);

        // Act
        Tournament savedTournament = tournamentService.updateTournament(id, tournament);

        // Assert
        assertNotNull(savedTournament);
        verify(tournaments).findById(id);
        verify(tournaments).save(tournament);

    }

    @Test
    void updateTournament_NotFound_ReturnNull() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTournamentObj();
        Long id = tournament.getId();

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(Optional.empty());

        // Act
        Tournament savedTournament = tournamentService.updateTournament(id, tournament);

        // Assert
        assertNull(savedTournament);
        verify(tournaments).findById(id);
    }

    /*
     * deleteTournament()
     * 1. Found without mapping
     * 2. Found with mapping
     * 3. NotFound
     */
    @Test
    void deleteTournament_FoundWithoutMapping_ReturnTournament() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTournamentObj();
        Long id = tournament.getId();

        Optional<Tournament> optTournament = Optional.of(tournament);

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(optTournament);
        doNothing().when(tournaments).delete(tournament);

        // Act
        Tournament deletedTournament = tournamentService.deleteTournament(id);

        // Assert
        assertNotNull(deletedTournament);
        verify(tournaments).findById(id);
        verify(tournaments).delete(tournament);

    }

    @Test
    void deleteTournament_FoundWithMapping_ReturnTournament() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTournamentObj();
        Long id = tournament.getId();

        Player player = helper.createPlayerObj();
        tournament.addPlayer(player);

        Optional<Tournament> optTournament = Optional.of(tournament);

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(optTournament);
        when(tournaments.save(any(Tournament.class))).thenReturn(tournament);
        doNothing().when(tournaments).delete(tournament);

        // Act
        Tournament deletedTournament = tournamentService.deleteTournament(id);

        // Assert
        assertNotNull(deletedTournament);
        verify(tournaments).findById(id);
        verify(tournaments).save(tournament);
        verify(tournaments).delete(tournament);

    }

    @Test
    void deleteTournament_NotFound_ThrowException() {
        // Arrange
        // - mock objects
        Long id = 1L;

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(Optional.empty());

        // Act & Assert: Validate that the exception is thrown
        assertThrows(TournamentNotFoundException.class, () -> tournamentService.deleteTournament(id));

        // Verify that deleteById was called exactly once
        verify(tournaments).findById(id);
    }

}