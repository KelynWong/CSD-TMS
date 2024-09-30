package com.tms.match;

import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.tms.exceptions.MatchNotFoundException;

@RestController
public class MatchController {
    private MatchService matchService;

    public MatchController(MatchService bs){
        this.matchService = bs;
    }

    /**
     * List all matches in the system
     * @return list of all matches
     */
    @GetMapping("/matches")
    public List<Match> getMatches(){
        return matchService.listMatches();
    }

    /**
     * Search for Match with the given id
     * If there is no Match with the given "id", throw a MatchNotFoundException
     * @param id
     * @return Match with the given id
     */
    @GetMapping("/matches/{id}")
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
    @GetMapping("/matches/tournament/{tournamentId}")
    public List<Match> getMatchesByTournament(@PathVariable Long tournamentId){
        return matchService.getMatchesByTournament(tournamentId);
    }

    /**
     * Search for Match with the given user id where user won
     * If there is no Matches with the given "userid", return empty list
     * @param playerId
     * @return list of matches with given userId
     */
    @GetMapping("/matches/user/win/{playerId}")
    public List<Match> getMatchWinsByUser(@PathVariable String playerId){
        return matchService.getMatchWinsByUser(playerId);
    }

    /**
     * Search for Match with the given user id where user lost
     * If there is no Matches with the given "userid", return empty list
     * @param playerId
     * @return list of matches with given userId
     */
    @GetMapping("/matches/user/loss/{playerId}")
    public List<Match> getMatchLossByUser(@PathVariable String playerId){
        return matchService.getMatchLossByUser(playerId);
    }

    /**
     * Search for Match with the given user id where user played
     * If there is no Matches with the given "userid", return empty list
     * @param playerId
     * @return list of matches with given userId
     */
    @GetMapping("/matches/user/played/{playerId}")
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
    @PostMapping("/matches")
    public Match addMatch(@RequestBody MatchJson match){
        return matchService.addMatch(match);
    }

    /**
     * If there is no Match with the given "id", throw a MatchNotFoundException
     * @param id
     * @param newMatchInfo
     * @return the updated, or newly added Match
     */
    @PutMapping("/matches/{id}")
    public Match updateMatch(@PathVariable Long id, @RequestBody Match newMatchInfo){
        Match Match = matchService.updateMatch(id, newMatchInfo);
        if(Match == null) throw new MatchNotFoundException(id);
        
        return Match;
    }

    /**
     * If there is no Match with the given "id", throw a MatchNotFoundException
     * @param id
     * @param newMatchInfo
     * @return the updated, or newly added Match
     */
    @PatchMapping("/matches/{id}")
    public Match updateMatchChildren(@PathVariable Long id, @RequestBody MatchChildren childrenInfo){
        Match Match = matchService.setChildren(id, childrenInfo.getLeft(), childrenInfo.getRight());
        if(Match == null) throw new MatchNotFoundException(id);
        
        return Match;
    }

    /**
     * Remove a Match with the DELETE request to "/matches/{id}"
     * If there is no Match with the given "id", throw a MatchNotFoundException
     * @param id
     */
    @DeleteMapping("/matches/{id}")
    public void deleteMatch(@PathVariable Long id){
        try{
            matchService.deleteMatch(id);
         }catch(EmptyResultDataAccessException e) {
            throw new MatchNotFoundException(id);
         }
    }
}