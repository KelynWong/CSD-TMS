package com.tms.exceptions;

public class TournamentExistsException extends RuntimeException {
    public TournamentExistsException(String message) {
        super(message);
    }
}