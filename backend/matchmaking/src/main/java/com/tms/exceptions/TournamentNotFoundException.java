package com.tms.exceptions;

public class TournamentNotFoundException extends RuntimeException {
    public TournamentNotFoundException(Long id) {
       super("Tournament " + id + " does not exist in tournament database.");
    }

    public TournamentNotFoundException(Long id, boolean isMatch) {
        super("No matches for tournament " + id + " found. Run the match creation service to create matches for this tournament.");
    }
}