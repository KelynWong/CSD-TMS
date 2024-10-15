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
        this.tournaments = tr;
    }

    @Override
    public List<Tournament> listTournaments() {
        return tournaments.findAll();
    }

    @Override
    public Tournament getTournament(Long id) {
        return tournaments.findById(id).map(tournament -> {
            return tournament;
        }).orElse(null);

    }

    @Override
    public Tournament addTournament(Tournament tournament) {

        // If got existing tournament with the same name, return null
        List<Tournament> tournamentWithSameName = tournaments.findByTournamentName(tournament.getTournamentName());
        if (tournamentWithSameName.size() != 0) {
            log.info("ERROR: TOURNAMENT INPUT - SAME NAME");
            return null;
        }

        // Else, save the new tournament
        return tournaments.save(tournament);
    }

    @Override
    public Tournament updateTournament(Long id, Tournament newTournament) {
        return tournaments.findById(id).map(tournament -> {

            // Setting new values
            tournament.setTournamentName(newTournament.getTournamentName());
            tournament.setRegEndDT(newTournament.getRegEndDT());
            tournament.setRegStartDT(newTournament.getRegStartDT());
            tournament.setStatus(newTournament.getStatus());
            tournament.setStartDT(newTournament.getStartDT());
            tournament.setEndDT(newTournament.getEndDT());
            tournament.setCreatedBy(newTournament.getCreatedBy());
            tournament.setWinner(newTournament.getWinner());

            // Saving changes
            return tournaments.save(tournament);

        }).orElse(null);
    }

    @Override
    public void deleteTournament(Long id) {
        tournaments.deleteById(id);
    }

}
