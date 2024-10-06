package com.tms.rating;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tms.exceptions.RatingNotFoundException;

@RestController
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @GetMapping("/ratings")
    public List<Rating> getAllRatings() {
        return ratingService.getAllRatings();
    }

    @GetMapping("/ratings/{ratingId}")
    public Rating getRating(@PathVariable String ratingId) {
        return ratingService.getRatingById(ratingId)
                .orElseThrow(() -> new RatingNotFoundException(ratingId));
    }

    @PostMapping("/ratings")
    public Rating addRating(@RequestBody Rating rating) {
        return ratingService.addRating(rating);
    }

    @PutMapping("/ratings/{ratingId}")
    public Rating updateRating(@PathVariable String ratingId, @RequestBody Rating newRating) {
        return ratingService.updateRating(ratingId, newRating);
    }

    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<?> deleteRating(@PathVariable String ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.ok().build();
    }
}