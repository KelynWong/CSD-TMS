package com.tms.exceptions;

public class TournamentWinnerUpdateException extends RuntimeException {
    public TournamentWinnerUpdateException(Long id, String userId) {
        super("Tournament " + id + " winner could not be updated to " + userId);
    }
}
