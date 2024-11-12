package com.tms.tournament;

import java.util.*;

import org.springframework.stereotype.Service;

import com.tms.exception.TournamentNotFoundException;

import lombok.extern.slf4j.Slf4j;

/* This implementation is meant for business logic */
@Service
@Slf4j
public class TournamentServiceImpl implements TournamentService {

    private TournamentRepository tournaments;
    private AutoStatusUpdateService autoStatusUpdateService;

    public TournamentServiceImpl(TournamentRepository tr, AutoStatusUpdateService as) {
        this.tournaments = tr;
        this.autoStatusUpdateService = as;
    }

    // Assume all tournament input values are valid!

    @Override
    public List<Tournament> listTournaments() {
        // get all tournaments from db
        List<Tournament> t_list = tournaments.findAll();
        // update status by datetime
        autoStatusUpdateService.autoUpdateTournaments(t_list);
        // return tournament list
        return t_list;
    }

    @Override
    public List<Tournament> getTournamentsByStatus(TournamentStatus status) {
        // get all tournaments from db
        List<Tournament> t_list = tournaments.findAll();
        // update status by datetime
        autoStatusUpdateService.autoUpdateTournaments(t_list);
        // return all tournaments with specified status (jpa - custom)
        return tournaments.findByStatus(status);
    }

    @Override
    public List<Tournament> getTournamentsByTournamentName(String tournamentName) {
        // get all tournaments with specified tournamentName (jpa - custom)
        List<Tournament> t_list = tournaments.findByTournamentName(tournamentName);
        // Update status based on datetime
        autoStatusUpdateService.autoUpdateTournaments(t_list);
        // return tournament list
        return t_list;
    }

    @Override
    public Tournament getTournament(Long id) {
        /// find tournament using specified id
        return tournaments.findById(id).map(tournament -> { // findById(id) return Optional<Tournament> so map to
                                                            // extract Tournament obj
            // update status based on datetime
            autoStatusUpdateService.autoUpdateTournament(tournament);
            // return retrieved tournament
            return tournament;

        }).orElse(null); // if cannot find tournament, return null
    }

    @Override
    public Tournament addTournament(Tournament tournament) {
        // return saved the new tournament
        return tournaments.save(tournament);
    }

    @Override
    public Tournament updateTournament(Long id, Tournament newTournament) {
        // find tournament using specified id
        return tournaments.findById(id).map(tournament -> {

            // update with new values
            tournament.setTournamentName(newTournament.getTournamentName());
            tournament.setRegEndDT(newTournament.getRegEndDT());
            tournament.setRegStartDT(newTournament.getRegStartDT());
            tournament.setStatus(newTournament.getStatus());
            tournament.setStartDT(newTournament.getStartDT());
            tournament.setEndDT(newTournament.getEndDT());
            tournament.setCreatedBy(newTournament.getCreatedBy());
            tournament.setWinner(newTournament.getWinner());

            // saving changes and return modified tournament
            return tournaments.save(tournament);

        }).orElse(null); // if cannot find tournament, return null
    }

    @Override
    public Tournament deleteTournament(Long id) {
        // find tournament specified by id
        return tournaments.findById(id).map(tournament -> {

            // if player has mapping to tournaments
            if (!tournament.getPlayers().isEmpty()) {
                // Remove all tournament-player mapping
                removeAllTournamentPlayers(tournament);
            }
            // Now, no mapping can delete player
            tournaments.delete(tournament);
            // if all ok, return player
            return tournament;

            // Reaching here means specified tournament not found, throw
            // TournamentNotFoundException err 404
        }).orElseThrow(() -> new TournamentNotFoundException(id));
    }

    private void removeAllTournamentPlayers(Tournament tournament) {
        // remove all player mapping
        tournament.removeAllPlayers();
        // save changes
        tournaments.save(tournament);

    }

}
