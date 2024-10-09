package com.tms.tournament;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tms.tournamentplayer.Player;

import lombok.extern.slf4j.Slf4j;

@ExtendWith(MockitoExtension.class)
@Slf4j
public class TournamentServiceTest {
    
    @Mock
    private TournamentRepository tournaments;

    @InjectMocks
    private TournamentServiceImpl tournamentService;

    /* Unit Testing */

    /* addTournament() - 
     * 1. newName
     * 2. sameName
    */
    @Test
    void addTournament_NewName_ReturnSavedTournament() {
        // Arrange
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

    /* updateTournament() - 
     * 1. Found
     * 2. NotFound
    */

    @Test
    void updateTournament_Found_ReturnSavedTournament() {
        // Arrange
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






   


}