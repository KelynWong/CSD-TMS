package com.tms.tournament;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonValue;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum TournamentStatus {

    SCHEDULED("Scheduled"),
    REGISTRATION_START("Registration Start"),
    REGISTRATION_CLOSE("Registration Close"),
    ONGOING("Ongoing"),
    COMPLETED("Completed");

    public final String statusStr;

    private TournamentStatus(String statusStr) {
        this.statusStr = statusStr;
    }

    @JsonValue  
    public String getStatustStr() {
        return statusStr;
    }

    // ****** Reverse Lookup ************//
    public static TournamentStatus get(String statusStr) {

        for (TournamentStatus ts : TournamentStatus.values()) {
            if (ts.getStatustStr().equals(statusStr)) {
                return ts;
            }
        }

        return null;
    }

    public static boolean isValid(String statusStr) {
        
        for (TournamentStatus ts : TournamentStatus.values()) {
            log.info("mylog: " + statusStr);
            log.info("mylog2: " + ts.getStatustStr());
            if (ts.getStatustStr().equals(statusStr)) {
                return true;
            }
        }

        return false;
    }

    public static boolean isValid(TournamentStatus tStatus) {

        return Arrays.stream(TournamentStatus.values()).anyMatch(tStatus::equals);
    
    }

}
