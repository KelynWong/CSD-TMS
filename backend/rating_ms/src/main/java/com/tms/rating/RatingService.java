package com.tms.rating;

import java.util.List;
import java.util.Optional;

import org.joda.time.DateTime;
import org.springframework.stereotype.Service;

import com.tms.exceptions.RatingNotFoundException;
import com.tms.ratingCalc.RatingCalculator;

@Service
public class RatingService {

    private final RatingRepository ratingRepo;
    private final RatingCalculator ratingCalc;

    public RatingService(RatingRepository ratingRepo, RatingCalculator ratingCalc) {
        this.ratingRepo = ratingRepo;
        this.ratingCalc = ratingCalc;
    }

    public List<Rating> getAllRatings() {
        return ratingRepo.findAll();
    }

    public Optional<Rating> getRatingById(String ratingId) {
        return ratingRepo.findById(ratingId);
    }

    public Rating initRating(RatingDTO ratingDTO) {
        DateTime firstDayOfYear = DateTime.now().withDayOfYear(1).withTimeAtStartOfDay();
        Rating rating = new Rating(ratingDTO.getId(), ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(), ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        return ratingRepo.save(rating);
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
