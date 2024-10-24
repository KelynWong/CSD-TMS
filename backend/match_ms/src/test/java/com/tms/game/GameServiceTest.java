package com.tms.game;

import com.tms.exceptions.GameNotFoundException;
import com.tms.exceptions.MatchNotFoundException;
import com.tms.match.Match;
import com.tms.match.MatchJson;
import com.tms.match.MatchRepository;
import com.tms.match.MatchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @Mock
    private MatchRepository matchRepository;

    @Mock
    private MatchService matchService;

    @InjectMocks
    private GameService gameService;

    @Test
    void getAllGamesByMatchId_MatchFound_ReturnAllGames() {
        // Arrange
        Long matchId = 1L;
        Game game = new Game();
        when(gameRepository.findByMatchId(matchId)).thenReturn(List.of(game));
        when(matchRepository.existsById(matchId)).thenReturn(Boolean.TRUE);
        // Act
        List<Game> expectedReturn = gameService.getAllGamesByMatchId(matchId);
        // Assert
        assertEquals(List.of(game), expectedReturn);
        verify(gameRepository).findByMatchId(matchId);
        verify(matchRepository).existsById(matchId);
    }

    @Test
    void getAllGamesByMatchId_MatchNotFound_ThrowMatchNotFoundException() {
        // Arrange
        Long matchId = 1L;
        when(matchRepository.existsById(matchId)).thenReturn(Boolean.FALSE);
        // Act
        // Assert
        assertThrows(MatchNotFoundException.class, () -> gameService.getAllGamesByMatchId(matchId));
        verify(matchRepository).existsById(matchId);
    }

    @Test
    void addGames_ValidGames_GamesDoesntExist_Player2_ReturnMatchJson() {
        // Arrange
        Long matchId = 1L;
        Game game1 = new Game();
        game1.setSetNum((short) 1);
        game1.setPlayer1Score((short) 19);
        game1.setPlayer2Score(( short) 21);

        Game game2 = new Game();
        game2.setSetNum((short) 2);
        game2.setPlayer1Score((short) 29);
        game2.setPlayer2Score((short) 30);

        List<Game> gamesToAdd = List.of(game1, game2);
        when(gameRepository.findByMatchId(matchId)).thenReturn(List.of());
        when(matchRepository.existsById(matchId)).thenReturn(Boolean.TRUE);
        when(matchService.setWinnerAndUpdateParent(matchId, false)).thenReturn(new Match());

        // Act
        MatchJson expectedResult = gameService.addGames(matchId, gamesToAdd);

        // Assert
        assertNotNull(expectedResult);
        verify(gameRepository).findByMatchId(matchId);
        verify(matchRepository).existsById(matchId);
        verify(gameRepository).save(gamesToAdd.get(0));
        verify(gameRepository).save(gamesToAdd.get(1));
        verify(matchService).setWinnerAndUpdateParent(matchId, false);
    }

    @Test
    void addGames_ValidGames_GamesDoesntExist_Player1Win_ReturnMatchJson() {
        // Arrange
        Long matchId = 1L;
        Game game1 = new Game();
        game1.setSetNum((short) 1);
        game1.setPlayer1Score((short) 21);
        game1.setPlayer2Score(( short) 19);

        Game game2 = new Game();
        game2.setSetNum((short) 2);
        game2.setPlayer1Score((short) 30);
        game2.setPlayer2Score((short) 29);

        List<Game> gamesToAdd = List.of(game1, game2);
        when(gameRepository.findByMatchId(matchId)).thenReturn(List.of());
        when(matchRepository.existsById(matchId)).thenReturn(Boolean.TRUE);
        when(matchService.setWinnerAndUpdateParent(matchId, true)).thenReturn(new Match());

        // Act
        MatchJson expectedResult = gameService.addGames(matchId, gamesToAdd);

        // Assert
        assertNotNull(expectedResult);
        verify(gameRepository).findByMatchId(matchId);
        verify(matchRepository).existsById(matchId);
        verify(gameRepository).save(gamesToAdd.get(0));
        verify(gameRepository).save(gamesToAdd.get(1));
        verify(matchService).setWinnerAndUpdateParent(matchId, true);
    }

    @Test
    void addGames_GameExist_ThrowIllegalArgumentException() {
        // Arrange
        Long matchId = 1L;
        Game game1 = new Game();
        game1.setSetNum((short) 1);
        game1.setPlayer1Score((short) 21);
        game1.setPlayer2Score(( short) 19);

        Game game2 = new Game();
        game2.setSetNum((short) 2);
        game2.setPlayer1Score((short) 30);
        game2.setPlayer2Score((short) 29);

        List<Game> gamesToAdd = List.of(game1, game2);
        when(gameRepository.findByMatchId(matchId)).thenReturn(List.of(game1, game2));
        when(matchRepository.existsById(matchId)).thenReturn(Boolean.TRUE);

        // Act
        // Assert
        assertThrows(IllegalArgumentException.class, () -> gameService.addGames(matchId, gamesToAdd));
        verify(gameRepository).findByMatchId(matchId);
        verify(matchRepository).existsById(matchId);
    }

    @Test
    void addGames_InvalidGames_ThrowIllegalArgumentException() {
        // Arrange
        Long matchId = 1L;
        Game game1 = new Game();
        Game game2 = new Game();

        List<Game> gamesToAdd = List.of(game1, game2);
        when(gameRepository.findByMatchId(matchId)).thenReturn(List.of());
        when(matchRepository.existsById(matchId)).thenReturn(Boolean.TRUE);

        // Act
        // Assert
        assertThrows(IllegalArgumentException.class, () -> gameService.addGames(matchId, gamesToAdd));
        verify(gameRepository).findByMatchId(matchId);
        verify(matchRepository).existsById(matchId);
    }

    @Test
    void updateGame_GameExists_ValidateGame_Player2Wins_GameUpdatedSuccessfully() {
        // Arrange
        Long matchId = 1L;
        Long gameId = 1L;
        Game existingGame = new Game();
        existingGame.setSetNum((short) 1);
        existingGame.setPlayer1Score((short) 21);
        existingGame.setPlayer2Score((short) 17);

        Game newGame = new Game();
        newGame.setSetNum((short) 2);
        newGame.setPlayer1Score((short) 21);
        newGame.setPlayer2Score((short) 19);
        Match match = new Match();

        when(matchRepository.findById(matchId)).thenReturn(Optional.of(match));
        when(gameRepository.findByIdAndMatchId(gameId, matchId)).thenReturn(Optional.of(existingGame));
        when(gameRepository.save(existingGame)).thenReturn(existingGame);

        // Act
        Game updatedGame = gameService.updateGame(matchId, gameId, newGame);

        // Assert
        assertNotNull(updatedGame);
        assertEquals(newGame.getSetNum(), updatedGame.getSetNum());
        assertEquals(newGame.getPlayer1Score(), updatedGame.getPlayer1Score());
        assertEquals(newGame.getPlayer2Score(), updatedGame.getPlayer2Score());
        verify(matchRepository).findById(matchId);
        verify(gameRepository).findByIdAndMatchId(gameId, matchId);
        verify(gameRepository).save(updatedGame);
    }

    @Test
    void updateGame_GameDoesntExist_ThrowGameNotFoundException() {
        // Arrange
        Long matchId = 1L;
        Long gameId = 1L;
        Game newGame = new Game();
        newGame.setSetNum((short) 2);
        newGame.setPlayer1Score((short) 21);
        newGame.setPlayer2Score((short) 10 );
        when(matchRepository.findById(matchId)).thenReturn(Optional.of(new Match()));
        when(gameRepository.findByIdAndMatchId(gameId, matchId)).thenReturn(Optional.empty());

        // Act
        // Assert
        assertThrows(GameNotFoundException.class, () -> gameService.updateGame(matchId, gameId, newGame));
        verify(matchRepository).findById(matchId);
        verify(gameRepository).findByIdAndMatchId(gameId, matchId);
    }

    @Test
    void updateGame_InvalidGame_ThrowIllegalArgumentException() {
        // Arrange
        Long matchId = 1L;
        Long gameId = 1L;
        Game newGame = new Game();

        // Act and Assert
        assertThrows(IllegalArgumentException.class, () -> gameService.updateGame(matchId, gameId, newGame));
    }

    @Test
    void updateGame_MatchDoesntExist_ThrowMatchNotFoundException() {
        // Arrange
        Long matchId = 1L;
        Long gameId = 1L;
        Game newGame = new Game();
        newGame.setSetNum((short) 2);
        newGame.setPlayer1Score((short) 21);
        newGame.setPlayer2Score((short) 10 );
        when(matchRepository.findById(matchId)).thenReturn(Optional.empty());

        // Act and Assert
        assertThrows(MatchNotFoundException.class, () -> gameService.updateGame(matchId, gameId, newGame));
        verify(matchRepository).findById(matchId);
    }

    @Test
    void deleteGame_MatchFound_GameFound() {
        Long matchId = 1L;
        Long gameId = 1L;
        Game game = new Game();
        when(matchRepository.existsById(matchId)).thenReturn(Boolean.TRUE);
        when(gameRepository.findByIdAndMatchId(gameId, matchId)).thenReturn(Optional.of(game));

        // Act
        Game deletedGame = gameService.deleteGame(matchId, gameId);

        // Assert
        assertNotNull(deletedGame);
        verify(matchRepository).existsById(matchId);
        verify(gameRepository).findByIdAndMatchId(gameId, matchId);
    }

    @Test
    void deleteGame_MatchNotFound_ThrowMatchNotFoundException() {
        // Arrange
        Long matchId = 1L;
        Long gameId = 1L;
        when(matchRepository.existsById(matchId)).thenReturn(Boolean.FALSE);

        // Act and Assert
        assertThrows(MatchNotFoundException.class, () -> gameService.deleteGame(matchId, gameId));
        verify(matchRepository).existsById(matchId);
    }

    @Test
    void deleteGame_GameNotFound_ThrowGameNotFoundExcpetion() {
        // Arrange
        Long matchId = 1L;
        Long gameId = 1L;
        when(matchRepository.existsById(matchId)).thenReturn(Boolean.TRUE);
        when(gameRepository.findByIdAndMatchId(gameId, matchId)).thenReturn(Optional.empty());

        // Act and Assert
        assertThrows(GameNotFoundException.class, () -> gameService.deleteGame(matchId, gameId));
    }

    @Test
    void createGames() {
        // Arrange
        Match match = new Match();
        match.setId(1L);

        when(matchRepository.findAll()).thenReturn(List.of(match));
        when(matchRepository.existsById(1L)).thenReturn(Boolean.TRUE);

        // Act
        gameService.createGames();

        // Assert
        verify(matchRepository).findAll();
        verify(gameRepository).findByMatchId(1L);

    }
}