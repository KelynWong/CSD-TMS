package com.tms.matchmaking;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.tms.tournament.Tournament;

@RestController
public class Controller {
    private final MatchmakeService matchmakeService;

    public Controller(MatchmakeService matchmakeService) {
        this.matchmakeService = matchmakeService;
    }

    // Creates all matches for a given tournament with no games.
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/matchmaking/{tournamentId}")
    public ResponseEntity<String> matchMake(@PathVariable Long tournamentId){
        matchmakeService.matchmake(tournamentId);
        return ResponseEntity.ok("Matches created successfully");
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/matchmaking/{tournamentId}")
    public ResponseEntity<Tournament> getTournament(@PathVariable Long tournamentId){
        Tournament tournament = matchmakeService.getTournament(tournamentId);
        return ResponseEntity.ok(tournament);
    }

}