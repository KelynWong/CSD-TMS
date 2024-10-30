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

        ZonedDateTime zonedNow = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        LocalDateTime localNow = zonedNow.toLocalDateTime();

        log.info("[Auto - updateTournament] Current datetime: " + localNow);

        if (isWithin(localNow, tournament.getRegStartDT(), tournament.getRegEndDT())) {
            log.info("[Auto - updateTournament] CHANGE TO REG_START");
            tournament.setStatus(TournamentStatus.REGISTRATION_START);
        }

        else if (localNow.isAfter(tournament.getRegEndDT())) {
            log.info("[Auto - updateTournament] CHANGE TO REG_CLOSE");
            tournament.setStatus(TournamentStatus.REGISTRATION_CLOSE);
        }

        else if (localNow.isBefore(tournament.getRegStartDT())) {
            log.info("[Auto - updateTournament] CHANGE TO SCHEDULED");
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
