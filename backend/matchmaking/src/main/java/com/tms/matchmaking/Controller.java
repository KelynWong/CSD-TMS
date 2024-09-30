package com.tms.matchmaking;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.tms.player.Player;
import com.tms.tournament.Tournament;

@RestController
public class Controller {
    private MatchmakeService matchmakeService;

    public Controller() {
        this.matchmakeService = new MatchmakeService();
    }

    // Creates all matches for a given tournament with no games.
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/matchmaking/{tournamentId}")
    public ResponseEntity<String> matchMake(@PathVariable Long tournamentId){
        matchmakeService.matchmake(tournamentId);
        return ResponseEntity.ok("Matches created successfully");
    }

    // Returns 
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/matchmaking/{tournamentId}")
    public ResponseEntity<Tournament> getTournament(@PathVariable Long tournamentId){
        Tournament tournament = matchmakeService.getTournament(tournamentId);
        return ResponseEntity.ok(tournament);
    }

}