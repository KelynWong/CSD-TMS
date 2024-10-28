package com.tms.matchmaking;

import com.tms.match.Game;
import com.tms.match.MatchJson;
import com.tms.player.Player;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        return ResponseEntity.status(HttpStatus.CREATED).body("Matches created for tournament ID: " + tournamentId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/result/{matchId}")
    public ResponseEntity<MatchJson> addGames(@PathVariable Long matchId, @RequestBody List<Game> games) {
        MatchJson match = matchmakeService.updateMatchRes(matchId, games);
        return ResponseEntity.status(HttpStatus.CREATED).body(match);
    }

    @GetMapping("/matches/{tournamentId}/simulate")
    public ResponseEntity<List<MatchJson>> getMatches(@PathVariable Long tournamentId) {
        List<MatchJson> matches = matchmakeService.simTournament(tournamentId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/matches/{tournamentId}/simulate-many")
    public ResponseEntity<Map<Player, Float>> getExpectedPlayerRes(@PathVariable Long tournamentId) {
        Map<Player, Float> playerRes = matchmakeService.simManyTournament(tournamentId);
        return ResponseEntity.ok(playerRes);
    }

}