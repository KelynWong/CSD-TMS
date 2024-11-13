package com.tms.tournament;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonValue;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum TournamentStatus {

    // Values
    SCHEDULED("Scheduled"),
    REGISTRATION_START("Registration Start"),
    MATCHMAKE("Matchmake"),
    REGISTRATION_CLOSE("Registration Close"),
    ONGOING("Ongoing"),
    COMPLETED("Completed");

    // Corresponding strings
    public final String statusStr;

    // Constructor
    private TournamentStatus(String statusStr) {
        this.statusStr = statusStr;
    }

    // Lookup : TournamentStatus -get-> corresponding str
    @JsonValue // Use corresponding str value in JSON format
    public String getStatustStr() {
        return statusStr;
    }

    // Reverse lookup : str -get-> corresponding TournamentStatus 
    public static TournamentStatus get(String statusStr) {
        // loop thr all possible tournamentStatus values
        for (TournamentStatus ts : TournamentStatus.values()) {
            // if tournamentStatus's str matches given str
            if (ts.getStatustStr().equals(statusStr)) {
                // return corresponding tournamentStatus
                return ts;
            }
        }
        // if cannot find TournamentStatus, return null;
        return null;
    }

    // Purpose : Check if str is a valid corresponding str value
    public static boolean isValid(String statusStr) {
        // loop thr all possible tournamentStatus values
        for (TournamentStatus ts : TournamentStatus.values()) {
            // if tournamentStatus's str matches given str
            if (ts.getStatustStr().equals(statusStr)) {
                // return true;
                return true;
            }
        }
        // if cannot find tournamentStatus, return false;
        return false;
    }

    // Purpose : Check if tournamentStatus is a valid status value
    public static boolean isValid(TournamentStatus tStatus) {
        // if found the tournamentStatus in the enum, return true, else false
        return Arrays.stream(TournamentStatus.values()).anyMatch(tStatus::equals);
    
    }

}
