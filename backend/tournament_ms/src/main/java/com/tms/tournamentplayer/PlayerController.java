package com.tms.tournamentplayer;

import com.tms.tournament.*;

import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


@RestController
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
    @GetMapping("/tournaments/{tournamentId}/Players")
    public List<Player> getAllPlayerByTournamentId(@PathVariable (value = "tournamentId") Long tournamentId) {
        // if tournament dont exist, throw tournamentNotFound err
        if(!tournaments.existsById(tournamentId)) {
            throw new TournamentNotFoundException(tournamentId);
        }
        // else, return list of tournament Players
        return tournaments.findById(tournamentId).map(tournament -> {
            return tournament.getPlayers();
        }).orElse(null);
    }

    /* Create tournament Player */
    @PostMapping("/tournaments/{tournamentId}/players")
    public Player addTournamentPlayer(@PathVariable (value = "tournamentId") Long tournamentId, @RequestBody Player player) {
        return tournaments.findById(tournamentId).map(tournament -> {
            if (player.getTournaments() == null) {
                List<Tournament> newTournaments = new ArrayList<>();
                newTournaments.add(tournament);
                player.setTournaments(newTournaments);
            } else {
                player.getTournaments().add(tournament);
            }
            tournament.getPlayers().add(player);
            return players.save(player);
        }).orElseThrow(() -> new TournamentNotFoundException(tournamentId));
    
    }

    /* Update tournament Player */
    @PutMapping("/tournaments/{tournamentId}/players/{playerId}")
    public Player updatePlayer(@PathVariable (value = "tournamentId") Long tournamentId,
                                 @PathVariable (value = "playerId") Long playerId,
                                 @RequestBody Player newPlayer) {

        return players.findById(playerId).map(player -> {
            player.setTournaments(newPlayer.getTournaments());
            player.setId(newPlayer.getId());
            player.setUsername(newPlayer.getUsername());
            return players.save(player);
        }).orElseThrow(() -> new PlayerNotFoundException(tournamentId, playerId));
    }

    /* Delete tournament Player */
    // Use a ResponseEntity to have more control over the response sent to client
    @DeleteMapping("/tournaments/{tournamentId}/Players/{playerId}")
    public ResponseEntity<?> deleteReview(@PathVariable (value = "tournamentId") Long tournamentId, 
                                            @PathVariable (value = "playerId") Long playerId) {
        
        if(!tournaments.existsById(tournamentId)) {
            throw new TournamentNotFoundException(tournamentId);
        }

        return players.findById(playerId).map(player -> {
            players.delete(player);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new PlayerNotFoundException(tournamentId, playerId));
    }
    
    
}
