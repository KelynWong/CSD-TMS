package com.tms.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404 Error
public class MatchNotFoundException extends RuntimeException{
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public MatchNotFoundException(Long id) {
        super("Match " + id + " does not exist.");
    }
    
}