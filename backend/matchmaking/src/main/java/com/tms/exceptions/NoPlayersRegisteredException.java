package com.tms.exceptions;

public class NoPlayersRegisteredException extends RuntimeException {
    public NoPlayersRegisteredException(String message) {
        super(message);
    }
    
}
