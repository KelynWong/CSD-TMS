package com.tms.match;

import com.tms.exceptions.MatchNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
public class MatchController {
    private final MatchService matchService;

    public MatchController(MatchService bs){
        this.matchService = bs;
    }



    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Service is healthy");
    }

    /**
     * List all matches in the system
     * @return list of all matches
     */
    @GetMapping
    public List<Match> getMatches(){
        return matchService.listMatches();
    }

    /**
     * Search for Match with the given id
     * If there is no Match with the given "id", throw a MatchNotFoundException
     * @param id
     * @return Match with the given id
     */
    @GetMapping("/{id}")
    public Match getMatch(@PathVariable Long id){
        Match match = matchService.getMatch(id);

        // Need to handle "Match not found" error using proper HTTP status code
        // In this case it should be HTTP 404
        if(match == null) throw new MatchNotFoundException(id);
        return match;

    }

    /**
     * List all matches by tournament id
     * @return list of all matches in a tournament
     */
    @GetMapping("/tournament/{tournamentId}")
    public List<MatchJson> getMatchesByTournament(@PathVariable Long tournamentId){
        return matchService.getMatchesByTournament(tournamentId);
    }

    /**
     * Search for Match with the given user id where user won
     * If there is no Matches with the given "userid", return empty list
     * @param playerId
     * @return list of matches with given userId
     */
    @GetMapping("/user/win/{playerId}")
    public List<Match> getMatchWinsByUser(@PathVariable String playerId){
        return matchService.getMatchWinsByUser(playerId);
    }

    /**
     * Search for Match with the given user id where user lost
     * If there is no Matches with the given "userid", return empty list
     * @param playerId
     * @return list of matches with given userId
     */
    @GetMapping("/user/loss/{playerId}")
    public List<Match> getMatchLossByUser(@PathVariable String playerId){
        return matchService.getMatchLossByUser(playerId);
    }

    /**
     * Search for Match with the given user id where user played
     * If there is no Matches with the given "userid", return empty list
     * @param playerId
     * @return list of matches with given userId
     */
    @GetMapping("/user/played/{playerId}")
    public List<Match> getMatchesPlayedByUser(@PathVariable String playerId){
        return matchService.getMatchesPlayedByUser(playerId);
    }


    /**
     * Add a new Match with POST request to "/matches"
     * Note the use of @RequestBody
     * @param Match
     * @return list of all matches
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Match addMatch(@RequestBody MatchJson match){
        return matchService.addMatch(match);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/tournament")
    public List<Match> addTournament(@RequestBody CreateTournament tournament){
        return matchService.addTournament(tournament);
    }

    @DeleteMapping("/tournament/{id}")
    public void deleteTournament(@PathVariable Long id){
        matchService.deleteTournament(id);
    }

    /**
     * Remove a Match with the DELETE request to "/matches/{id}"
     * If there is no Match with the given "id", throw a MatchNotFoundException
     * @param id
     */
    @DeleteMapping("/{id}")
    public void deleteMatch(@PathVariable Long id){
        try{
            matchService.deleteMatch(id);
         }catch(MatchNotFoundException e) {
            throw new MatchNotFoundException(id);
         }
    }

}