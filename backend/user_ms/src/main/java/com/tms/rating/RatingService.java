package com.tms.rating;

import com.tms.exception.RatingAlreadyExistsException;
import com.tms.exception.RatingNotFoundException;
import com.tms.exception.UserNotFoundException;
import com.tms.ratingCalc.RatingCalculator;
import com.tms.ratingCalc.RatingPeriodResults;
import com.tms.user.User;
import com.tms.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Transactional
    public List<Rating> calcRating(ResultsDTO match, RatingPeriodResults results) {
        LocalDate today = LocalDate.now();
        LocalDateTime now = today.atTime(12, 0);

        Optional<Rating> winner = ratingRepo.findById(match.getWinnerId());
        Optional<Rating> loser = ratingRepo.findById(match.getLoserId());

        if (winner.isEmpty() || loser.isEmpty()) {
            throw new RatingNotFoundException(match.getWinnerId() + " or " + match.getLoserId());
        }

        Rating winnerRating = winner.get();
        Rating loserRating = loser.get();

        Rating newWinnerRating = updateRatingSd(winnerRating, match.getTournamentEndDate());
        Rating newLoserRating = updateRatingSd(loserRating, match.getTournamentEndDate());

        results.addResult(newWinnerRating, newLoserRating);
        ratingCalc.updateRatings(results);

        newWinnerRating = updateRatingLastUpdatedTime(newWinnerRating, now);
        newLoserRating = updateRatingLastUpdatedTime(newLoserRating, now);

        updateRatingInDb(newWinnerRating);
        updateRatingInDb(newLoserRating);

        return List.of(newWinnerRating, newLoserRating);
    }

    private Rating updateRatingSd(Rating rating, LocalDateTime currTournamentDate) {
        Rating newRating = rating.clone();
        double rd = ratingCalc.previewDeviation(newRating, currTournamentDate, false);
        newRating.setRatingDeviation(rd);
        return newRating;
    }

    private Rating updateRatingLastUpdatedTime(Rating rating, LocalDateTime ratingLastUpdatedTime) {
        Rating newRating = rating.clone();
        newRating.setLastRatingPeriodEndDate(ratingLastUpdatedTime);
        return newRating;
    }

    private void updateRatingInDb(Rating newRating) {
        String ratingId = newRating.getId();

        Rating rating = ratingRepo.findById(ratingId).orElseThrow(
                () -> new RatingNotFoundException(ratingId)
        );

        rating.setRating(newRating.getRating());
        rating.setRatingDeviation(newRating.getRatingDeviation());
        rating.setVolatility(newRating.getVolatility());
        rating.setNumberOfResults(newRating.getNumberOfResults());
        rating.setLastRatingPeriodEndDate(newRating.getLastRatingPeriodEndDate());
        ratingRepo.save(rating);
    }

    public void deleteRating(String ratingId) {
        ratingRepo.findById(ratingId).ifPresent(ratingRepo::delete);
    }
}
