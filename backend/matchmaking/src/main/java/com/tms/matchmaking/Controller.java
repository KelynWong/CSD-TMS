package com.tms.matchmaking;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.tms.player.Player;

@RestController
public class Controller {
    private MatchmakeService matchmakeService;

    public Controller() {
        this.matchmakeService = new MatchmakeService();
    }

    // Creates all matches for a given tournament with no games.
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/matchmaking/{tournamentId}")
    public ResponseEntity<Match> matchMake(@PathVariable Long tournamentId, @RequestBody List<Player> players){
        Match root = matchmakeService.matchmake(tournamentId, players);
        return ResponseEntity.ok(root);
    }

    // Returns 
    @GetMapping("/matchmaking/{tournamentId}")
    public ResponseEntity<Match> getTournament(@PathVariable Long tournamentId){
        Match root = matchmakeService.getTournament(tournamentId);
        if (root == null) {
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok(root);
    }

}