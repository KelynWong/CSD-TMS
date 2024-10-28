package com.tms.rating;

import com.tms.ratingCalc.RatingPeriodResults;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PutMapping("/ratings")
    public List<Rating> updateRating(@RequestBody ResultsDTO match) {
        return ratingService.calcRating(match, new RatingPeriodResults());
    }
}