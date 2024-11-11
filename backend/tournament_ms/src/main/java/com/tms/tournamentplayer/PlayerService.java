package com.tms.tournamentplayer;

import org.springframework.stereotype.Service;

import com.tms.tournament.*;
import com.tms.exception.PlayerNotFoundException;
import com.tms.exception.TournamentNotFoundException;

import java.util.*;

@Service
public class PlayerService {

    private TournamentRepository tournaments;
    private PlayerRepository players;
    private AutoStatusUpdateService autoStatusUpdateService;

    public PlayerService(TournamentRepository tr, PlayerRepository pr, AutoStatusUpdateService as) {
        this.tournaments = tr;
        this.players = pr;
        this.autoStatusUpdateService = as;
    }

    // Purpose : get all players from specified tournament
    public List<Player> getAllPlayersByTournamentId(Long tournamentId) {

        // Find tournament specified by id
        return tournaments.findById(tournamentId).map(tournament -> {
            // Auto update the tournament Status by datetime
            autoStatusUpdateService.autoUpdateTournament(tournament);
            // Return tournament's players
            return tournament.getPlayers();

            // Else, means specified tournament not found, throw TournamentNotFoundException
            // err 404
        }).orElseThrow(() -> new TournamentNotFoundException(tournamentId));
    }

    // Purpose : get all tournaments from specified player
    public List<Tournament> getAllTournamentsByPlayerId(String playerId) {
        // Find player specified by id
        return players.findById(playerId).map(player -> {
            // Get all tournaments of player
            List<Tournament> t_list = player.getTournaments();
            // Auto update the tournament Status by datetime
            autoStatusUpdateService.autoUpdateTournaments(t_list);
            // return player's tournaments
            return t_list;

            // Else, means specified player not found, throw PlayerNotFoundException err 404
        }).orElseThrow(() -> new PlayerNotFoundException(playerId)); // null or exception??
    }

    public Player getPlayer(String id) {
        // find tournament using specified id
        // - findById(id) return Optional<Tournament> so map to extract Tournament obj
        return players.findById(id).map(player -> {
            // return retrieved tournament
            return player;

        }).orElse(null); // if cannot find tournament, return null
    }

    // Purpose : create a player
    public Player createPlayer(String playerId) {

        // Check if player id alrdy exist
        if (players.existsById(playerId)) {
            // return null
            return null;
        }

        // If not exist, create player
        Player player = new Player(playerId, new ArrayList<>());
        // save player in db and return it
        return players.save(player);

    }

    // Purpose : map player to tournament
    public Player addPlayerToTournament(Player player, Tournament tournament) {

        // Assumption : player and tournament passed in both exist

        // If player is not registered in the tournament
        if (!tournament.isPlayerInTournament(player)) {
            // Add player into tournament (this function does mapping to both table)
            // but not save in db yet
            tournament.addPlayer(player);
        }

        // Save changes in db and return player
        return players.save(player);
    }

    // Purpose : remove mapping between specified player and tournament
    public Player removePlayerFromTournament(Player player, Tournament tournament) {

        // If player is map to tournament
        if (tournament.isPlayerInTournament(player)) {
            // remove player from tournament
            tournament.removePlayer(player);
            // save changes and return player
            return players.save(player);
        }

        // Else, player alrdy not in tournament, return null
        return null;
    }

    // Purpose : delete player
    public Player deletePlayer(String id) {

        // find player specified by id
        return players.findById(id).map(player -> {

            // if player has mapping to tournaments
            if (!player.getTournaments().isEmpty()) {
                // Remove all tournament-player mapping
                removeAllPlayerTournaments(player);
            }

            // Now, no mapping can delete player
            players.delete(player);
            // if all ok, return player
            return player;

            // Reaching here means specified player not found
            // return null
        }).orElse(null);

    }

    // Purpose : remove all tournament mapping to specified player
    private void removeAllPlayerTournaments(Player player) {
        // remove all tournament mapping
        player.removeAllTournaments();
        // save changes
        players.save(player);

    }

}
