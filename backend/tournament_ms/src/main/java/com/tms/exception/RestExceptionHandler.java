package com.tms.exception;

import java.util.*;

import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
public class RestExceptionHandler {
    /**
     * Construct a new ResponseEntity to customize the Http error messages
     * This method handles the case in which validation failed for
     * controller method's arguments.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
    /**
     * Handle the case in which arguments for controller's methods did not match the type.
     * E.g., bookId passed in is not a number
     */
    
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /* CUSTOM EXCEPTIONS */

    @ExceptionHandler(PlayerNotFoundException.class)
    public ResponseEntity<Object> handleTypeMismatch(PlayerNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TournamentExistsException.class)
    public ResponseEntity<Object> handleTypeMismatch(TournamentExistsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(TournamentNotFoundException.class)
    public ResponseEntity<Object> handleTypeMismatch(TournamentNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TournamentInvalidInputException.class)
    public ResponseEntity<Object> handleTypeMismatch(TournamentInvalidInputException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidTournamentStatusException.class)
    public ResponseEntity<Object> handleTypeMismatch(InvalidTournamentStatusException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<Object> handleTypeMismatch(InvalidDataAccessApiUsageException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }


}