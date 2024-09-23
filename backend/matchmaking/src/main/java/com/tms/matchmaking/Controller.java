package com.tms.matchmaking;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.http.ResponseEntity;

@RestController
public class Controller {
    RestClient restClient = RestClient.create();

    public Controller(){
        // this.matchService = bs;
    }

    // /**
    //  * List all matches in the system
    //  * @return list of all matches
    //  */
    // @GetMapping("/matches")
    // public List<Match> getMatches(){
    //     return matchService.listMatches();
    // }

    // /**
    //  * Search for Match with the given id
    //  * If there is no Match with the given "id", throw a MatchNotFoundException
    //  * @param id
    //  * @return Match with the given id
    //  */
    // @GetMapping("/matches/{id}")
    // public Match getMatch(@PathVariable Long id){
    //     Match match = matchService.getMatch(id);

    //     // Need to handle "Match not found" error using proper HTTP status code
    //     // In this case it should be HTTP 404
    //     if(match == null) throw new MatchNotFoundException(id);
    //     return match;

    // }

    // /**
    //  * Search for Match with all games with the given id
    //  * If there is no Match with the given "id", throw a MatchNotFoundException
    //  * @param id
    //  * @return Match with the given id
    //  */
    // @GetMapping("/matches-with-games/{id}")
    // public MatchDTO getMatchWithGames(@PathVariable Long id) {
    //     MatchDTO matchDTO = matchService.getMatchWithGames(id);
    //     if(matchDTO == null) throw new MatchNotFoundException(id);
    //     return matchDTO;
    // }


    /**
     * Add a new Match with POST request to "/matches"
     * Note the use of @RequestBody
     * @param Match
     * @return list of all matches
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/matchmaking")
    public ResponseEntity<String> matchMake(){
        ResponseEntity<String> res = restClient.post()
        .uri("https://httpbin.org/post")
        .retrieve()
        .toEntity(String.class);
         // .body()

        // System.out.println(res);
        return res;
    }

    // /**
    //  * If there is no Match with the given "id", throw a MatchNotFoundException
    //  * @param id
    //  * @param newMatchInfo
    //  * @return the updated, or newly added Match
    //  */
    // @PutMapping("/matches/{id}")
    // public Match updateMatch(@PathVariable Long id, @RequestBody Match newMatchInfo){
    //     Match Match = matchService.updateMatch(id, newMatchInfo);
    //     if(Match == null) throw new MatchNotFoundException(id);
        
    //     return Match;
    // }

    // /**
    //  * Remove a Match with the DELETE request to "/matches/{id}"
    //  * If there is no Match with the given "id", throw a MatchNotFoundException
    //  * @param id
    //  */
    // @DeleteMapping("/matches/{id}")
    // public void deleteMatch(@PathVariable Long id){
    //     try{
    //         matchService.deleteMatch(id);
    //      }catch(EmptyResultDataAccessException e) {
    //         throw new MatchNotFoundException(id);
    //      }
    // }
}