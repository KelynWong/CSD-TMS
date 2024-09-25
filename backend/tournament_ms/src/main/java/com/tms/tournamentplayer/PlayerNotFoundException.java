package com.tms.tournamentplayer;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404 Error
public class PlayerNotFoundException extends RuntimeException{
    private static final long serialVersionUID = 1L;

    public PlayerNotFoundException(Long playerId, Long tournamentId) {
        super("Could not find Player " + playerId + " from tournament " + tournamentId);
    }

    public PlayerNotFoundException(Long playerId) {
        super("Could not find Player " + playerId);
    }
    
}
