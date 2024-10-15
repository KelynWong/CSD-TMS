package com.tms.exceptions;

public class RatingNotFoundException extends RuntimeException {
    public RatingNotFoundException(String userId) {
        super("No rating exists for userId " + userId);
    }
}
