package com.tms.tournament;

import java.util.*;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.tms.exception.*;
import com.tms.exception.TournamentNotFoundException;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/tournaments")
public class TournamentController {

    private TournamentService tournamentService;

    public TournamentController(TournamentService ts) {
        this.tournamentService = ts;
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Service is healthy");
    }

    /* List all tournaments */
    @GetMapping
    public List<Tournament> getAllTournaments() {
        // Return all tournaments from db
        return tournamentService.listTournaments();
    }

    /* Get tournament by Id */
    @GetMapping("/id/{id}")
    public Tournament getTournamentbyId(@PathVariable Long id) {
        // Get tournament by id
        Tournament tournament = tournamentService.getTournament(id);
        // If the retrieved tournament is null, means tournement not found
        if (tournament == null) {
            // throw "tournament not found 404" error
            throw new TournamentNotFoundException(id);
        }

        // Return the updated tournament
        return tournament;

    }

    /* Get tournaments by Status */
    @GetMapping("/status/{status}")
    public List<Tournament> getTournamentsByStatus(@PathVariable(value = "status") String status) {
        // Example of passed-in status format (eg. "Registration_Start")
        // - To match the tournamentStatus string, need to replace '_' to ' '
        String modifiedStatus = status.replace("_", " ");

        // Status invalid : throw InvalidTournamentStatusException (409)
        if (!TournamentStatus.isValid(modifiedStatus)) {
            throw new InvalidTournamentStatusException(modifiedStatus);
        }
        // Status valid : return all tournaments with specified status from DB
        return tournamentService.getTournamentsByStatus(TournamentStatus.get(modifiedStatus));

    }

    /* Create new tournament */
    @ResponseStatus(HttpStatus.CREATED) // Status Code : 201
    @PostMapping
    public Tournament addTournament(@Valid @RequestBody Tournament tournament) {
        // Input invalid : throw TournamentInvalidInputException (409)
        if (!isTournamentInputValid(tournament, "creation")) {
            throw new TournamentInvalidInputException("creation");
        }
        // Input valid : add tournament to db and return savedTournament
        return tournamentService.addTournament(tournament);

    }

    /* Update tournament */
    @PutMapping("/{id}")
    public Tournament updateTournament(@PathVariable Long id, @Valid @RequestBody Tournament newTournament) {

        // Input invalid : throw TournamentInvalidInputException (409)
        if (!isTournamentInputValid(newTournament, "modification")) {
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

        // The inputed status can come with "" (eg. "Ongoing"), need to remove
        String modifiedStatus = status.replace("\"", "");

        // Invalid status : throw InvalidTournamentStatusException 409
        if (!TournamentStatus.isValid(modifiedStatus)) {
            throw new InvalidTournamentStatusException(modifiedStatus);
        }

        // Valid status : get tournament
        Tournament tournament = tournamentService.getTournament(id);

        // Tournament not found : // throw "tournament not found 404" error
        if (tournament == null) {
            throw new TournamentNotFoundException(id);
        }

        // Tournament found : change tournament status
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

        // The inputed status can come with "" (eg. "user123"), need to remove
        String modifiedWinner = winner.replace("\"", "").replace(" ", "");

        // Get tournament
        Tournament tournament = tournamentService.getTournament(id);

        // Tournament not found : throw "tournament not found 404" error
        if (tournament == null) {
            throw new TournamentNotFoundException(id);
        }

        // Tounament found!
        // Winner not found in tournament : throw player not found
        if (!tournament.isPlayerInTournament(modifiedWinner)) {
            throw new PlayerNotFoundException(modifiedWinner, id);
        }

        // Winner found : set tournament winner
        tournament.setWinner(modifiedWinner);
        tournament.setStatus(TournamentStatus.COMPLETED); // (CHANGE TESTCASE)

        // Update and return tournament
        return tournamentService.updateTournament(id, tournament);

    }

    /* Delete tournament */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTournament(@PathVariable Long id) {
        // delete tournament
        tournamentService.deleteTournament(id);
        // all good, return 200 http response
        return ResponseEntity.ok().build();

    }

    /* Helper class */
    // Purpose : Input validation
    private boolean isTournamentInputValid(Tournament tournament, String action) {

        /* Name should be unique and not empty */
        // Name - empty name
        if (tournament.getTournamentName() == "") {
            log.error("ERROR: TOURNAMENT INPUT - NAME CANNOT BE EMPTY");
            return false;
        }
        // Name - not unique
        if (!nameDontExist(tournament, action)) {
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

        /* Status cannot be not null */
        if (tournament.getStatus() == null) {
            log.error("ERROR: TOURNAMENT INPUT - NULL STATUS");
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

    // Purpose : Check if name exist in existing tournaments
    private boolean nameDontExist(Tournament newTournament, String action) {
        String t_name = newTournament.getTournamentName();
        List<Tournament> sameNames = tournamentService.getTournamentsByTournamentName(t_name);

        if (action.equals("creation")) {
            return sameNames.isEmpty();
        }
        // assume the only other action is "modification"
        else {
            Tournament oldTournament = tournamentService.getTournament(newTournament.getId());
            if (oldTournament == null) {
                throw new TournamentNotFoundException(newTournament.getId());
            }

            // if the name didn't change, min = 1
            if (oldTournament.getTournamentName().equals(t_name)) {
                return sameNames.size() == 1;
            }
            // else, if names are diff, min = 0
            else {
                return sameNames.isEmpty();
            }
        }

    }

}
