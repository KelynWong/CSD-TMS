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
    private AutoStatusUpdateService autoStatusUpdateService;
    private PlayerRepository playerRepository;

    public TournamentController(TournamentService ts, PlayerRepository pr, AutoStatusUpdateService as) {
        this.tournamentService = ts;
        this.playerRepository = pr;
        this.autoStatusUpdateService = as;
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Service is healthy");
    }

    /* List all tournaments */
    @GetMapping
    public List<Tournament> getAllTournaments() {

        // Get all tournaments, Update status by DT, return updated list
        List<Tournament> t_list = tournamentService.listTournaments();
        autoStatusUpdateService.autoUpdateTournaments(t_list);
        return t_list;
    }

    /* Get tournament by Id */
    @GetMapping("/id/{id}")
    public Tournament getTournamentbyId(@PathVariable Long id) {

        // Get tournament by id
        Tournament tournament = tournamentService.getTournament(id);

        // If the retrieved tournament is null, means tournement not found
        if (tournament == null)
            throw new TournamentNotFoundException(id); // throw "tournament not found 404" error

        // Else, check and update status based on regDTs, then return the retrieved
        // tournament
        autoStatusUpdateService.autoUpdateTournament(tournament);
        return tournamentService.getTournament(id);

    }

    /* Get tournaments by Status */
    @GetMapping("/status/{status}")
    public List<Tournament> getTournamentsByStatus(@PathVariable(value = "status") String status) {

        // Assume the status format given is _ instead of space (eg.
        // "Registration_Start")
        String modifiedStatus = status.replace("_", " ");

        // If status inputed is not valid, throw InvalidTournamentStatusException 409
        if (!TournamentStatus.isValid(modifiedStatus)) {
            throw new InvalidTournamentStatusException(modifiedStatus);
        }

        // Get all tournaments from DB
        List<Tournament> t_list = tournamentService.getTournamentsByStatus(TournamentStatus.get(modifiedStatus));

        autoStatusUpdateService.autoUpdateTournaments(t_list);

        // Return tournaments with specified status
        return t_list;

    }

    /* Create new tournament */
    @ResponseStatus(HttpStatus.CREATED) // Status Code : 201
    @PostMapping
    public Tournament addTournament(@Valid @RequestBody Tournament tournament) {

        // Input validation (method found below)
        if (!tournamentInputValidation(tournament)) {
            // Input validation FAILED! - throw TournamentInvalidInputException 409
            throw new TournamentInvalidInputException("creation");
        }

        // Input validation PASSED!
        // Add tournament to db
        Tournament savedTournament = tournamentService.addTournament(tournament);

        // Return saved tournament
        return savedTournament;

    }

    /* Update tournament */
    @PutMapping("/{id}")
    public Tournament updateTournament(@PathVariable Long id, @Valid @RequestBody Tournament newTournament) {

        // Input validation (method found below)
        if (!tournamentInputValidation(newTournament)) {
            // Input validation FAILED! - throw TournamentInvalidInputException 409
            throw new TournamentInvalidInputException("modification");
        }

        // Input validation PASSED!
        // Update tournament
        Tournament updatedTournament = tournamentService.updateTournament(id, newTournament);

        // If the updated tournament is null, means tournement not found
        if (updatedTournament == null)
            throw new TournamentNotFoundException(id); // throw "tournament not found 404" error

        // Else, return updated tournament
        return updatedTournament;
    }

    /* Update just tournament status */
    @PutMapping("/{id}/status")
    public Tournament updateStatusByTournamentId(@PathVariable Long id, @RequestBody String status) {

        // The inputed status can come with "" (eg. "Ongoing"), therefore, we need to
        // remove it
        String modifiedStatus = status.replace("\"", "");

        // If status inputed is not valid, throw InvalidTournamentStatusException 409
        if (!TournamentStatus.isValid(modifiedStatus)) {
            throw new InvalidTournamentStatusException(modifiedStatus);
        }

        // Get tournament
        Tournament tournament = tournamentService.getTournament(id);

        // If retrieved tournament is null, means tournament not found
        if (tournament == null) {
            throw new TournamentNotFoundException(id); // throw "tournament not found 404" error
        }

        // Change the status
        tournament.setStatus(TournamentStatus.get(modifiedStatus));

        // Update tournament - assume won't return null (aka tournament not found) as
        // its caught above
        Tournament updatedTournament = tournamentService.updateTournament(id, tournament);

        // Return updated tournament
        return updatedTournament;

    }

    /* Update just tournament winner */
    @PutMapping("/{id}/winner")
    public Tournament updateWinnerByTournamentId(@PathVariable Long id, @RequestBody String winner) {

        // The inputed status can come with "" (eg. "user123"), therefore, we need to
        // remove it
        String modifiedWinner = winner.replace("\"", "").replace(" ", "");

        // Get tournament
        Tournament tournament = tournamentService.getTournament(id);

        // If retrieved tournament is null, means tournament not found
        if (tournament == null) {
            throw new TournamentNotFoundException(id); // throw "tournament not found 404" error
        }

        // If winner is not in tournament, throw player not found exception
        if (!tournament.isPlayerInTournament(modifiedWinner)) {
            throw new PlayerNotFoundException(modifiedWinner, id);
        }

        // Here, all pass
        tournament.setWinner(modifiedWinner);

        // Else, if winner is found in tournament, update and return tournament
        return tournamentService.updateTournament(id, tournament);

    }

    /* Delete tournament */
    @DeleteMapping("/{id}")
    public void deleteTournament(@PathVariable Long id) {

        try {

            // Retrieve tournament using specified id
            Tournament tournament = tournamentService.getTournament(id);

            // Get all players mapped to this tournament
            List<Player> playerList = tournament.getPlayers();

            // Remove tournament-player mappings
            for (Player p : playerList) { // Loop thr the palyers

                // Remove tournament from player's tournament list
                p.getTournaments().remove(tournament);
                // save changes
                playerRepository.save(p);

            }

            // After all mapping removed, delete specified tournament
            tournamentService.deleteTournament(id);

        } catch (Exception e) { // Catch all types of exception

            // If its a NullPointerException, it is due to tournament not found
            if (e instanceof NullPointerException) {
                throw new TournamentNotFoundException(id); // throw "tournament not found 404" error
            }

            // Else, throw the given expection error
            throw e;

        }
    }

    /* Helper class */
    // Purpose : Input validation
    public boolean tournamentInputValidation(Tournament tournament) {

        /* Name should be unique and not empty */
        // Name - empty name
        if (tournament.getTournamentName() == "") {
            log.error("ERROR: TOURNAMENT INPUT - NAME CANNOT BE EMPTY");
            return false;
        }
        // Name - not unique
        if (tournamentService.getTournamentsByTournamentName(tournament.getTournamentName()).size() > 1) {
            log.error("ERROR: TOURNAMENT INPUT - THIS NAME EXIST LIAO");
            return false;
        }

        /* Correct Date Order : regStartDT < regEndDT < startDT < endDT */
        // Date - RegEndDT is before RegStartDT
        if (tournament.getRegEndDT().isBefore(tournament.getRegStartDT())) {
            log.error("ERROR: TOURNAMENT INPUT - REG END SHOULD BE AFTER REG START");
            return false;
        }
        // Date - EndDT is before StartDT
        if (tournament.getEndDT().isBefore(tournament.getStartDT())) {
            log.error("ERROR: TOURNAMENT INPUT - END SHOULD BE AFTER START");
            return false;
        }
        // Date - RegEndDT is after StartDT
        if (tournament.getRegEndDT().isAfter(tournament.getStartDT())) {
            log.error("ERROR: TOURNAMENT INPUT - REG END SHOULD BE BEFORE START");
            return false;
        }

        /* Status needs to be valid and not null */
        if (tournament.getStatus() == null || !TournamentStatus.isValid(tournament.getStatus())) {
            log.error("ERROR: TOURNAMENT INPUT - INVALID OR NULL STATUS");
            return false;
        }

        /* CreatedBy cannot be null */
        if (tournament.getCreatedBy() == null) {
            log.error("ERROR: TOURNAMENT INPUT - NULL CREATOR");
            return false;
        }

        // If all fail cases pass, return all inputs are valid :)
        return true;
    }

    

}
