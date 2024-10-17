package com.tms.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404 Error
public class GameNotFoundException extends RuntimeException{

    public GameNotFoundException(Long id) {
        super("Game " + id + " does not exist.");
    }
    
}
