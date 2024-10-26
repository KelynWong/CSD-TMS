package com.tms.tournament;

import java.util.*;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.tms.exception.InvalidTournamentStatusException;
import com.tms.exception.PlayerNotFoundException;
import com.tms.exception.TournamentExistsException;
import com.tms.exception.TournamentInvalidInputException;
import com.tms.exception.TournamentNotFoundException;
import com.tms.tournamentplayer.Player;
import com.tms.tournamentplayer.PlayerRepository;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/tournaments")
public class TournamentController {

    private TournamentService tournamentService;
    private PlayerRepository playerRepository;

    public TournamentController(TournamentService ts, PlayerRepository pr) {
        this.tournamentService = ts;
        this.playerRepository = pr;
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Service is healthy");
    }

    /* List all tournaments */
    @GetMapping
    public List<Tournament> getAllTournaments() {

        return tournamentService.listTournaments();
    }

    /* Get tournament by Id */
    @GetMapping("/id/{id}")
    public Tournament getTournamentbyId(@PathVariable Long id) {
        Tournament tournament = tournamentService.getTournament(id);

        // handle "tournament not found 404" error
        if (tournament == null)
            throw new TournamentNotFoundException(id);

        return tournamentService.getTournament(id);

    }

    /* Get tournaments by Status */
    @GetMapping("/status/{status}")
    public List<Tournament> getTournamentsByStatus(@PathVariable(value = "status") String status) {

        // Assume the status format given is _ instead of space (eg. "Registration_Start") 
        String modifiedStatus = status.replace("_", " ");
       
        if (!TournamentStatus.isValid(modifiedStatus)) {
            throw new InvalidTournamentStatusException(modifiedStatus);
        }

        List<Tournament> tournaments = tournamentService.listTournaments();
        List<Tournament> filteredTournaments = new ArrayList<>();

        for (Tournament t : tournaments) {
            if (t.getStatus().getStatustStr().equals(modifiedStatus)) {
                filteredTournaments.add(t);
            }
        }

        return filteredTournaments;

    }

    /* Create new tournament */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Tournament addTournament(@Valid @RequestBody Tournament tournament) {

        // Input validation
        if (!tournamentInputValidation(tournament)) {
            throw new TournamentInvalidInputException("creation");
        }

        // Add tournament
        Tournament savedTournament = tournamentService.addTournament(tournament);

        // Check if tournament exist : if yes, throw TournamentExistException, else
        // return savedTournament
        if (savedTournament == null)
            throw new TournamentExistsException(tournament.getTournamentName());
        return savedTournament;

    }

    /* Update tournament */
    @PutMapping("/{id}")
    public Tournament updateTournament(@PathVariable Long id, @Valid @RequestBody Tournament newTournament) {

        // Input validation
        if (!tournamentInputValidation(newTournament)) {
            throw new TournamentInvalidInputException("modification");
        }

        // Update tournament
        Tournament tournament = tournamentService.updateTournament(id, newTournament);

        // Check if tournament exist : if yes, throw TournamentExistException, else
        // return savedTournament
        if (tournament == null)
            throw new TournamentNotFoundException(id);
        return tournament;
    }

    /* Update just tournament status */
    @PutMapping("/{id}/status")
    public Tournament updateStatusByTournamentId(@PathVariable Long id, @RequestBody String status) {

        status = status.replace("\"","");

        if (!TournamentStatus.isValid(status)) {
            throw new InvalidTournamentStatusException(status);
        } 

        // Get tournament
        Tournament oldTournament = tournamentService.getTournament(id);
        if (oldTournament == null) {
            throw new TournamentNotFoundException(id);
        }

        oldTournament.setStatus(TournamentStatus.get(status));

        // Update tournament
        Tournament newTournament = tournamentService.updateTournament(id, oldTournament);
        
        return newTournament;

    }

    /* Update just tournament winner */
    @PutMapping("/{id}/winner")
    public Tournament updateWinnerByTournamentId(@PathVariable Long id, @RequestBody String winner) {

        winner = winner.replace("\"","").replace(" ","");

        // Get tournament
        Tournament oldTournament = tournamentService.getTournament(id);
        if (oldTournament == null) {
            throw new TournamentNotFoundException(id); //404
        }

        boolean foundWinner = false;

        for (Player p : oldTournament.getPlayers()) {
            if (p.getId().equals(winner)) {
                oldTournament.setWinner(winner);
                foundWinner = true;
            }
        }

        if (!foundWinner) {
            throw new PlayerNotFoundException(winner, id); // 404
        }

        // Update tournament
        Tournament newTournament = tournamentService.updateTournament(id, oldTournament);
        
        return newTournament;

    }

    /* Delete tournament */
    @DeleteMapping("/{id}")
    public void deleteTournament(@PathVariable Long id) {

        try {

            // retrieve the specified tournament 
            Tournament tournament = tournamentService.getTournament(id);
            // get the players map to this tournament
            List<Player> playerList = tournament.getPlayers();
            // loop thr the palyers
            for (Player p : playerList) {
                // remove the mappings
                p.getTournaments().remove(tournament);
                playerRepository.save(p);

            }

            tournamentService.deleteTournament(id);

        } catch (Exception e) {
            throw new TournamentNotFoundException(id);
        }
    }

    /* Helper class */
    // Input Validation
    public boolean tournamentInputValidation(Tournament tournament) {

        // Name - cannot be empty
        if (tournament.getTournamentName() == "") {
            log.info("ERROR: TOURNAMENT INPUT - EMPTY NAME");
            return false;
        }

        // Date - Order: regStartDT < regEndDT < startDT < endDT
        if (tournament.getRegEndDT().isBefore(tournament.getRegStartDT())) {
            log.info("ERROR: TOURNAMENT INPUT - REG END BEFORE REG START");
            return false;
        }

        if (tournament.getEndDT().isBefore(tournament.getStartDT())) {
            log.info("ERROR: TOURNAMENT INPUT - END BEFORE START");
            return false;
        }

        if (tournament.getRegEndDT().isAfter(tournament.getStartDT())) {
            log.info("ERROR: TOURNAMENT INPUT - REG END AFTER START");
            return false;
        }

        if (tournament.getStatus() == null || !TournamentStatus.isValid(tournament.getStatus())){
            log.info("ERROR: TOURNAMENT INPUT - WRONG STATUS");
            return false;
        }

        if (tournament.getCreatedBy() == null){
            log.info("ERROR: TOURNAMENT INPUT - NULL CREATOR");
            return false;
        }

        return true;
    }

}
