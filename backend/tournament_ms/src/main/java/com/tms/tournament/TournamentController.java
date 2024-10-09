package com.tms.tournament;

import java.util.*;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.tms.tournamentplayer.*;
import com.tms.exception.*;

@RestController
public class TournamentController {
    
    private TournamentService tournamentService;
    private PlayerRepository playerRepository;

    public TournamentController(TournamentService ts, PlayerRepository pr) {
        this.tournamentService = ts;
        this.playerRepository = pr;
    }

    /* List all tournaments */
    @GetMapping("/tournaments")
    public List<Tournament> getAllTournaments() {
        return tournamentService.listTournaments();
    }

    /* Get tournament by Id */
    @GetMapping("/tournaments/id/{id}")
    public Tournament getTournamentbyId(@PathVariable Long id){
        Tournament tournament = tournamentService.getTournament(id);
        
        // handle "tournament not found 404" error
        if(tournament == null) throw new TournamentNotFoundException(id);
        return tournamentService.getTournament(id);

    }   

    /* Get tournaments by Status */
    @GetMapping("/tournaments/status/{status}")
    public List<Tournament> getTournamentsByStatus(@PathVariable(value = "status") String status){
        List<Tournament> tournaments = tournamentService.listTournaments();
        List<Tournament> filteredTournaments = new ArrayList<>();

        for (Tournament t : tournaments) {
            if (t.getStatus().equals(status)) {
                filteredTournaments.add(t);
            }
        }

        return filteredTournaments;

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

            Tournament tournament = tournamentService.getTournament(id);
            List<Player> playerList = tournament.getPlayers();

            for (Player p : playerList) {
                
                p.getTournaments().remove(tournament);
                playerRepository.save(p);

            }

            tournamentService.deleteTournament(id);
            
        } catch (EmptyResultDataAccessException e) {
            throw new TournamentNotFoundException(id);
        }
    }


}
