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
        // bind tournament Repo
        this.tournaments = tr;
        this.players = pr;
        this.autoStatusUpdateService = as;
    }

    public Player getPlayer(String id) {
        /// find tournament using specified id
        return players.findById(id).map(player -> { // findById(id) return Optional<Tournament> so map to extract
                                                    // Tournament obj
            // return retrieved tournament
            return player;

        }).orElse(null); // if cannot find tournament, return null
    }

    public List<Player> getAllPlayersByTournamentId(Long tournamentId) {

        // Find tournament specified by id
        return tournaments.findById(tournamentId).map(tournament -> {

            autoStatusUpdateService.autoUpdateTournament(tournament);

            // Return tournament's players
            return tournament.getPlayers();

            // Else, means specified tournament not found, throw TournamentNotFoundException
            // err 404
        }).orElse(null);
    }

    public List<Tournament> getAllTournamentsByPlayerId(String playerId) {
        // Find player specified by id
        return players.findById(playerId).map(player -> {

            // Get all tournaments of player
            List<Tournament> t_list = player.getTournaments();

            // For every tournament, Check and Update tournament Status based on regDTs
            autoStatusUpdateService.autoUpdateTournaments(t_list);

            return t_list;

            // Else, means specified player not found, throw PlayerNotFoundException err 404
        }).orElseThrow(() -> new PlayerNotFoundException(playerId)); // null or exception??
    }

    public Player createPlayer(String playerId) {
        // create player obj
        Player player = new Player(playerId, new ArrayList<>());
        // return saved the new player
        return players.save(player);

    }

    public Player addPlayerToTournament(Player player, Tournament tournament) {

        // [WARN] currently, if player is already registered, no err will be thrown. It
        // just dont update anything

        // If player is not registered in the tournament
        if (!tournament.isPlayerInTournament(player)) {
            // Add player into tournament (this function does mapping to both table)
            tournament.addPlayer(player);
        }

        // Return the player (no need to save in the DB - will auto save)
        return players.save(player);
    }

    public Player removePlayerFromTournament(Player player, Tournament tournament) {

        // If player is map to tournament, remove it.
        if (tournament.isPlayerInTournament(player)) {
            tournament.removePlayer(player);
            return players.save(player);
        }

        // Else, return null
        return null;
    }

    public Player deletePlayer(String id) {

        // find player specified by id
        return players.findById(id).map(player -> {

            // Remove all tournament-player mapping
            removeAllPlayerTournaments(player);
            // Now, no mapping can delete player
            players.delete(player);
            // if all ok, return player
            return player;

            // Reaching here means specified player not found, throw
            // PlayerNotFoundException err 404
        }).orElse(null);

    }

    private void removeAllPlayerTournaments(Player player) {

       player.removeAllTournaments();
       players.save(player);

    }

}
