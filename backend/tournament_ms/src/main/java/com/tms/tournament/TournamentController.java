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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.tms.exception.TournamentExistsException;
import com.tms.exception.TournamentInvalidInputException;
import com.tms.exception.TournamentNotFoundException;
import com.tms.tournamentplayer.Player;
import com.tms.tournamentplayer.PlayerRepository;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
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
    @GetMapping("/tournaments")
    public List<Tournament> getAllTournaments() {

        List<Tournament> tournamentList = tournamentService.listTournaments();

        for (Tournament t : tournamentList) {
            // Output Preparation
            t.setStatus(addSpacingBetweenWords(t.getStatus()));
        }

        return tournamentList;
    }

    /* Get tournament by Id */
    @GetMapping("/tournaments/id/{id}")
    public Tournament getTournamentbyId(@PathVariable Long id) {
        Tournament tournament = tournamentService.getTournament(id);

        // Output Preparation
        tournament.setStatus(addSpacingBetweenWords(tournament.getStatus()));

        // handle "tournament not found 404" error
        if (tournament == null)
            throw new TournamentNotFoundException(id);
        return tournamentService.getTournament(id);

    }

    /* Get tournaments by Status */
    @GetMapping("/tournaments/status/{status}")
    public List<Tournament> getTournamentsByStatus(@PathVariable(value = "status") String status) {
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

        // Input validation
        if (!tournamentInputValidation(tournament)) {
            throw new TournamentInvalidInputException("creation");
        }

        // Input Preparation
        tournament.setStatus(tournament.getStatus().replace(" ", ""));

        // Add tournament
        Tournament savedTournament = tournamentService.addTournament(tournament);

        // Check if tournament exist : if yes, throw TournamentExistException, else
        // return savedTournament
        if (savedTournament == null)
            throw new TournamentExistsException(tournament.getTournamentName());
        return savedTournament;

    }

    /* Update tournament */
    @PutMapping("/tournaments/{id}")
    public Tournament updateTournament(@PathVariable Long id, @RequestBody Tournament newTournament) {

        // Input validation
        if (!tournamentInputValidation(newTournament)) {
            throw new TournamentInvalidInputException("modification");
        }

        // Input Preparation
        newTournament.setStatus(newTournament.getStatus().replace(" ", ""));

        // Update tournament
        Tournament tournament = tournamentService.updateTournament(id, newTournament);

        // Check if tournament exist : if yes, throw TournamentExistException, else
        // return savedTournament
        if (tournament == null)
            throw new TournamentNotFoundException(id);
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

        // Status - only hv {"Scheduled", "RegistrationStart", "RegistrationClose",
        // "Ongoing", "Completed"}
        List<String> statusList = new ArrayList<>(
                Arrays.asList("Scheduled", "RegistrationStart", "RegistrationClose", "Ongoing", "Completed"));

        if (!statusList.contains(tournament.getStatus().replace(" ", ""))) {
            log.info("ERROR: TOURNAMENT INPUT - WRONG STATUS");
            return false;
        }

        return true;
    }

    // Add Spacing to string
    public String addSpacingBetweenWords(String stringWithoutSpacing) {

        String stringWithSpacing = "" + stringWithoutSpacing.charAt(0);
        // skip the first letter
        for (int i = 1; i < stringWithoutSpacing.length(); i++) {

            if (Character.isUpperCase(stringWithoutSpacing.charAt(i))) {
                stringWithSpacing += " ";
            }

            stringWithSpacing += stringWithoutSpacing.charAt(i);
        }

        return stringWithSpacing;

    }

}
