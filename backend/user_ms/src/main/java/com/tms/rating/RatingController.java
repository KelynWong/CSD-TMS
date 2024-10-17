package com.tms.rating;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }


    @GetMapping("/top-ratings")
    public Page<Rating> getTopRatings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ratingService.getTopRatings(pageable);
    }

    @PostMapping("/initBatch/{start}/{end}/ratings")
    public List<Rating> initRatings(@PathVariable int start, @PathVariable int end) {
        return ratingService.initRatings(start, end);
    }

    @PutMapping("/ratings")
    public List<Rating> updateRating(@RequestBody ResultsDTO match) {
        return ratingService.calcRating(match);
    }
}