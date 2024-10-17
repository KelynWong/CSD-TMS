package com.tms.exceptions;

public class RatingUpdateException extends RuntimeException {
    public RatingUpdateException(String winnerId, String loserId) {
        super("Something went wrong with updating rating for users " + winnerId + " and " + loserId);
    }
}