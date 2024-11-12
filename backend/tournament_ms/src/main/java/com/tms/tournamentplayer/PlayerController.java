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

    private PlayerService playerService;
    private TournamentService tournamentService;

    public PlayerController(PlayerService ps, TournamentService ts) {
        this.tournamentService = ts;
        this.playerService = ps;

    }

    /* Get all tournament players by tournament id */
    @GetMapping("/{tournamentId}/players")
    public List<Player> getAllPlayersByTournamentId(@PathVariable(value = "tournamentId") Long tournamentId) {

        // Return all the players of specified tournament
        return playerService.getAllPlayersByTournamentId(tournamentId);

    }

    /* Get all tournaments by player id */
    @GetMapping("/players/{playerId}")
    public List<Tournament> getAllTournamentsByPlayer(@PathVariable(value = "playerId") String playerId) {
        
        // Return all the players of specified tournament
        return playerService.getAllTournamentsByPlayerId(playerId);

    }

    /* Check if specified player is registered to specified tournament */
    @GetMapping("/{tournamentId}/players/{playerId}")
    public Map<String, Boolean> isRegistered(@PathVariable(value = "tournamentId") Long tournamentId,
            @PathVariable(value = "playerId") String playerId) {

        // Store result in ("isRegistered" : false) format
        Map<String, Boolean> result = new HashMap<>();

        // Get specified player by Id, 
        // if not found, return isRegistered : false
        Player player = playerService.getPlayer(playerId);
        if (player == null) {
            result.put("IsRegistered", false);
            return result;
        }

        // Get specified tournament
        Tournament tournament = tournamentService.getTournament(tournamentId);
        // tournament not found, throw err
        if (tournament == null) {
            throw new TournamentNotFoundException(tournamentId);
        }

        // tournament found
        // if player registered, return isRegistered : true
        if (tournament.isPlayerInTournament(player)) {
            result.put("IsRegistered", true);
            return result;
        }

        // Else, player is not registered, 
        // return isRegistered : false
        result.put("IsRegistered", false);
        return result;
    }

    /* Register Player */
    @PostMapping("/{tournamentId}/players/{playerId}/register")
    public Player registerPlayer(@PathVariable(value = "tournamentId") Long tournamentId,
            @PathVariable(value = "playerId") String playerId) {

        // Get specified player by Id, if not found, create new Player
        Player player = playerService.getPlayer(playerId);
        if (player == null) {
            player = playerService.createPlayer(playerId);
        }

        // Get specified tournament, if not found, throw err
        Tournament tournament = tournamentService.getTournament(tournamentId);
        if (tournament == null) {
            throw new TournamentNotFoundException(tournamentId);
        }
        // all found, map them together
        return playerService.addPlayerToTournament(player, tournament);

    }

    /* Deregister tournament Player */
    @PutMapping("/{tournamentId}/players/{playerId}/deregister")
    public Player deregisterPlayer(@PathVariable(value = "tournamentId") Long tournamentId,
            @PathVariable(value = "playerId") String playerId) {

        // Get specified player by Id
        // if not found, throw PlayerNotFoundException error
        Player player = playerService.getPlayer(playerId);
        if (player == null) {
            throw new PlayerNotFoundException(playerId);
        }

        // Get specified tournament
        // if not found, throw TournamentNotFoundException error
        Tournament tournament = tournamentService.getTournament(tournamentId);
        if (tournament == null) {
            throw new TournamentNotFoundException(tournamentId);
        }

        // Remove player from tournament
        // If player not found in tournament, throw PlayerNoFoundException err
        Player removedPlayer = playerService.removePlayerFromTournament(player, tournament);
        if (removedPlayer == null) {
            throw new PlayerNotFoundException(playerId, tournamentId);
        }

        // return removed Player
        return removedPlayer;

    }

    /* Delete tournament Player */
    // Use a ResponseEntity to have more control over the response sent to client
    @DeleteMapping("/players/{playerId}")
    public ResponseEntity<?> deletePlayer(@PathVariable(value = "playerId") String playerId) {
        // delete player
        Player deletedPlayer = playerService.deletePlayer(playerId);
        // if player not found, throw PlayerNotFoundException err
        if (deletedPlayer == null) {
            throw new PlayerNotFoundException(playerId);
        }
        // if all ok, return 200 (OK)
        return ResponseEntity.ok().build();

    }
}
