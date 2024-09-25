package com.tms.tournamentplayer;

import com.tms.tournament.*;

import lombok.extern.slf4j.Slf4j;

import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


@RestController
@Slf4j
public class PlayerController {

    private PlayerRepository players;
    private TournamentRepository tournaments;

    public PlayerController(PlayerRepository tur, TournamentRepository tr){
        this.players = tur;
        this.tournaments = tr;
    }

    @GetMapping("/callUserClient")
    public String getUserClient() {
        String uri = "http://localhost:8080/users";
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(uri, String.class);
        return result;
    }
    
    /* Get all tournament Players by tournament id */
    @GetMapping("/tournaments/{tournamentId}/players")
    public List<Player> getAllRegisteredPlayerByTournamentId(@PathVariable (value = "tournamentId") Long tournamentId) {
        // if tournament dont exist, throw tournamentNotFound err
        if(!tournaments.existsById(tournamentId)) {
            throw new TournamentNotFoundException(tournamentId);
        }
        // else, return list of tournament Players
        return tournaments.findById(tournamentId).map(tournament -> {
            return tournament.getPlayers();
        }).orElse(null);
    }

    /* Get all tournament Players by tournament id */
    // @GetMapping("/tournaments/{tournamentId}/players")
    // public int getNumberOfRegisteredPlayerByTournamentId(@PathVariable (value = "tournamentId") Long tournamentId) {
    //     // if tournament dont exist, throw tournamentNotFound err
    //     if(!tournaments.existsById(tournamentId)) {
    //         throw new TournamentNotFoundException(tournamentId);
    //     }
    //     // else, return list of tournament Players
    //     return tournaments.findById(tournamentId).map(tournament -> {
    //         return tournament.getPlayers().size();
    //     }).orElse(0);
    // }

    /* Register Player */
    @PostMapping("/tournaments/{tournamentId}/players/{playerId}/register")
    public Player registerPlayer(@PathVariable (value = "tournamentId") Long tournamentId, @PathVariable (value = "playerId") Long playerId) {
        
        Player player = players.findById(playerId).orElse(new Player(playerId, new ArrayList<>()));
        
        return tournaments.findById(tournamentId).map(tournament -> { // find tournament
            
            // if player is not registered in the tournament, add it. else, skip it
            if (!player.getTournaments().contains(tournament)) {
                log.info("log: added new tournamentplayer mapping");
                player.getTournaments().add(tournament);
                tournament.getPlayers().add(player); // need to update the tournament side oso
            }

            return players.save(player); // save - adds if player dont exist or updates if player exist
        }).orElseThrow(() -> new TournamentNotFoundException(tournamentId));
    
    }

    /* Deregister tournament Player */
    @PutMapping("/tournaments/{tournamentId}/players/{playerId}/deregister")
    public Player deregisterPlayer(@PathVariable (value = "tournamentId") Long tournamentId, 
                                            @PathVariable (value = "playerId") Long playerId) {
        // check if tournament exist
        if(!tournaments.existsById(tournamentId)) {
            throw new TournamentNotFoundException(tournamentId);
        }
        // remove tournament mapping
        return players.findById(playerId).map(player -> {
            player.getTournaments().remove(tournaments.findById(tournamentId).get());
            return players.save(player);
        }).orElseThrow(() -> new PlayerNotFoundException(tournamentId, playerId));

    }

    /* Update tournament Player */
    @PutMapping("/tournaments/{tournamentId}/players/{playerId}")
    public Player updateTournamentPlayer(@PathVariable (value = "tournamentId") Long tournamentId,
                                 @PathVariable (value = "playerId") Long playerId,
                                 @RequestBody Player newPlayer) {

        return players.findById(playerId).map(player -> {
            player.setTournaments(newPlayer.getTournaments());
            player.setId(newPlayer.getId());
            return players.save(player);
        }).orElseThrow(() -> new PlayerNotFoundException(tournamentId, playerId));
    }

    /* Delete tournament Player */
    // Use a ResponseEntity to have more control over the response sent to client
    @DeleteMapping("/tournaments/{tournamentId}/players/{playerId}")
    public ResponseEntity<?> deletePlayer(@PathVariable (value = "playerId") Long playerId) {
        
        return players.findById(playerId).map(player -> {
            players.delete(player);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new PlayerNotFoundException(playerId));

    }

    

   

}