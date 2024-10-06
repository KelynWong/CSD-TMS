package com.tms.rating;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tms.exceptions.RatingNotFoundException;

@Service
public class RatingService {

    private final RatingRepository ratingRepo;

    public RatingService(RatingRepository ratingRepo) {
        this.ratingRepo = ratingRepo;
    }

    public List<Rating> getAllRatings() {
        return ratingRepo.findAll();
    }

    public Optional<Rating> getRatingById(String ratingId) {
        return ratingRepo.findById(ratingId);
    }

    public Rating addRating(Rating rating) {
        return ratingRepo.save(rating);
    }

    public Rating updateRating(String ratingId, Rating newRating) {
        return ratingRepo.findById(ratingId).map(rating -> {
            rating.setRating(newRating.getRating());
            rating.setRatingDeviation(newRating.getRatingDeviation());
            rating.setVolatility(newRating.getVolatility());
            rating.setNumberOfResults(newRating.getNumberOfResults());
            rating.setLastRatingPeriodEndDate(newRating.getLastRatingPeriodEndDate());
            return ratingRepo.save(rating);
        }).orElseThrow(() -> new RatingNotFoundException(ratingId));
    }

    public void deleteRating(String ratingId) {
        ratingRepo.findById(ratingId).ifPresent(ratingRepo::delete);
    }
}
