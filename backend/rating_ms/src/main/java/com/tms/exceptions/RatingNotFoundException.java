package com.tms.exceptions;

public class RatingNotFoundException extends RuntimeException {
    public RatingNotFoundException(String ratingId) {
        super("Rating not found with ID: " + ratingId);
    }
}
