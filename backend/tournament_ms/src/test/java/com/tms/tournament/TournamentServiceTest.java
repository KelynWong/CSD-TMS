package com.tms.tournament;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
    /* addTournament() BLACKLIST
     *  1- tournament tile cannot be empty
     *  2- tournament title needs to be unique
     *  3- tournament startDT cannot be aft tournament endDT
     *  4- tournament regStartDT cannot be after tournament regEndDT
     *  5- regStartDT n regEndDT cannot be after tournament startDT
     */
    @Test
    void addTournament_Success_ReturnSavedTournament() {
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

        Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);

        // - mock methods/operations
        when(tournamentService.tournamentInputValidation(any(Tournament.class))).thenReturn(true);
        when(tournaments.save(any(Tournament.class))).thenReturn(tournament);

        // Act 
        Tournament savedTournament = tournamentService.addTournament(tournament);

        // Assert
        assertNotNull(savedTournament);
        verify(tournamentService).tournamentInputValidation(tournament);

    }

    @Test
    void tournamentInputValidation_SameName_ReturnFalse() {
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

        Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);
        List<Tournament> tournamentOfSameName = new ArrayList<>();
        tournamentOfSameName.add(tournament);

        // - mock methods/operations
        when(tournaments.findByTournamentName(any(String.class))).thenReturn(tournamentOfSameName);

        // Act 
        boolean result = tournamentService.tournamentInputValidation(tournament);

        // Assert
        assertFalse(result);
        verify(tournaments).findByTournamentName(tournament.getTournamentName());
    }

    @Test
    void tournamentInputValidation_EmptyName_ReturnFalse() {

        // Arrange
        // - mock objects
        Long id = Long.valueOf(0);
        String tournamentName = "";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        String status = "Scheduled";
        String createdBy = "admin1";
        String winner = null;
        List<Player> players = new ArrayList<>();

        Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);

        // - mock methods/operations
        when(any(Tournament.class).getTournamentName()).thenReturn("");

        // Act 
        boolean result = tournamentService.tournamentInputValidation(tournament);

        // Assert
        assertFalse(result);
        verify(tournament).getTournamentName();
        
    }

    @Test
    void tournamentInputValidation_regStartDTAftRegEndDT_ReturnFalse() {

        // Arrange
        // - mock objects
        Long id = Long.valueOf(0);
        String tournamentName = "";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        String status = "Scheduled";
        String createdBy = "admin1";
        String winner = null;
        List<Player> players = new ArrayList<>();

        Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);

        // - mock methods/operations
        when(any(LocalDateTime.class).isBefore(any(LocalDateTime.class))).thenReturn(true);

        // Act 
        boolean result = tournamentService.tournamentInputValidation(tournament);

        // Assert
        assertFalse(result);
        verify(tournament.getRegEndDT()).isBefore(tournament.getRegStartDT());

    }

    @Test
    void tournamentInputValidation_startDTAftendDT_ReturnFalse() {

        // Arrange
        // - mock objects
        Long id = Long.valueOf(0);
        String tournamentName = "";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        String status = "Scheduled";
        String createdBy = "admin1";
        String winner = null;
        List<Player> players = new ArrayList<>();

        Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);

        // - mock methods/operations
        when(any(LocalDateTime.class).isBefore(any(LocalDateTime.class))).thenReturn(true);

        // Act 
        boolean result = tournamentService.tournamentInputValidation(tournament);

        // Assert
        assertFalse(result);
        verify(tournament.getEndDT()).isBefore(tournament.getStartDT());
        
    }

    @Test
    void tournamentInputValidation_regEndDTAftStartDT_ReturnFalse() {
        // Arrange
        // - mock objects
        Long id = Long.valueOf(0);
        String tournamentName = "";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        String status = "Scheduled";
        String createdBy = "admin1";
        String winner = null;
        List<Player> players = new ArrayList<>();

        Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);

        // - mock methods/operations
        when(any(LocalDateTime.class).isAfter(any(LocalDateTime.class))).thenReturn(true);

        // Act 
        boolean result = tournamentService.tournamentInputValidation(tournament);

        // Assert
        assertFalse(result);
        verify(tournament.getRegEndDT()).isAfter(tournament.getStartDT());

    }

    @Test
    void tournamentInputValidation_wrongStatus_ReturnFalse() {
        // Arrange
        // - mock objects
        Long id = Long.valueOf(0);
        String tournamentName = "";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        String status = "HappyBirthday";
        String createdBy = "admin1";
        String winner = null;
        List<Player> players = new ArrayList<>();

        Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);
        
        List<String> statusList = new ArrayList<>(Arrays.asList("Scheduled", "RegistrationStart", "RegistrationClose", "InProgress", "Completed"));

        // - mock methods/operations
        when(!statusList.contains(any(String.class))).thenReturn(true);

        // Act 
        boolean result = tournamentService.tournamentInputValidation(tournament);

        // Assert
        assertFalse(result);
        verify(statusList).contains(tournament.getStatus());

    }

    /* updateTournament() BLACKLIST
     *  - tournament tile cannot be empty
     *  - tournament title needs to be unique
     *  - tournament startDT cannot be aft tournament endDT
     *  - tournament regStartDT cannot be after tournament regEndDT
     *  - regStartDT n regEndDT cannot be after tournament startDT
     */
    @Test
    void updateTournament_Found_returnSavedTournament() {
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

        Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);

        // - mock methods/operations
        when(tournamentService.tournamentInputValidation(any(Tournament.class))).thenReturn(true);
        when(tournaments.save(any(Tournament.class))).thenReturn(tournament);

        // Act 
        Tournament savedTournament = tournamentService.updateTournament(tournament.getId(), tournament);

        // Assert
        assertNotNull(savedTournament);
        verify(tournamentService).tournamentInputValidation(tournament);
    }
    @Test
    void updateTournament_WrongInput_ReturnNull() {
        // Arrange
        // - mock objects
        Long id = Long.valueOf(0);
        String tournamentName = "";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        String status = "Scheduled";
        String createdBy = "admin1";
        String winner = null;
        List<Player> players = new ArrayList<>();

        Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);

        // - mock methods/operations
        when(tournamentService.tournamentInputValidation(any(Tournament.class))).thenReturn(false);

        // Act 
        Tournament savedTournament = tournamentService.updateTournament(tournament.getId(), tournament);

        // Assert
        assertNull(savedTournament);
        verify(tournamentService).tournamentInputValidation(tournament);
        
    }

    @Test
    void updateTournament_NotFound_ReturnNull() {

        // Arrange
        // - mock objects
        Long id = Long.valueOf(0);
        String tournamentName = "";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        String status = "Scheduled";
        String createdBy = "admin1";
        String winner = null;
        List<Player> players = new ArrayList<>();

        Tournament tournament = new Tournament(id, tournamentName, regStartDT, regEndDT, status, startDT, endDT, createdBy, winner, players);

        // - mock methods/operations
        when(tournamentService.tournamentInputValidation(any(Tournament.class))).thenReturn(true);
        when(tournaments.findById(any(Long.class))).thenReturn(null);

        // Act 
        Tournament savedTournament = tournamentService.updateTournament(tournament.getId(), tournament);

        // Assert
        assertNull(savedTournament);
        verify(tournaments).findById(tournament.getId());

    }

}