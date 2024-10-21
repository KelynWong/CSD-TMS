package com.tms.rating;

import com.tms.exception.RatingAlreadyExistsException;
import com.tms.exception.RatingNotFoundException;
import com.tms.exception.UserNotFoundException;
import com.tms.ratingCalc.RatingCalculator;
import com.tms.ratingCalc.RatingPeriodResults;
import com.tms.user.User;
import com.tms.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    private final RatingRepository ratingRepo;
    private final RatingCalculator ratingCalc;
    private final UserRepository userRepo;

    public RatingService(RatingRepository ratingRepo, RatingCalculator ratingCalc, UserRepository userRepository) {
        this.ratingRepo = ratingRepo;
        this.ratingCalc = ratingCalc;
        this.userRepo = userRepository;
    }

    public Rating initRating(String userId) {
        Optional<User> user = userRepo.findById(userId);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found for userId " + userId);
        }

        if (ratingRepo.existsById(userId)) {
            throw new RatingAlreadyExistsException(userId);
        }

        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user.get(), ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        return ratingRepo.save(rating);
    }

    public List<Rating> initRatings(int start, int end) {
        ArrayList<Rating> ratingList = new ArrayList<>();
        for (int i = start; i <= end; i++) {
            ratingList.add(initRating("user" + i));
        }
        return ratingList;
    }

    public List<Rating> calcRating(ResultsDTO match) {
        LocalDateTime now = LocalDateTime.now();
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

    private Rating processRating(Rating rating, LocalDateTime currTournamentDate, LocalDateTime currDateTime) {
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
