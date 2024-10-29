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

    public PlayerController(PlayerRepository tur, TournamentRepository tr) {
        this.players = tur;
        this.tournaments = tr;
    }

    /* Get all tournament players by tournament id */
    @GetMapping("/{tournamentId}/players")
    public List<Player> getAllPlayersByTournamentId(@PathVariable(value = "tournamentId") Long tournamentId) {

        // Find tournament specified by id
        return tournaments.findById(tournamentId).map(tournament -> {
            // Return tournament's players
            return tournament.getPlayers();

            // Else, means specified tournament not found, throw TournamentNotFoundException
            // err 404
        }).orElseThrow(() -> new TournamentNotFoundException(tournamentId));

    }

    /* Get all tournaments by player id */
    @GetMapping("/players/{playerId}")
    public List<Tournament> getAllTournamentsByPlayer(@PathVariable(value = "playerId") String playerId) {

        // Find player specified by id
        return players.findById(playerId).map(player -> {
            // Return player's tournaments
            return player.getTournaments();

            // Else, means specified player not found, throw PlayerNotFoundException err 404
        }).orElseThrow(() -> new PlayerNotFoundException(playerId));

    }

    /* Check if specified player is registered to specified tournament */
    @GetMapping("/{tournamentId}/players/{playerId}")
    public Map<String, Boolean> isRegistered(@PathVariable(value = "tournamentId") Long tournamentId,
            @PathVariable(value = "playerId") String playerId) {

        // Get specified player by Id, if not found, throw PlayerNotFoundException error
        // 404
        Player player = players.findById(playerId).orElseThrow(() -> new PlayerNotFoundException(playerId));

        // Store result in ("isRegistered" : false) format
        Map<String, Boolean> result = new HashMap<>();

        // Find specified tournament by Id
        return tournaments.findById(tournamentId).map(tournament -> {

            // If player is registered in the tournament
            if (player.getTournaments().contains(tournament)) {

                // Put IsRegistered to true, and return result
                result.put("IsRegistered", true);
                return result;
            }

            // Else, player is not registered, put IsRegistered to false and return result
            result.put("IsRegistered", false);
            return result;

            // Reaching here means specified tournament not found, throw
            // TournamentNotFoundException err 404
        }).orElseThrow(() -> new TournamentNotFoundException(tournamentId));
    }

    /* Register Player */
    @PostMapping("/{tournamentId}/players/{playerId}/register")
    public Player registerPlayer(@PathVariable(value = "tournamentId") Long tournamentId,
            @PathVariable(value = "playerId") String playerId) {

        // Get specified player by Id, if not found, create new Player
        Player player = players.findById(playerId).orElse(new Player(playerId, new ArrayList<>()));

        // Find specified tournament by Id
        return tournaments.findById(tournamentId).map(tournament -> { // find tournament

            // [WARN] currently, if player is already registered, no err will be thrown. It
            // just dont update anything

            // If player is not registered in the tournament
            if (!player.getTournaments().contains(tournament)) {
                // Add player into tournament (this function does mapping to both table)
                tournament.addPlayer(player);
            }

            // Return the player (no need to save in the DB - will auto save)
            return player;

            // Reaching here means specified tournament not found, throw
            // TournamentNotFoundException err 404
        }).orElseThrow(() -> new TournamentNotFoundException(tournamentId));

    }

    /* Deregister tournament Player */
    @PutMapping("/{tournamentId}/players/{playerId}/deregister")
    public Player deregisterPlayer(@PathVariable(value = "tournamentId") Long tournamentId,
            @PathVariable(value = "playerId") String playerId) {

        // Get specified player by Id, if not found, create new Player
        Player player = players.findById(playerId).orElseThrow(() -> new PlayerNotFoundException(playerId));

        // Find specified tournament by Id
        return tournaments.findById(tournamentId).map(tournament -> {

            // If player is map to tournament, remove it.
            if (tournament.isPlayerInTournament(player)) {
                return tournament.removePlayer(player);
            }

            // Else, throw player not found exception
            throw new PlayerNotFoundException(playerId, tournamentId);

            // Reaching here means specified tournament not found, throw
            // TournamentNotFoundException err 404
        }).orElseThrow(() -> new TournamentNotFoundException(tournamentId));

    }

    /* Delete tournament Player */
    // Use a ResponseEntity to have more control over the response sent to client
    @DeleteMapping("/players/{playerId}")
    public ResponseEntity<?> deletePlayer(@PathVariable(value = "playerId") String playerId) {

        // find player specified by id
        return players.findById(playerId).map(player -> {

            // Remove all tournament-player mapping
            player.removeAllTournaments();
            // Now, no mapping can delete player
            players.delete(player); 
            // if all ok, return 200 (OK)
            return ResponseEntity.ok().build(); 

            // Reaching here means specified tournament not found, throw PlayerNotFoundException err 404
        }).orElseThrow(() -> new PlayerNotFoundException(playerId));

    }

}
