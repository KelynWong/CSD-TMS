package com.tms.exception;

public class RatingNotFoundException extends RuntimeException {
    public RatingNotFoundException(String userId) {
        super("No rating exists for userId " + userId);
    }
}
