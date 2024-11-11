package com.tms.exceptions;

public class TournamentFoundNoMatchException extends RuntimeException {

    public TournamentFoundNoMatchException(Long id) {
        super("No matches for tournament " + id + " found. Run the match creation service to create matches for this tournament.");
    }
}
