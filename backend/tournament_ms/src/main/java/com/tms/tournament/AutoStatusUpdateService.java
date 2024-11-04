package com.tms.tournament;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

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

        /*             regS             regE     Makemake       tourS            tourE
         *              |----------------|----------|-------------|----------------|
         * Scheduled   ->   RegStart     ->  RegEnd -> Matchmake  ->  Ongoing      ->  Completed
         */

        // Get current datetime
        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();

        log.info("[AutoUpdate] Current datetime: " + localNow);

        // REGISTRATION_START : within registration period
        if (isWithin(localNow, tournament.getRegStartDT(), tournament.getRegEndDT())) {
            log.info("[AutoUpdate] CHANGE TO REG_START");
            tournament.setStatus(TournamentStatus.REGISTRATION_START);
        }

        // REGISTRATION_CLOSE : after Registration End and Before matchmake is done
        else if (tournament.getStatus() != TournamentStatus.MATCHMAKE && isWithin(localNow, tournament.getRegEndDT(), tournament.getStartDT())) {
            log.info("[AutoUpdate] CHANGE TO REG_CLOSE");
            tournament.setStatus(TournamentStatus.REGISTRATION_CLOSE);
        }

        // ONGOING : within tournament period
        else if (tournament.getStatus() != TournamentStatus.COMPLETED &&  isWithin(localNow, tournament.getStartDT(), tournament.getEndDT())) {
            log.info("[AutoUpdate] CHANGE TO ONGOING");
            tournament.setStatus(TournamentStatus.ONGOING);
        }

        // SCHEDULED : before registration start
        else if (localNow.isBefore(tournament.getRegStartDT())) {
            log.info("[AutoUpdate] CHANGE TO SCHEDULED");
            tournament.setStatus(TournamentStatus.SCHEDULED);
        }

        // Save updates in db
        tournaments.save(tournament);

    }

    // Purpose : Update all tournaments in a list
    public void autoUpdateTournaments(List<Tournament> t_list) {
        // For every tournament, Check and Update tournament Status based on regDTs
        for (Tournament t : t_list) {
            autoUpdateTournament(t);
        }
    }

    // Purpose : Check if datetime given falls within range
    public boolean isWithin(LocalDateTime dt, LocalDateTime startRange, LocalDateTime endRange) {

        return !dt.isBefore(startRange) && !dt.isAfter(endRange);

    }

}
