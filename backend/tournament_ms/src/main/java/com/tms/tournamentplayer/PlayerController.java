package com.tms.tournamentplayer;

import com.tms.tournament.*;
import com.tms.exception.*;

import lombok.extern.slf4j.Slf4j;

import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@Slf4j
@RequestMapping("/tournaments")
public class PlayerController {

    private PlayerRepository players;
    private TournamentRepository tournaments;

    public PlayerController(PlayerRepository tur, TournamentRepository tr){
        this.players = tur;
        this.tournaments = tr;
    }
    
    /* Get all tournament Players by tournament id */
    @GetMapping("/{tournamentId}/players")
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

    /* Get all tournaments by player id */
    @GetMapping("/players/{playerId}")
    public List<Tournament> getAllTournamentsByPlayer(@PathVariable(value = "playerId") String playerId) {

        // if player dont exist, throw playerNotFound err
        if(!players.existsById(playerId)) {
            throw new PlayerNotFoundException(playerId);
        }
        
        // else, return list of tournaments 
        return players.findById(playerId).map(player -> {
            List<Tournament> tournamentList = player.getTournaments();     
            return tournamentList;
        }).orElse(null);
    }

    @GetMapping("/{tournamentId}/players/{playerId}")
    public Map<String,Boolean> IsRegister(@PathVariable (value = "tournamentId") Long tournamentId, @PathVariable (value = "playerId") String playerId) {
        Player player = players.findById(playerId).orElseThrow(() -> new PlayerNotFoundException(playerId));
        Map<String,Boolean> result = new HashMap<>();
        
        return tournaments.findById(tournamentId).map(tournament -> { // find tournament
            
            // if player is not registered in the tournament, return true;
            if (player.getTournaments().contains(tournament)) {
                
                result.put("IsRegistered", true);
                return result; 
                
            }

            // Else, return false
            result.put("IsRegistered", false);
            return result; 

        }).orElseThrow(() -> new TournamentNotFoundException(tournamentId));
    }

    /* Register Player */
    @PostMapping("/{tournamentId}/players/{playerId}/register")
    public Player registerPlayer(@PathVariable (value = "tournamentId") Long tournamentId, @PathVariable (value = "playerId") String playerId) {
        
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
    @PutMapping("/{tournamentId}/players/{playerId}/deregister")
    public Player deregisterPlayer(@PathVariable (value = "tournamentId") Long tournamentId, 
                                            @PathVariable (value = "playerId") String playerId) {
        // check if tournament exist
        if(!tournaments.existsById(tournamentId)) {
            throw new TournamentNotFoundException(tournamentId);
        }
        // remove tournament mapping
        return players.findById(playerId).map(player -> {
            player.getTournaments().remove(tournaments.findById(tournamentId).get());
            return players.save(player);
        }).orElseThrow(() -> new PlayerNotFoundException(playerId, tournamentId));

    }

    /* Update tournament Player */
    // @PutMapping("/tournaments/{tournamentId}/players/{playerId}")
    // public Player updateTournamentPlayer(@PathVariable (value = "tournamentId") Long tournamentId,
    //                              @PathVariable (value = "playerId") String playerId,
    //                              @RequestBody Player newPlayer) {

    //     return players.findById(playerId).map(player -> {
    //         player.setTournaments(newPlayer.getTournaments());
    //         player.setId(newPlayer.getId());
    //         return players.save(player);
    //     }).orElseThrow(() -> new PlayerNotFoundException(playerId, tournamentId));
    // }

    /* Delete tournament Player */
    // Use a ResponseEntity to have more control over the response sent to client
    @DeleteMapping("/{tournamentId}/players/{playerId}")
    public ResponseEntity<?> deletePlayer(@PathVariable (value = "playerId") String playerId) {
        
        return players.findById(playerId).map(player -> {
            players.delete(player);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new PlayerNotFoundException(playerId));

    }

}
