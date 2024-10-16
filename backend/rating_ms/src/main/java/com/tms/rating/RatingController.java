package com.tms.rating;

import java.util.List;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tms.exceptions.RatingNotFoundException;

@RestController
@RequestMapping("/ratings")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Service is healthy");
    }

    @GetMapping
    public List<Rating> getAllRatings() {
        return ratingService.getAllRatings();
    }

    @GetMapping("/{userId}")
    public Rating getRating(@PathVariable String userId) {
        return ratingService.getRatingById(userId)
                .orElseThrow(() -> new RatingNotFoundException(userId));
    }

    @GetMapping("/top")
    public Page<Rating> getTopRatings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ratingService.getTopRatings(pageable);
    }

    @PostMapping("/by-ids")
    public List<Rating> getRatingsByIds(@RequestBody List<String> ratingIds) {
        return ratingService.getRatingsByIds(ratingIds);
    }

    @PostMapping("/init")
    public Rating initRating(@RequestBody RatingDTO rating) {
        return ratingService.initRating(rating);
    }

    @PostMapping("/initBatch/{start}/{end}")
    public List<Rating> initRatings(@PathVariable int start, @PathVariable int end) {
        return ratingService.initRatings(start, end);
    }

    // @PostMapping("/ratings")
    // public Rating addRating(@RequestBody Rating rating) {
    //     return ratingService.addRating(rating);
    // }

    @PutMapping
    public List<Rating> updateRating(@RequestBody ResultsDTO match) {
        return ratingService.calcRating(match);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteRating(@PathVariable String userId) {
        ratingService.deleteRating(userId);
        return ResponseEntity.ok().build();
    }
}