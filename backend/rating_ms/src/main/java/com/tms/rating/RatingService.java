package com.tms.rating;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.joda.time.DateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.tms.exceptions.RatingNotFoundException;
import com.tms.ratingCalc.RatingCalculator;
import com.tms.ratingCalc.RatingPeriodResults;

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

    public Page<Rating> getTopRatings(Pageable pageable) {
        Pageable sortedByRatingDesc = PageRequest.of(
            pageable.getPageNumber(), 
            pageable.getPageSize(), 
            Sort.by("rating").descending()
        );
        return ratingRepo.findAll(sortedByRatingDesc);
    }

    public Rating initRating(RatingDTO ratingDTO) {
        DateTime firstDayOfYear = DateTime.now().withDayOfYear(1).withTimeAtStartOfDay();
        Rating rating = new Rating(ratingDTO.getId(), ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(), ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        return ratingRepo.save(rating);
    }

    public List<Rating> initRatings(int start, int end) {
        ArrayList<Rating> ratingList = new ArrayList<>();
        for (int i = start; i <= end; i++) {
            ratingList.add(initRating(new RatingDTO("user" + i)));
        }
        return ratingList;
    }

    public Rating addRating(Rating rating) {
        return ratingRepo.save(rating);
    }

    public List<Rating> calcRating(ResultsDTO match) {
        DateTime now = DateTime.now();
        RatingPeriodResults results = new RatingPeriodResults();
        Optional<Rating> winner = ratingRepo.findById(match.getWinnerId());
        Optional<Rating> loser = ratingRepo.findById(match.getLoserId());

        if (!winner.isPresent() || !loser.isPresent()) {
            throw new RatingNotFoundException(match.getWinnerId() + " or " + match.getLoserId());
        }
        
        Rating winnerRating = winner.get();
        Rating loserRating = loser.get(); 

        processRating(winnerRating, match.getTournamentEndDate(), now);
        processRating(loserRating, match.getTournamentEndDate(), now);

        results.addResult(winnerRating, loserRating);
        ratingCalc.updateRatings(results);

        updateRating(winnerRating.getId(), winnerRating);
        updateRating(loserRating.getId(), loserRating);

        return List.of(winnerRating, loserRating);
    }

    private Rating processRating(Rating rating, DateTime currTournamentDate, DateTime currDateTime) {
        double rd = ratingCalc.previewDeviation(rating, currTournamentDate, false);
        if (rd != rating.getRatingDeviation()) {
            rating.setRatingDeviation(rd);
        }
        rating.setLastRatingPeriodEndDate(currDateTime);
        return rating;
    }

    private Rating updateRating(String ratingId, Rating newRating) {
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
