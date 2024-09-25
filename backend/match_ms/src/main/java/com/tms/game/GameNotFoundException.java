package com.tms.game;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404 Error
public class GameNotFoundException extends RuntimeException{
    private static final long serialVersionUID = 1L;

    public GameNotFoundException(Long id) {
        super("Could not find game " + id);
    }
    
}
