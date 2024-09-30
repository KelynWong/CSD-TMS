package com.tms.exceptions;

public class TournamentExistsException extends RuntimeException {
    public TournamentExistsException(Long id) {
        super("Matches for tournament " + id + " already created.");
    }
}