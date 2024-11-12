package com.tms.tournament;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.*;

import com.tms.TestHelper;
import com.tms.exception.TournamentNotFoundException;

@ExtendWith(MockitoExtension.class)
public class AutoStatusUpdateServiceTest {

    @Mock
    private TournamentRepository tournaments;

    @InjectMocks
    private AutoStatusUpdateService autoStatusUpdateService;
    @InjectMocks
    private TestHelper helper;

    /* Method : autoUpdateTournament */
    @Test
    void autoUpdateTournament_NotFound_ThrowException() {
        // Arrange
        // - mock object ("invalid" tournament)
        Tournament tournament = helper.createTournamentObj("noError");

        // - mock operations
        when(tournaments.existsById(tournament.getId())).thenReturn(false);

        // Act
        // Assert
        assertThrows(TournamentNotFoundException.class, () -> autoStatusUpdateService.autoUpdateTournament(tournament));
        verify(tournaments).existsById(tournament.getId());

    }

    // For rest of the test cases, testing mainly the change in status. 
    // Default status of mock obj : "Scheduled"
    @Test
    void autoUpdateTournament_Found_WithinRegPeriod_sameRegStartTime_changedToRegStart() {
        // Arrange
        // - mock obj (tournament and current datetime)
        Tournament tournament = helper.createTournamentObj("noError");
        tournament.setId(1L);

        // Get current datetime + set respective datetimes
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();
        // current datetime same as registration start datetime
        tournament.setRegStartDT(localNow);
        tournament.setRegEndDT(localNow.plusDays(2L));
        tournament.setStartDT(localNow.plusYears(1L));
        tournament.setEndDT(localNow.plusYears(2L));

        // - mock operations
        when(tournaments.existsById(tournament.getId())).thenReturn(true);
        when(tournaments.save(tournament)).thenReturn(tournament);

        // Act
        autoStatusUpdateService.autoUpdateTournament(tournament);

        // Assert
        assertEquals(TournamentStatus.REGISTRATION_START, tournament.getStatus());
        verify(tournaments).save(tournament);

    }

    @Test
    void autoUpdateTournament_Found_WithinRegPeriod_1minBeforeRegStartTime_changedToRegStart() {
        // Arrange
        // - mock obj (tournament and current datetime)
        Tournament tournament = helper.createTournamentObj("noError");
        tournament.setId(1L);

        // Get current datetime + set respective datetimes
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();
        // current datetime is 1 min before registration start datetime
        tournament.setRegStartDT(localNow.plusMinutes(1L));
        tournament.setRegEndDT(localNow.plusDays(2L));
        tournament.setStartDT(localNow.plusYears(1L));
        tournament.setEndDT(localNow.plusYears(2L));

        // - mock operations
        when(tournaments.existsById(tournament.getId())).thenReturn(true);
        when(tournaments.save(tournament)).thenReturn(tournament);

        // Act
        autoStatusUpdateService.autoUpdateTournament(tournament);

        // Assert
        assertEquals(TournamentStatus.SCHEDULED, tournament.getStatus());
        verify(tournaments).save(tournament);

    }

    @Test
    void autoUpdateTournament_Found_WithinRegPeriod_sameRegEndTime_changedToRegClose() {
        // Arrange
        // - mock obj (tournament and current datetime)
        Tournament tournament = helper.createTournamentObj("noError");
        tournament.setId(1L);

        // Get current datetime + set respective datetimes
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();
        // current datetime same as registration end datetime
        tournament.setRegStartDT(localNow.minusDays(1L));
        tournament.setRegEndDT(localNow);
        tournament.setStartDT(localNow.plusYears(1L));
        tournament.setEndDT(localNow.plusYears(2L));

        // - mock operations
        when(tournaments.existsById(tournament.getId())).thenReturn(true);
        when(tournaments.save(tournament)).thenReturn(tournament);

        // Act
        autoStatusUpdateService.autoUpdateTournament(tournament);

        // Assert
        assertEquals(TournamentStatus.REGISTRATION_CLOSE, tournament.getStatus());
        verify(tournaments).save(tournament);

    }

    @Test
    void autoUpdateTournament_Found_WithinRegPeriod_1minBeforeRegEndTime_changedToRegStart() {
        // Arrange
        // - mock obj (tournament and current datetime)
        Tournament tournament = helper.createTournamentObj("noError");
        tournament.setId(1L);

        // Get current datetime + set respective datetimes
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();
        // current datetime is 1 min before registration end datetime
        tournament.setRegStartDT(localNow.minusDays(1L));
        tournament.setRegEndDT(localNow.plusMinutes(1L));
        tournament.setStartDT(localNow.plusYears(1L));
        tournament.setEndDT(localNow.plusYears(2L));

        // - mock operations
        when(tournaments.existsById(tournament.getId())).thenReturn(true);
        when(tournaments.save(tournament)).thenReturn(tournament);

        // Act
        autoStatusUpdateService.autoUpdateTournament(tournament);

        // Assert
        assertEquals(TournamentStatus.REGISTRATION_START, tournament.getStatus());
        verify(tournaments).save(tournament);

    }

    @Test
    void autoUpdateTournament_Found_WithinRegPeriod_1minAfterRegEndTime_changedToRegClose() {
        // Arrange
        // - mock obj (tournament and current datetime)
        Tournament tournament = helper.createTournamentObj("noError");
        tournament.setId(1L);

        // Get current datetime + set respective datetimes
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();
        // current datetime is 1 min after registration end datetime
        tournament.setRegStartDT(localNow.minusDays(1L));
        tournament.setRegEndDT(localNow.minusMinutes(1L));
        tournament.setStartDT(localNow.plusYears(1L));
        tournament.setEndDT(localNow.plusYears(2L));

        // - mock operations
        when(tournaments.existsById(tournament.getId())).thenReturn(true);
        when(tournaments.save(tournament)).thenReturn(tournament);

        // Act
        autoStatusUpdateService.autoUpdateTournament(tournament);

        // Assert
        assertEquals(TournamentStatus.REGISTRATION_CLOSE, tournament.getStatus());
        verify(tournaments).save(tournament);

    }

    @Test
    void autoUpdateTournament_Found_NotMatchMakeButRegClose_ReturnRegClose() {
        // Arrange
        // - mock obj (tournament and current datetime)
        Tournament tournament = helper.createTournamentObj("noError");
        tournament.setId(1L);

        // Get current datetime + set respective datetimes
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();
        // current datetime between registration end date and event start date
        tournament.setRegStartDT(localNow.minusDays(1L));
        tournament.setRegEndDT(localNow.minusDays(1L));
        tournament.setStartDT(localNow.plusYears(1L));
        tournament.setEndDT(localNow.plusYears(2L));

        tournament.setStatus(TournamentStatus.REGISTRATION_CLOSE); // no matchmake

        // - mock operations
        when(tournaments.existsById(tournament.getId())).thenReturn(true);
        when(tournaments.save(tournament)).thenReturn(tournament);

        // Act
        autoStatusUpdateService.autoUpdateTournament(tournament);

        // Assert
        assertEquals(TournamentStatus.REGISTRATION_CLOSE, tournament.getStatus());
        verify(tournaments).save(tournament);

    }

    @Test
    void autoUpdateTournament_Found_MatchMakeAndRegClose_ReturnMatchMake() {
        // Arrange
        // - mock obj (tournament and current datetime)
        Tournament tournament = helper.createTournamentObj("noError");
        tournament.setId(1L);

        // Get current datetime + set respective datetimes
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();
        // current datetime between registration end date and event start date
        tournament.setRegStartDT(localNow.minusDays(1L));
        tournament.setRegEndDT(localNow.minusMinutes(5L));
        tournament.setStartDT(localNow.plusYears(1L));
        tournament.setEndDT(localNow.plusYears(2L));

        tournament.setStatus(TournamentStatus.MATCHMAKE); // got matchmake

        // - mock operations
        when(tournaments.existsById(tournament.getId())).thenReturn(true);

        // Act
        autoStatusUpdateService.autoUpdateTournament(tournament);

        // Assert
        assertEquals(TournamentStatus.MATCHMAKE, tournament.getStatus());

    }

    @Test
    void autoUpdateTournament_Found_NotCompeletedButWithinEventPeriod_ReturnOngoing() {
        // Arrange
        // - mock obj (tournament and current datetime)
        Tournament tournament = helper.createTournamentObj("noError");
        tournament.setId(1L);

        // Get current datetime + set respective datetimes
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();
        // current datetime during tournament event
        tournament.setRegStartDT(localNow.minusYears(2L));
        tournament.setRegEndDT(localNow.minusYears(1L));
        tournament.setStartDT(localNow.minusDays(5L));
        tournament.setEndDT(localNow.plusYears(2L));

        tournament.setStatus(TournamentStatus.MATCHMAKE);

        // - mock operations
        when(tournaments.existsById(tournament.getId())).thenReturn(true);
        when(tournaments.save(tournament)).thenReturn(tournament);

        // Act
        autoStatusUpdateService.autoUpdateTournament(tournament);

        // Assert
        assertEquals(TournamentStatus.ONGOING, tournament.getStatus());
        verify(tournaments).save(tournament);

    }

    @Test
    void autoUpdateTournament_Found_CompeletedAndWithinEventPeriod_ReturnCompleted() {
        // Arrange
        // - mock obj (tournament and current datetime)
        Tournament tournament = helper.createTournamentObj("noError");
        tournament.setId(1L);

        // Get current datetime + set respective datetimes
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();
        // current datetime during tournament event
        tournament.setRegStartDT(localNow.minusYears(2L));
        tournament.setRegEndDT(localNow.minusYears(1L));
        tournament.setStartDT(localNow.minusDays(1L));
        tournament.setEndDT(localNow.plusYears(2L));

        tournament.setStatus(TournamentStatus.COMPLETED); // event completed 

        // - mock operations
        when(tournaments.existsById(tournament.getId())).thenReturn(true);

        // Act
        autoStatusUpdateService.autoUpdateTournament(tournament);

        // Assert
        assertEquals(TournamentStatus.COMPLETED, tournament.getStatus());

    }

    /* Method : autoUpdateTournaments */
    @Test
    void autoUpdateTournaments_Null_ThrowException() {
        // Arrange
        // - mock object (null list)
        List<Tournament> t_list = null;

        // Act
        // Assert
        assertThrows(NullPointerException.class, () -> autoStatusUpdateService.autoUpdateTournaments(t_list));
    }

    @Test
    void autoUpdateTournaments_NotNull_ReturnNothing() {
        // Arrange
        // - mock object (create tournament -> add to list)
        Tournament tournament = helper.createTournamentObj("noError");
        tournament.setId(1L);
        // Get current datetime + set respective datetimes
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();
        // current datetime same as registration start datetime
        tournament.setRegStartDT(localNow);
        tournament.setRegEndDT(localNow.plusDays(2L));
        tournament.setStartDT(localNow.plusYears(1L));
        tournament.setEndDT(localNow.plusYears(2L));

        List<Tournament> t_list = new ArrayList<>();
        t_list.add(tournament);

        // - mock operations (from autoUpdateTournament())
        when(tournaments.existsById(tournament.getId())).thenReturn(true);
        when(tournaments.save(tournament)).thenReturn(tournament);

        // Act
        autoStatusUpdateService.autoUpdateTournaments(t_list);

        // Assert
        verify(tournaments).existsById(tournament.getId());
        verify(tournaments).save(tournament);
        assertEquals(TournamentStatus.REGISTRATION_START, tournament.getStatus());

    }

}
