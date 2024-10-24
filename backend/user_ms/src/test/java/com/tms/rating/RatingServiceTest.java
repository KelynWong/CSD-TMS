package com.tms.rating;

import com.tms.exception.RatingAlreadyExistsException;
import com.tms.exception.RatingNotFoundException;
import com.tms.exception.UserNotFoundException;
import com.tms.ratingCalc.RatingCalculator;
import com.tms.ratingCalc.RatingPeriodResults;
import com.tms.user.User;
import com.tms.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepo;

    @Mock
    private UserRepository userRepo;

    @Mock
    private RatingCalculator ratingCalc;

    @InjectMocks
    private RatingService ratingService;

    @Test
    void initRating_UserExists_ReturnDefaultRating() {
        User user = new User("user1");

        when(ratingCalc.getDefaultRating()).thenReturn(1500.0);
        when(ratingCalc.getDefaultRatingDeviation()).thenReturn(350.0);
        when(ratingCalc.getDefaultVolatility()).thenReturn(0.06);

        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);

        when(userRepo.findById(user.getId())).thenReturn(Optional.of(user));
        when(ratingRepo.save(any(Rating.class))).thenReturn(rating);

        Rating createdRating = ratingService.initRating(user.getId());

        assertEquals(rating, createdRating);
        verify(userRepo, times(1)).findById(user.getId());
        verify(ratingRepo, times(1)).save(rating);
        verify(ratingCalc, times(2)).getDefaultRating();
        verify(ratingCalc, times(2)).getDefaultRatingDeviation();
        verify(ratingCalc, times(2)).getDefaultVolatility();
    }

    @Test
    void initRating_UserDoesNotExist_ThrowsException() {
        User user = new User("user1");

        when(ratingCalc.getDefaultRating()).thenReturn(1500.0);
        when(ratingCalc.getDefaultRatingDeviation()).thenReturn(350.0);
        when(ratingCalc.getDefaultVolatility()).thenReturn(0.06);

        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);

        when(userRepo.findById(user.getId())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            ratingService.initRating(user.getId());
        });

        verify(userRepo, times(1)).findById(user.getId());
        verify(ratingRepo, never()).save(rating);
    }

    @Test
    void initRating_RatingAlreadyInit_ThrowsException() {
        User user = new User("user1");

        when(ratingCalc.getDefaultRating()).thenReturn(1500.0);
        when(ratingCalc.getDefaultRatingDeviation()).thenReturn(350.0);
        when(ratingCalc.getDefaultVolatility()).thenReturn(0.06);

        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);

        when(userRepo.findById(user.getId())).thenReturn(Optional.of(user));
        when(ratingRepo.existsById(user.getId())).thenReturn(true);

        assertThrows(RatingAlreadyExistsException.class, () -> {
            ratingService.initRating(user.getId());
        });

        verify(userRepo, times(1)).findById(user.getId());
        verify(ratingRepo, never()).save(rating);
    }

    @Test
    void initRatings_ValidRange_ReturnsRatings() {
        int start = 1;
        int end = 3;

        for (int i = start; i <= end; i++) {
            User user = new User("user1");
            when(userRepo.findById("user" + i)).thenReturn(Optional.of(user));
        }
        when(ratingRepo.save(any(Rating.class))).thenReturn(new Rating());

        List<Rating> ratings = ratingService.initRatings(start, end);

        assertEquals(end - start + 1, ratings.size());
        verify(userRepo, times(end)).findById(any(String.class));
        verify(ratingRepo, times(end)).save(any(Rating.class));
    }

    @ParameterizedTest
    @CsvSource({
            "3, 1",    // start > end
            "-1, 3",   // start is negative
            "1, -3",   // end is negative
            "-1, -3",  // both are negative
            "a, 3",    // start is non-integer
            "1, b"     // end is non-integer
    })
    void initRatings_InvalidRange_ReturnsRatings() {
        int start = 3;
        int end = 1;

        List<Rating> ratings = ratingService.initRatings(start, end);

        assertEquals(0, ratings.size());
        verify(userRepo, never()).findById(any(String.class));
        verify(ratingRepo, never()).save(any(Rating.class));
    }

    @Test
    void deleteRating_RatingExists_DeletesRating() {
        String userId = "user1";
        Rating rating = new Rating();
        when(ratingRepo.findById(userId)).thenReturn(Optional.of(rating));

        ratingService.deleteRating(userId);

        verify(ratingRepo, times(1)).findById(userId);
        verify(ratingRepo, times(1)).delete(rating);
    }

    @Test
    void deleteRating_RatingDoesNotExist_DoesNothing() {
        String userId = "user1";
        when(ratingRepo.findById(userId)).thenReturn(Optional.empty());

        ratingService.deleteRating(userId);

        verify(ratingRepo, times(1)).findById(userId);
        verify(ratingRepo, never()).delete(any(Rating.class));
    }

    // todo: fix this test
    // @Test
    // void calcRating_ValidMatch_ReturnsUpdatedRatings() {
    //     LocalDate today = LocalDate.now();
    //     LocalDateTime now = today.atStartOfDay();

    //     ResultsDTO match = new ResultsDTO("winnerId", "loserId", now);
    //     User winner = new User("winnerId");
    //     User loser = new User("loserId");
    //     Rating winnerRating = new Rating(winner, 1500.0, 350.0, 0.06, 0,
    //             LocalDate.now().withDayOfYear(1).atStartOfDay());
    //     Rating loserRating = new Rating(loser, 1500.0, 350.0, 0.06, 0, LocalDate.now().withDayOfYear(1).atStartOfDay());

    //     when(ratingRepo.findById("winnerId")).thenReturn(Optional.of(winnerRating));
    //     when(ratingRepo.findById("loserId")).thenReturn(Optional.of(loserRating));

    //     List<Rating> updatedRatings = ratingService.calcRating(match, new RatingPeriodResults());

    //     assertEquals(2, updatedRatings.size());
    //     verify(ratingRepo, times(1)).findById("winnerId");
    //     verify(ratingRepo, times(1)).findById("loserId");
    //     verify(ratingCalc, times(1)).updateRatings(any(RatingPeriodResults.class));
    //     verify(ratingRepo, times(1)).save(winnerRating);
    //     verify(ratingRepo, times(1)).save(loserRating);
    // }

    @Test
    void calcRating_RatingNotFound_ThrowsException() {
        ResultsDTO match = new ResultsDTO("winnerId", "loserId", LocalDateTime.now());

        when(ratingRepo.findById("winnerId")).thenReturn(Optional.empty());
        when(ratingRepo.findById("loserId")).thenReturn(Optional.empty());

        assertThrows(RatingNotFoundException.class, () -> {
            ratingService.calcRating(match, new RatingPeriodResults());
        });

        verify(ratingRepo, times(1)).findById("winnerId");
        verify(ratingRepo, times(1)).findById("loserId");
        verify(ratingCalc, never()).updateRatings(any(RatingPeriodResults.class));
    }

}