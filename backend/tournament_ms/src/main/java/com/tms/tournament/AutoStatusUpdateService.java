package com.tms.tournament;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tms.exception.TournamentNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AutoStatusUpdateService {

    private TournamentRepository tournaments;

    public AutoStatusUpdateService(TournamentRepository tr) {
        // bind tournament Repo
        this.tournaments = tr;
    }

    // Purpose : Auto update status
    public void autoUpdateTournament(Tournament tournament) {

        // Check if tournament exist or not
        if (!tournaments.existsById(tournament.getId())) {
            throw new TournamentNotFoundException(tournament.getId());
        }

        /*
         *regS                        regE     Makemake        tourS           tourE
         * |---------------------------|----------|-------------|----------------|
         * Scheduled -> RegStart -> RegEnd -> Matchmake ---> Ongoing ---> Completed
         */

        // Get current datetime
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();

        log.info("[AutoUpdate] Current datetime: " + localNow);

        // if tournament is completed, don't update anything
        if (tournament.getStatus() == TournamentStatus.COMPLETED) {
            return;
        }

        /* Here: Tournament is not completed */
        // SCHEDULED : before registration start
        else if (tournament.getStatus() != TournamentStatus.SCHEDULED && localNow.isBefore(tournament.getRegStartDT())) {
            log.info("[AutoUpdate] CHANGE TO SCHEDULED");
            tournament.setStatus(TournamentStatus.SCHEDULED);
        }

        // REGISTRATION_START : within registration period
        else if (tournament.getStatus() != TournamentStatus.REGISTRATION_START && isWithin(localNow, tournament.getRegStartDT(), tournament.getRegEndDT())) {
            log.info("[AutoUpdate] CHANGE TO REG_START");
            tournament.setStatus(TournamentStatus.REGISTRATION_START);
        }

        // REGISTRATION_CLOSE :  Before matchmake is done and after Registration End
        else if ((tournament.getStatus() != TournamentStatus.REGISTRATION_CLOSE && tournament.getStatus() != TournamentStatus.MATCHMAKE)
                && isWithin(localNow, tournament.getRegEndDT(), tournament.getStartDT())) {
            log.info("[AutoUpdate] CHANGE TO REG_CLOSE");
            tournament.setStatus(TournamentStatus.REGISTRATION_CLOSE);
        }

        // ONGOING : within tournament period
        else if (tournament.getStatus() != TournamentStatus.ONGOING && isWithin(localNow, tournament.getStartDT(), tournament.getEndDT())) {
            log.info("[AutoUpdate] CHANGE TO ONGOING");
            tournament.setStatus(TournamentStatus.ONGOING);
        }
        // if nothing changed
        else {
            return;
        }
        
        // Save updates in db
        tournaments.save(tournament);

    }

    // Purpose : Update all tournaments in a list
    public void autoUpdateTournaments(List<Tournament> t_list) {

        // if tournament list is null, throw NullPointerException
        if (t_list == null) {
            throw new NullPointerException("Tournament list given is null!");
        }

        // For every tournament, Check and Update tournament Status based on regDTs
        for (Tournament t : t_list) {
            autoUpdateTournament(t);
        }
    }

    // Purpose : Check if datetime given falls within range
    private boolean isWithin(LocalDateTime dt, LocalDateTime startRange, LocalDateTime endRange) {

        // Range (dt >= startRange AND dt < endRange)
        return !dt.isBefore(startRange) && dt.isBefore(endRange);

    }

}
