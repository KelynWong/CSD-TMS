package com.tms.tournament;

import java.util.*;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

/* This implementation is meant for business logic */
@Service
@Slf4j
public class TournamentServiceImpl implements TournamentService {

    private TournamentRepository tournaments;

    public TournamentServiceImpl(TournamentRepository tr) {
        // bind tournament Repo
        this.tournaments = tr;
    }

    // Assume all tournament input values are valid!

    @Override
    public List<Tournament> listTournaments() {
        // return all tournaments in db
        return tournaments.findAll();
    }

    @Override
    public List<Tournament> getTournamentsByStatus(TournamentStatus status) {
        // return all tournaments with specified status (jpa - custom)
       return tournaments.findByStatus(status);
    }

    @Override
    public List<Tournament> getTournamentsByTournamentName(String tournamentName) {
        // return all tournaments with specified tournamentName (jpa - custom)
       return tournaments.findByTournamentName(tournamentName);
    }

    @Override
    public Tournament getTournament(Long id) {
        /// find tournament using specified id
        return tournaments.findById(id).map(tournament -> { // findById(id) return Optional<Tournament> so map to extract Tournament obj
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
    public void deleteTournament(Long id) {
        // delete tournament specified by id
        tournaments.deleteById(id);
    }

}
