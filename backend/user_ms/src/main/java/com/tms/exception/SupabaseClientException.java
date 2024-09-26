package com.tms.exception;

public class SupabaseClientException extends RuntimeException {
    public SupabaseClientException(String message) {
        super(message);
    }

    public SupabaseClientException(String message, Throwable cause) {
        super(message, cause);
    }
}

