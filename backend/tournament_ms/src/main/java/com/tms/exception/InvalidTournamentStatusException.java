package com.tms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // 404 Error
public class InvalidTournamentStatusException extends RuntimeException{

    private static final long serialVersionUID = 1L;

    public InvalidTournamentStatusException(String status) {
        super("Tournament status '" + status + "' is invalid!");
    }
}
