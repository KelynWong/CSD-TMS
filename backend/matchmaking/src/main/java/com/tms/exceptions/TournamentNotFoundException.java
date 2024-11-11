package com.tms.exceptions;

public class TournamentNotFoundException extends RuntimeException {
    public TournamentNotFoundException(Long id) {
       super("Tournament " + id + " does not exist in tournament database.");
    }


}