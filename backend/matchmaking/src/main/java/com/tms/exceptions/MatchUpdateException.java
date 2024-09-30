package com.tms.exceptions;

public class MatchUpdateException extends RuntimeException {
    public MatchUpdateException(Long id) {
        super("Something went wrong with updating match " + id);
    }
    
}
