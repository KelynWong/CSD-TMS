package com.tms.matchmaking;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.annotation.JsonView;
import com.tms.Views;
import com.tms.exceptions.TournamentExistsException;
import com.tms.match.Match;
import com.tms.player.Player;

@RestController
public class Controller {
    private MatchmakeService matchmakeService;

    public Controller() {
        this.matchmakeService = new MatchmakeService();
    }

    // Creates all matches for a given tournament with no games.
    @ResponseStatus(HttpStatus.CREATED)
    @JsonView(Views.Post.class)
    @PostMapping("/matchmaking/{tournamentId}")
    public ResponseEntity<Match> matchMake(@PathVariable Long tournamentId, @RequestBody List<Player> players){
        try {
            Match root = matchmakeService.matchmake(tournamentId, players);
            return ResponseEntity.ok(root);
        } catch (TournamentExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
    }

    // Returns 
    @GetMapping("/matchmaking/{tournamentId}")
    @JsonView(Views.Get.class)
    public ResponseEntity<Match> getTournament(@PathVariable Long tournamentId){
        Match root = matchmakeService.getTournament(tournamentId);
        if (root == null) {
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok(root);
    }

}