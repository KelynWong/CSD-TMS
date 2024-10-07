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

    @GetMapping("/ratings/{userId}")
    public Rating getRating(@PathVariable String userId) {
        return ratingService.getRatingById(userId)
                .orElseThrow(() -> new RatingNotFoundException(userId));
    }

    @PostMapping("/ratings/init")
    public Rating initRating(@RequestBody RatingDTO rating) {
        return ratingService.initRating(rating);
    }

    @PostMapping("/ratings")
    public Rating addRating(@RequestBody Rating rating) {
        return ratingService.addRating(rating);
    }

    @PutMapping("/ratings/{userId}")
    public Rating updateRating(@PathVariable String userId, @RequestBody Rating newRating) {
        return ratingService.updateRating(userId, newRating);
    }

    @DeleteMapping("/ratings/{userId}")
    public ResponseEntity<?> deleteRating(@PathVariable String userId) {
        ratingService.deleteRating(userId);
        return ResponseEntity.ok().build();
    }
}