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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.EmptyResultDataAccessException;

import com.tms.TestHelper;
import com.tms.TournamentServiceApplication;
import com.tms.tournamentplayer.Player;

import lombok.extern.slf4j.Slf4j;

@ExtendWith(MockitoExtension.class)
@Slf4j
public class TournamentServiceTest {

    @Mock
    private TournamentRepository tournaments;

    @InjectMocks
    private TournamentServiceImpl tournamentService;

    @InjectMocks
	private TestHelper helper;

    /* Unit Testing */

    /* listTournaments() */
    @Test
    void listTournaments_ReturnTournaments() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTestTournament("noError");

        List<Tournament> tournamentList = new ArrayList<>();
        tournamentList.add(tournament);

        // - mock methods/operations
        when(tournaments.findAll()).thenReturn(tournamentList);

        // Act
        log.info("INFO: LISTTOURNAMENTS ACT START!");
        List<Tournament> retrievedTournamentList = tournamentService.listTournaments();
        log.info("INFO: LISTTOURNAMENTS ACT END!");

        // Assert
        assertNotNull(retrievedTournamentList);
        verify(tournaments).findAll();
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
        Tournament tournament = helper.createTestTournament("noError");
        Long id = tournament.getId();

        Optional<Tournament> optTournament = Optional.of(tournament);

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(optTournament);

        // Act
        log.info("INFO: GETTOURNAMENT_FOUND ACT START!");
        Tournament savedTournament = tournamentService.getTournament(id);
        log.info("INFO: GETTOURNAMENT_FOUND ACT END!");

        // Assert
        assertNotNull(savedTournament);
        verify(tournaments).findById(id);
    }

    @Test
    void getTournament_NotFound_ReturnNull() {
        // Arrange
        // - mock objects
        Long id = 0L;

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(Optional.empty());

        // Act
        log.info("INFO: GETTOURNAMENT_NOTFOUND ACT START!");
        Tournament tournament = tournamentService.getTournament(id);
        log.info("INFO: GETTOURNAMENT_NOTFOUND ACT END!");

        // Assert
        assertNull(tournament);
        verify(tournaments).findById(id);
    }

    /*
     * addTournament()
     * 1. newName
     * 2. sameName
     */
    @Test
    void addTournament_NewName_ReturnSavedTournament() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTestTournament("noError");

        // - mock methods/operations
        when(tournaments.findByTournamentName(any(String.class))).thenReturn(new ArrayList<Tournament>());
        when(tournaments.save(any(Tournament.class))).thenReturn(tournament);

        // Act
        log.info("INFO: ADDTOURNAMENT_SUCCESS ACT START!");
        Tournament savedTournament = tournamentService.addTournament(tournament);
        log.info("INFO: ADDTOURNAMENT_SUCCESS ACT END!");

        // Assert
        assertNotNull(savedTournament);

        verify(tournaments).findByTournamentName(tournament.getTournamentName());
        verify(tournaments).save(tournament);

    }

    @Test
    void addTournament_SameName_ReturnNull() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTestTournament("noError");

        List<Tournament> tournamentOfSameName = new ArrayList<>();
        tournamentOfSameName.add(tournament);

        // - mock methods/operations
        when(tournaments.findByTournamentName(any(String.class))).thenReturn(tournamentOfSameName);

        // Act
        log.info("INFO: ADDTOURNAMENT_SAMENAME ACT START!");
        Tournament savedTournament = tournamentService.addTournament(tournament);
        log.info("INFO: ADDTOURNAMENT_SAMENAME ACT END!");

        // Assert
        assertNull(savedTournament);
        verify(tournaments).findByTournamentName(tournament.getTournamentName());
    }

    /*
     * updateTournament()
     * 1. Found
     * 2. NotFound
     */
    @Test
    void updateTournament_Found_ReturnSavedTournament() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTestTournament("noError");
        Long id = tournament.getId();

        Optional<Tournament> optTournament = Optional.of(tournament);

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(optTournament);
        when(tournaments.save(any(Tournament.class))).thenReturn(tournament);

        // Act
        log.info("INFO: UPDATETOURNAMENT_FOUND ACT START!");
        Tournament savedTournament = tournamentService.updateTournament(id, tournament);
        log.info("INFO: UPDATETOURNAMENT_FOUND ACT END!");

        // Assert
        assertNotNull(savedTournament);
        verify(tournaments).findById(id);
        verify(tournaments).save(tournament);

    }

    @Test
    void updateTournament_NotFound_ReturnNull() {
        // Arrange
        // - mock objects
        Tournament tournament = helper.createTestTournament("noError");
        Long id = tournament.getId();

        // - mock methods/operations
        when(tournaments.findById(id)).thenReturn(Optional.empty());

        // Act
        log.info("INFO: UPDATETOURNAMENT_NOTFOUND ACT START!");
        Tournament savedTournament = tournamentService.updateTournament(id, tournament);
        log.info("INFO: UPDATETOURNAMENT_NOTFOUND ACT END!");

        // Assert
        assertNull(savedTournament);
        verify(tournaments).findById(id);
    }

    /*
     * deleteTournament() - TBC
     * 1. Found
     * 2. NotFound
     */
    @Test
    void deleteTournament_Found_ReturnNothing() {
        // Arrange
        // - mock objects
        Long id = 0L;

        // - mock methods/operations
        doNothing().when(tournaments).deleteById(id);

        // Act
        log.info("INFO: DELETETOURNAMENT_FOUND ACT START!");
        tournamentService.deleteTournament(id);
        ;
        log.info("INFO: DELETETOURNAMENT_FOUND ACT END!");

        // Assert
        verify(tournaments, times(1)).deleteById(id); // Verify interaction

    }

    @Test
    void deleteTournament_NotFound_ThrowException() {
        // Arrange
        // - mock objects
        Long id = 1L;

        // - mock methods/operations
        doThrow(new EmptyResultDataAccessException(0)).when(tournaments).deleteById(id);

        // Act & Assert: Validate that the exception is thrown
        assertThrows(EmptyResultDataAccessException.class, () -> tournamentService.deleteTournament(id));

        // Verify that deleteById was called exactly once
        verify(tournaments, times(1)).deleteById(id);

    }

}