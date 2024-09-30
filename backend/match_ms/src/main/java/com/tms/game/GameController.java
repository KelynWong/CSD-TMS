package com.tms.game;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tms.exceptions.GameNotFoundException;
import com.tms.exceptions.MatchNotFoundException;
import com.tms.match.*;

@RestController
public class GameController {
    private GameRepository games;
    private MatchRepository matches;

    /**
     * This controller works with the repositories directly, without a service layer
     */
    public GameController(GameRepository games, MatchRepository matches){
        this.games = games;
        this.matches = matches;
    }

    @GetMapping("/matches/{matchId}/games")
    public List<Game> getAllGamesByMatchId(@PathVariable (value = "matchId") Long matchId) {
        if(!matches.existsById(matchId)) {
            throw new MatchNotFoundException(matchId);
        }
        return games.findByMatchId(matchId);
    }

    /**
     * Implement this method to add a game for a given matchId
     * If there's no such match, throw a MatchNotFoundException
     * 
     * Return the newly added game
     */
    @PostMapping("/matches/{matchId}/games")
    public Game addGame(@PathVariable (value = "matchId") Long matchId, @RequestBody Game game) {
        // Hint: using "map" to handle the returned Optional object from "findById(matchId)"
        // your code here
        // need to change the "return null"
        return matches.findById(matchId)
                    .map(match -> {
                        game.setMatch(match);
                        return games.save(game);
                    })
                    .orElseThrow(() -> new MatchNotFoundException(matchId));
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
    public Game updateGame(@PathVariable (value = "matchId") Long matchId,
                                 @PathVariable (value = "gameId") Long gameId,
                                 @RequestBody Game newGame) {
        Optional<Match> optionalMatch = matches.findById(matchId);
        Match match = optionalMatch.orElseThrow(() -> new MatchNotFoundException(matchId));

        return games.findByIdAndMatchId(gameId, matchId).map(game -> {
            game.setSetNum(newGame.getSetNum());
            game.setPlayer1Score(newGame.getPlayer1Score());
            game.setPlayer2Score(newGame.getPlayer2Score());
            game.setMatch(match);
            return games.save(game);
        }).orElseThrow(() -> new GameNotFoundException(gameId));
      
    }

    /**
     * Use a ResponseEntity to have more control over the response sent to client
     */
    @DeleteMapping("/matches/{matchId}/games/{gameId}")
    public ResponseEntity<?> deleteGame(@PathVariable (value = "matchId") Long matchId,
                              @PathVariable (value = "gameId") Long gameId) {
        
        if(!matches.existsById(matchId)) {
            throw new MatchNotFoundException(matchId);
        }

        return games.findByIdAndMatchId(gameId, matchId).map(game -> {
            games.delete(game);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new GameNotFoundException(gameId));
    }
}