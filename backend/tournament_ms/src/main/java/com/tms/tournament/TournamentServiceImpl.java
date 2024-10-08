package com.tms.tournament;

import java.util.List;

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
        return tournaments.save(tournament);
    }

    @Override
    public Tournament updateTournament(Long id, Tournament newTournament){
        return tournaments.findById(id).map(tournament -> {
            
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

            // Saving changes
            return tournaments.save(tournament);
            
        }).orElse(null);
    }

    @Override
    public void deleteTournament(Long id){
        tournaments.deleteById(id);
    }
    


    
}
