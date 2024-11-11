package com.tms.exceptions;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

/**
 * Centralize exception handling in this class.
 */
@ControllerAdvice
public class RestExceptionHandler{

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception ex) {
        ex.printStackTrace();
        Map<String, Object> body = new HashMap<>();
        body.put("error", "An error occurred. Please try again later.");
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
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

    @ExceptionHandler(TournamentNotFoundException.class)
    public ResponseEntity<Object> handleTournamentNotFound(TournamentNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TournamentFoundNoMatchException.class)
    public ResponseEntity<Object> handleTournamentFoundNoMatch(TournamentFoundNoMatchException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TournamentExistsException.class)
    public ResponseEntity<Object> handleTournamentExists(TournamentExistsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PlayerNotFoundException.class)
    public ResponseEntity<Object> handlePlayerNotFound(PlayerNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MatchCreationException.class)
    public ResponseEntity<Object> handleMatchCreation(MatchCreationException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NoPlayersRegisteredException.class)
    public ResponseEntity<Object> handleNoPlayersRegistered(NoPlayersRegisteredException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RatingUpdateException.class)
    public ResponseEntity<Object> handleRatingUpdateException(RatingUpdateException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(TournamentWinnerUpdateException.class)
    public ResponseEntity<Object> handleTournamentWinnerUpdateException(TournamentWinnerUpdateException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<Object> handleHttpClientErrorException(HttpClientErrorException ex) {
        Map<String, Object> body = new HashMap<>();
        String errorMessage = ex.getResponseBodyAsString();

        // Extract the error message from the JSON response
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> errorMap = objectMapper.readValue(errorMessage, new TypeReference<Map<String, String>>() {});
            body.put("error", errorMap.get("error"));
        } catch (JsonProcessingException e) {
            body.put("error", "An error occurred while processing the error message.");
        }

        return new ResponseEntity<>(body, ex.getStatusCode());
    }

}