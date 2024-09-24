package com.tms.matchmaking;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.deser.DataFormatReaders.Match;
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
    public ResponseEntity<String> matchMake(@PathVariable Long tournamentId, @RequestBody List<Player> players){
        TreeNode root = matchmakeService.matchmake(tournamentId, players);
        return ResponseEntity.ok("Matchmaking successful. Tournament Tree: " + root);
    }

    // Returns 
    @GetMapping("/matchmaking/{tournamentId}")
    public ResponseEntity<String> getTournament(@PathVariable Long tournamentId){
        TreeNode root = matchmakeService.getTournament(tournamentId);

        return ResponseEntity.ok("test");
    }

}