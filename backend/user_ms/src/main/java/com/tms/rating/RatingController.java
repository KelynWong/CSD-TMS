package com.tms.rating;

import com.tms.ratingCalc.RatingPeriodResults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/initBatch/{start}/{end}/ratings")
    public List<Rating> initRatings(@PathVariable int start, @PathVariable int end) {
        return ratingService.initRatings(start, end);
    }

    @PutMapping("/ratings")
    public List<Rating> updateRating(@RequestBody ResultsDTO match) {
        return ratingService.calcRating(match, new RatingPeriodResults());
    }
}