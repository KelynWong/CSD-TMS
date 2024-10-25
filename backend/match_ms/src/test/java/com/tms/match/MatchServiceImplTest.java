package com.tms.match;

import com.tms.MatchServiceApplication;
import com.tms.exceptions.MatchNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatchServiceImplTest {

    @Mock
    private MatchRepository matchRepository;

    @InjectMocks
    private MatchServiceImpl matchService;

    @Test
    void listMatches() {
        // Arrange
        Match match1 = new Match();
        match1.setId(1L);
        Match match2 = new Match();
        match2.setId(2L);
        List<Match> expectedMatches = Arrays.asList(match1, match2);
        when(matchRepository.findAll()).thenReturn(expectedMatches);

        // Act
        List<Match> actualMatches = matchService.listMatches();

        // Assert
        assertEquals(expectedMatches, actualMatches);
        verify(matchRepository).findAll();
    }

    @Test
    void getMatch_Found_ReturnMatch() {
        // Arrange
        Long matchId = 1L;
        Match expectedMatch = new Match();
        expectedMatch.setId(matchId);
        when(matchRepository.findById(matchId)).thenReturn(Optional.of(expectedMatch));

        // Act
        Match actualMatch = matchService.getMatch(matchId);

        // Assert
        assertEquals(expectedMatch, actualMatch);
        verify(matchRepository).findById(matchId);
    }

    @Test
    void getMatch_NotFound_ReturnNull() {
        // Arrange
        Long matchId = 1L;
        when(matchRepository.findById(matchId)).thenReturn(Optional.empty());

        // Act
        Match actualMatch = matchService.getMatch(matchId);

        // Assert
        assertNull(actualMatch);
        verify(matchRepository).findById(matchId);

    }

    @Test
    void getMatchesByTournament() {
        // Assert
        long tournamentId = 1L;
        Match match1 = new Match();
        Match match2 = new Match();
        match1.setId(1L);
        match2.setId(2L);
        List<Match> matches = Arrays.asList(match1, match2);
        List<MatchJson> expectedMatchJson = MatchJson.fromMatches(matches);
        when(matchRepository.findByTournamentIdOrderByIdAsc(tournamentId)).thenReturn(matches);

        // Act
        List<MatchJson> actualMatchJson = matchService.getMatchesByTournament(tournamentId);

        // Assert
        assertEquals(expectedMatchJson, actualMatchJson);
        verify(matchRepository).findByTournamentIdOrderByIdAsc(tournamentId);
    }

    @Test
    void getMatchWinsByUser() {
        // Arrange
        String playerId = "a";
        Match match1 = new Match();
        match1.setId(1L);
        Match match2 = new Match();
        match2.setId(2L);
        List<Match> expectedMatches = Arrays.asList(match1, match2);
        when(matchRepository.findByWinnerId(playerId)).thenReturn(expectedMatches);

        // Act
        List<Match> actualMatches = matchService.getMatchWinsByUser(playerId);

        // Assert
        assertEquals(expectedMatches, actualMatches);
        verify(matchRepository).findByWinnerId(playerId);
    }

    @Test
    void getMatchLossByUser() {
        // Arrange
        String playerId = "a";
        Match match1 = new Match();
        match1.setId(1L);
        Match match2 = new Match();
        match2.setId(2L);
        List<Match> expectedMatches = Arrays.asList(match1, match2);
        when(matchRepository.findByLoserId(playerId)).thenReturn(expectedMatches);

        // Act
        List<Match> actualMatches = matchService.getMatchLossByUser(playerId);

        // Assert
        assertEquals(expectedMatches, actualMatches);
        verify(matchRepository).findByLoserId(playerId);
    }

    @Test
    void getMatchesPlayedByUser() {
        // Arrange
        String playerId = "a";
        Match match1 = new Match();
        match1.setId(1L);
        Match match2 = new Match();
        match2.setId(2L);
        List<Match> expectedMatches = Arrays.asList(match1, match2);
        when(matchRepository.findMatchesPlayedByPlayer(playerId)).thenReturn(expectedMatches);

        // Act
        List<Match> actualMatches = matchService.getMatchesPlayedByUser(playerId);

        // Assert
        assertEquals(expectedMatches, actualMatches);
        verify(matchRepository).findMatchesPlayedByPlayer(playerId);
    }

    @Test
    void getPlayerWinRate_hasMatches_returnWinRate() {
        // Arrange
        String playerId = "a";
        Match match1 = new Match();
        match1.setId(1L);
        Match match2 = new Match();
        match2.setId(2L);
        Match match3 = new Match();
        match3.setId(3L);
        List<Match> expectedWinningMatches = Arrays.asList(match1, match2);
        List<Match> expectedAllMatches = Arrays.asList(match1, match2, match3);
        Double expectedWinRate = (double) expectedWinningMatches.size() / expectedAllMatches.size();
        when(matchRepository.findByWinnerId(playerId)).thenReturn(expectedWinningMatches);
        when(matchRepository.findMatchesPlayedByPlayer(playerId)).thenReturn(expectedAllMatches);

        // Act
        Double actualWinRate = matchService.getPlayerWinRate(playerId);

        // Assert
        assertEquals(actualWinRate, expectedWinRate);
        verify(matchRepository).findMatchesPlayedByPlayer(playerId);
        verify(matchRepository).findByWinnerId(playerId);
    }

    @Test
    void getPlayerWinRate_NoMatches_returnZero() {
        // Arrange
        String playerId = "a";
        when(matchRepository.findByWinnerId(playerId)).thenReturn(new ArrayList<Match>());
        when(matchRepository.findMatchesPlayedByPlayer(playerId)).thenReturn(new ArrayList<Match>());

        // Act
        Double actualWinRate = matchService.getPlayerWinRate(playerId);

        // Assert
        assertEquals(0.0, actualWinRate);
        verify(matchRepository).findMatchesPlayedByPlayer(playerId);
        verify(matchRepository).findByWinnerId(playerId);
    }

    @Test
    void addMatch_RightLeftNotNull_ReturnMatch() {
        // Arrange
        MatchJson matchJson = new MatchJson();
        matchJson.setId(1L);
        matchJson.setLeft(2L);
        matchJson.setRight(3L);

        Match leftMatch = new Match();
        Match rightMatch = new Match();
        leftMatch.setId(2L);
        rightMatch.setId(3L);

        when(matchRepository.findById(2L)).thenReturn(Optional.of(leftMatch));
        when(matchRepository.findById(3L)).thenReturn(Optional.of(rightMatch));
        when(matchRepository.save(any(Match.class))).thenAnswer(invocation -> {
            Match match = invocation.getArgument(0);
            match.setId(1L); // Simulate database ID assignment
            return match;
        });

        // Act
        Match actualMatch = matchService.addMatch(matchJson);

        // Assert
        assertEquals(1L, actualMatch.getId());
        assertEquals(leftMatch, actualMatch.getLeft());
        assertEquals(rightMatch, actualMatch.getRight());
        verify(matchRepository).findById(2L);
        verify(matchRepository).findById(3L);
        verify(matchRepository).save(actualMatch);

    }

    @Test
    void addMatch_RightNullLeftNotNull_ReturnMatch() {
        // Arrange
        MatchJson matchJson = new MatchJson();
        matchJson.setId(1L);
        matchJson.setLeft(2L);
        matchJson.setRight(null);

        Match leftMatch = new Match();
        leftMatch.setId(2L);

        when(matchRepository.findById(2L)).thenReturn(Optional.of(leftMatch));
        when(matchRepository.save(any(Match.class))).thenAnswer(invocation -> {
            Match match = invocation.getArgument(0);
            match.setId(1L); // Simulate database ID assignment
            return match;
        });

        // Act
        Match actualMatch = matchService.addMatch(matchJson);

        // Assert
        assertEquals(1L, actualMatch.getId());
        assertEquals(leftMatch, actualMatch.getLeft());
        assertNull(actualMatch.getRight());
        verify(matchRepository).findById(2L);
        verify(matchRepository).save(actualMatch);
    }

    @Test
    void addMatch_LeftNullRightNotNull_ReturnMatch() {
        // Arrange
        MatchJson matchJson = new MatchJson();
        matchJson.setId(1L);
        matchJson.setRight(2L);
        matchJson.setLeft(null);

        Match rightMatch = new Match();
        rightMatch.setId(2L);

        when(matchRepository.findById(2L)).thenReturn(Optional.of(rightMatch));
        when(matchRepository.save(any(Match.class))).thenAnswer(invocation -> {
            Match match = invocation.getArgument(0);
            match.setId(1L); // Simulate database ID assignment
            return match;
        });

        // Act
        Match actualMatch = matchService.addMatch(matchJson);

        // Assert
        assertEquals(1L, actualMatch.getId());
        assertEquals(rightMatch, actualMatch.getRight());
        assertNull(actualMatch.getLeft());
        verify(matchRepository).findById(2L);
        verify(matchRepository).save(actualMatch);
        
    }

    @Test
    void addMatch_LeftNullRightNull_ReturnMatch() {
        // Arrange
        MatchJson matchJson = new MatchJson();
        matchJson.setId(1L);
        matchJson.setRight(null);
        matchJson.setLeft(null);
        when(matchRepository.save(any(Match.class))).thenAnswer(invocation -> {
            Match match = invocation.getArgument(0);
            match.setId(1L); // Simulate database ID assignment
            return match;
        });

        // Act
        Match actualMatch = matchService.addMatch(matchJson);

        // Assert
        verify(matchRepository).save(actualMatch);
        assertEquals(1L, actualMatch.getId());
        assertNull(actualMatch.getLeft());
        assertNull(actualMatch.getRight());

    }

    @Test
    void addTournament_ShouldAddMatchesAndReturnList() {
        // Arrange
        int numMatchesAtBase = 2;

        // Create the base matches
        MatchJson matchJson1 = new MatchJson();
        matchJson1.setId(100L);

        MatchJson matchJson2 = new MatchJson();
        matchJson2.setId(101L);

        MatchJson matchJson3 = new MatchJson();
        matchJson3.setId(102L);

        // Set up tournament matches
        List<MatchJson> matches = Arrays.asList(matchJson1, matchJson2, matchJson3);
        CreateTournament tournament = new CreateTournament(matches, numMatchesAtBase);

        // Mock the addMatch method to return predefined matches
        Match match1 = new Match();
        match1.setId(1L);
        Match match2 = new Match();
        match2.setId(2L);
        Match match3 = new Match();
        match3.setId(3L);

        match3.setLeft(match1);
        match3.setRight(match2);

        // Ensure the correct matches are returned for matchJson1 and matchJson2
        when(matchService.addMatch(matchJson1)).thenReturn(match1);
        when(matchService.addMatch(matchJson2)).thenReturn(match2);

        // Mock addMatch for matchJson3 based on left and right matches
        when(matchService.addMatch(matchJson3)).thenAnswer(invocation -> {
            Match match = invocation.getArgument(0);
            match.setId(match3.getId());
            match.setLeft(match1);
            match.setRight(match2);
            return match;
        });

        // Act
        List<Match> actualMatches = matchService.addTournament(tournament);

        // Assert
        assertEquals(3, actualMatches.size());
        assertEquals(match3, actualMatches.get(0));


    }
    
    @Test
    void setWinnerAndUpdateParent_PresentMatchPlayer1Win_ReturnMatch() {
        // Arrange
        Long matchId = 1L;
        Long tournamentId = 1L;
        Match match = new Match();
        match.setId(matchId);
        match.setTournamentId(tournamentId);
        match.setPlayer1Id("player1");
        match.setPlayer2Id("player2");
        when(matchRepository.findById(matchId)).thenReturn(Optional.of(match));
        when(matchRepository.save(match)).thenReturn(match);

        // Act
        Match result = matchService.setWinnerAndUpdateParent(matchId, true);

        // Assert
        assertEquals("player1", result.getWinnerId());
        verify(matchRepository).save(match);
        verify(matchRepository).findById(matchId);
    }

    @Test
    void setWinnerAndUpdateParent_PresentMatchPlayer2Win_ReturnMatch() {
        // Arrange
        Long matchId = 1L;
        Long tournamentId = 1L;
        Match match = new Match();
        match.setId(matchId);
        match.setTournamentId(tournamentId);
        match.setPlayer2Id("player2");
        match.setPlayer1Id("player1");
        when(matchRepository.findById(matchId)).thenReturn(Optional.of(match));
        when(matchRepository.save(match)).thenReturn(match);

        // Act
        Match result = matchService.setWinnerAndUpdateParent(matchId, false);

        // Assert
        assertEquals("player2", result.getWinnerId());
        verify(matchRepository).save(match);
        verify(matchRepository).findById(matchId);
    }

    @Test
    void setWinnerAndUpdateParent_NotPresentMatch_ReturnNull() {
        // Arrange
        Long matchId = 1L;
        when(matchRepository.findById(matchId)).thenReturn(Optional.empty());

        // Act
        Match result = matchService.setWinnerAndUpdateParent(matchId, true);

        // Assert
        assertNull(result);
    }

    @Test
    void generateWinners_MatchFound() {
        // Arrange
        Long tournamentId = 1L;
        Match match1 = new Match();
        match1.setId(1L);
        match1.setPlayer1Id("player1");
        match1.setPlayer2Id("player2");
        Match match2 = new Match();
        match2.setId(2L);
        match2.setPlayer1Id("player3");
        match2.setPlayer2Id("player4");
        match1.setTournamentId(tournamentId);
        match2.setTournamentId(tournamentId);
        List<Match> matches = Arrays.asList(match1, match2);
        when(matchRepository.findByTournamentIdOrderByIdAsc(tournamentId)).thenReturn(matches);
        when(matchRepository.findById(1L)).thenReturn(Optional.of(match1));

        // Act
        matchService.generateWinners(tournamentId);

        // Assert
        verify(matchRepository, atLeastOnce()).findByTournamentIdOrderByIdAsc(tournamentId);
        verify(matchRepository, atLeastOnce()).save(any(Match.class));
    }

    @Test
    void generateWinners_MatchNotFound_ThrowMatchNotFoundException() {
        // Arrange
        Long tournamentId = 1L;
        Match match1 = new Match();
        match1.setId(1L);
        match1.setPlayer1Id("player1");
        match1.setPlayer2Id("player2");
        match1.setTournamentId(tournamentId);
        List<Match> matches = Arrays.asList(match1);
        when(matchRepository.findByTournamentIdOrderByIdAsc(tournamentId)).thenReturn(matches);
        when(matchRepository.findById(1L)).thenReturn(Optional.empty());

        // Act Assert
        assertThrows(MatchNotFoundException.class, () ->
            matchService.generateWinners(tournamentId));
    }

    @Test
    void deleteMatch_MatchFound() {
        // Arrange
        Long matchId = 1L;
        when(matchRepository.existsById(matchId)).thenReturn(true);

        // Act
        matchService.deleteMatch(matchId);

        // Assert
        verify(matchRepository).deleteById(matchId);
    }

    @Test
    void deleteMatch_NotFound_ThrowMatchNotFoundException() {
        // Arrange
        Long matchId = 1L;
        when(matchRepository.existsById(matchId)).thenReturn(false);

        // Act Assert
        assertThrows(MatchNotFoundException.class, () ->
            matchService.deleteMatch(matchId));
    }
}