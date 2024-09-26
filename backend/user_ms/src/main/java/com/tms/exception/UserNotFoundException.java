package com.tms.exception;

public class UserNotFoundException extends SupabaseClientException {
    public UserNotFoundException(String message) {
        super(message);
    }
}