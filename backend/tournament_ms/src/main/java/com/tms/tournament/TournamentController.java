package com.tms.tournament;

import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
public class TournamentController {
    
    private TournamentService tournamentService;

    public TournamentController(TournamentService ts) {
        this.tournamentService = ts;
    }

    /* List all tournaments */
    @GetMapping("/tournaments")
    public List<Tournament> getTournaments() {
        return tournamentService.listTournaments();
    }

    /* Get tournament by Id */
    @GetMapping("/tournaments/{id}")
    public Tournament getTournament(@PathVariable Long id){
        Tournament tournament = tournamentService.getTournament(id);
        
        // handle "tournament not found 404" error
        if(tournament == null) throw new TournamentNotFoundException(id);
        return tournamentService.getTournament(id);

    }   
    
    /* Create new tournament */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/tournaments")
    public Tournament addTournament(@RequestBody Tournament tournament) {
        return tournamentService.addTournament(tournament);

    }

    /* Update tournament */
    @PutMapping("/tournaments/{id}")
    public Tournament updateTournament(@PathVariable Long id, @RequestBody Tournament newTournament) {
        Tournament tournament = tournamentService.updateTournament(id, newTournament);

        if (tournament == null) throw new TournamentNotFoundException(id);
        return tournament;
    }

    /* Delete tournament */
    @DeleteMapping("/tournaments/{id}")
    public void deleteTournament(@PathVariable Long id) {
        try {
            tournamentService.deleteTournament(id);
        } catch (EmptyResultDataAccessException e) {
            throw new TournamentNotFoundException(id);
        }
    }


}
