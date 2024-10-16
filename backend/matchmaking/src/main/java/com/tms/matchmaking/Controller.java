package com.tms.matchmaking;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.tms.tournament.Tournament;

@RestController
@RequestMapping("/matchmaking")
public class Controller {
    private final MatchmakeService matchmakeService;

    public Controller(MatchmakeService matchmakeService) {
        this.matchmakeService = matchmakeService;
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Service is healthy");
    }

    // Creates all matches for a given tournament with no games.
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/{tournamentId}")
    public ResponseEntity<String> matchMake(@PathVariable Long tournamentId){
        matchmakeService.matchmake(tournamentId);
        return ResponseEntity.ok("Matches created successfully");
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{tournamentId}")
    public ResponseEntity<Tournament> getTournament(@PathVariable Long tournamentId){
        Tournament tournament = matchmakeService.getTournament(tournamentId);
        return ResponseEntity.ok(tournament);
    }

}