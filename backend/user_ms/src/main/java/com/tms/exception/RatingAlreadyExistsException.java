package com.tms.exception;

public class RatingAlreadyExistsException extends RuntimeException {
    public RatingAlreadyExistsException(String userId) {
        super("Rating already initialised for userId " + userId);
    }
}
