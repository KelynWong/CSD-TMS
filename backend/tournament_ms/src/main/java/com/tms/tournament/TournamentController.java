package com.tms.tournament;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.tms.exception.InvalidTournamentStatusException;
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

    // constants 
    // Status - only hv {"Scheduled", "RegistrationStart", "RegistrationClose", "Ongoing", "Completed"}
    private List<String> validStatusList = Arrays.asList("Scheduled", "RegistrationStart", "RegistrationClose", "Ongoing", "Completed");

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
       
        if (!validStatusList.contains(status.replace(" ", ""))) {
            throw new InvalidTournamentStatusException(status);
        }

        List<Tournament> tournaments = tournamentService.listTournaments();
        List<Tournament> filteredTournaments = new ArrayList<>();

        for (Tournament t : tournaments) {
            if (t.getStatus().replace(" ", "").equals(status)) {
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

    @PutMapping("/{id}/status")
    public Tournament updateStatusByTournamentId(@PathVariable Long id, @RequestBody String status) {
        
        if (!validStatusList.contains(status.replace(" ", ""))) {
            throw new InvalidTournamentStatusException(status);
        } 

        // Get tournament
        Tournament oldTournament = tournamentService.getTournament(id);
        oldTournament.setStatus(status);

        // Update tournament
        Tournament newTournament = tournamentService.updateTournament(id, oldTournament);

        // Check if tournament exist : if yes, throw TournamentExistException, else
        // return savedTournament
        if (newTournament == null)
            throw new TournamentNotFoundException(id);
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

        if (!validStatusList.contains(tournament.getStatus().replace(" ", ""))) {
            log.info("ERROR: TOURNAMENT INPUT - WRONG STATUS");
            return false;
        }

        return true;
    }

}
