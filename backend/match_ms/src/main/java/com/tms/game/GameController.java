package com.tms.game;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class GameController {
    private final GameService gameService;

    /**
     * This controller works with the repositories directly, without a service layer
     */
    public GameController(GameService gameService){
        this.gameService = gameService;
    }

    @GetMapping("/matches/{matchId}/games")
    public List<Game> getAllGamesByMatchId(@PathVariable Long matchId) {
        return gameService.getAllGamesByMatchId(matchId);
    }

    /**
     * Implement this method to add a game for a given matchId
     * If there's no such match, throw a MatchNotFoundException
     * 
     * Return the newly added game
     */
    @PostMapping("/matches/{matchId}/games")
    public Game addGame(@PathVariable Long matchId, @RequestBody Game game) {
        return gameService.addGame(matchId, game);
    }

    /**
     * Update an existing game, given the matchId and the gameId
     * Need to make sure that the game is associated with the match
     * @param matchId
     * @param gameId
     * @param newGame
     * @return
     */
    @PutMapping("/matches/{matchId}/games/{gameId}")
    public Game updateGame(@PathVariable Long matchId,
                                 @PathVariable Long gameId,
                                 @RequestBody Game newGame) {
        return gameService.updateGame(matchId, gameId, newGame);
    }

    /**
     * Use a ResponseEntity to have more control over the response sent to client
     */
    @DeleteMapping("/matches/{matchId}/games/{gameId}")
    public ResponseEntity<?> deleteGame(@PathVariable Long matchId,
                              @PathVariable Long gameId) {
        gameService.deleteGame(matchId, gameId);
        return ResponseEntity.ok().build();
    }
}