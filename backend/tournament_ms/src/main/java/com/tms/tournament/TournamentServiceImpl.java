package com.tms.tournament;

import java.util.*;

import org.springframework.stereotype.Service;

/* This implementation is meant for business logic */
@Service
public class TournamentServiceImpl implements TournamentService{

    private TournamentRepository tournaments;

    public TournamentServiceImpl(TournamentRepository tr) {
        this.tournaments = tr;
    }

    @Override
    public List<Tournament> listTournaments() {
        return tournaments.findAll();
    }

    @Override
    public Tournament getTournament(Long id){
        return tournaments.findById(id).map(tournament -> {
            return tournament;
        }).orElse(null);
        
    }

    @Override
    public Tournament addTournament(Tournament tournament) {

        // Input Validation
        if (!tournamentInputValidation(tournament)) {
            return null;
        }

        // Input Preparation (need testing)
        String status = tournament.getStatus(); 
        String trimedStatus = status.replace(" ", "");
        
        tournament.setStatus(trimedStatus);

        return tournaments.save(tournament);
    }

    @Override
    public Tournament updateTournament(Long id, Tournament newTournament){
        return tournaments.findById(id).map(tournament -> {

            // Input Validation
            if (!tournamentInputValidation(tournament)) {
                return null;
            }
            
            // Input Preparation (need testing)
            String newStatus = newTournament.getStatus(); 
            String trimedNewStatus = newStatus.replace(" ", "");
            
            // Setting new values
            tournament.setTournamentName(newTournament.getTournamentName());
            tournament.setRegEndDT(newTournament.getRegEndDT());
            tournament.setRegStartDT(newTournament.getRegStartDT());
            tournament.setStatus(trimedNewStatus);
            tournament.setStartDT(newTournament.getStartDT());
            tournament.setEndDT(newTournament.getEndDT());
            tournament.setCreatedBy(newTournament.getCreatedBy());
            tournament.setWinner(newTournament.getWinner());

            // Saving changes
            return tournaments.save(tournament);

        }).orElse(null);
    }

    @Override
    public void deleteTournament(Long id){
        tournaments.deleteById(id);
    }
    

    public boolean tournamentInputValidation(Tournament tournament) {

        // Name - cannot be empty or null or same as existing tournaments
        if (tournament.getTournamentName() == "" || tournament.getTournamentName() == null) {
            return false;
        }

        List<Tournament> tournamentWithSameName = tournaments.findByTournamentName(tournament.getTournamentName());
        if (tournamentWithSameName.size() == 0) {
            return false;
        }

        // Date - Order: regStartDT < regEndDT < startDT < endDT
        if (tournament.getRegEndDT().isBefore(tournament.getRegStartDT())) {
            return false;
        }

        if (tournament.getEndDT().isBefore(tournament.getStartDT())) {
            return false;
        }

        if (tournament.getRegEndDT().isAfter(tournament.getStartDT())) {
            return false;
        }

        // Status - only hv {"Scheduled", "RegistrationStart", "RegistrationClose", "In Progress", "Completed"}
        List<String> statusList = new ArrayList<>(Arrays.asList("Scheduled", "RegistrationStart", "RegistrationClose", "InProgress", "Completed"));

        if (!statusList.contains(tournament.getStatus().replace(" ", ""))) {
            return false;
        }

        return true;
    }


    
}
