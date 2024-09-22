package com.tms.tournamentplayer;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404 Error
public class PlayerNotFoundException extends RuntimeException{
    private static final long serialVersionUID = 1L;

    public PlayerNotFoundException(Long tournamentId, Long playerId) {
        super("Could not find Tournament Player " + playerId + " from Tournament " + tournamentId);
    }
    
}
