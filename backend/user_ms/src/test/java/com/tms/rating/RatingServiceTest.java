package com.tms.rating;

import com.tms.exception.RatingAlreadyExistsException;
import com.tms.exception.RatingNotFoundException;
import com.tms.exception.UserNotFoundException;
import com.tms.ratingCalc.RatingCalculator;
import com.tms.ratingCalc.RatingPeriodResults;
import com.tms.user.Role;
import com.tms.user.User;
import com.tms.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepo;

    @Mock
    private UserRepository userRepo;

    private RatingCalculator ratingCalc;

    private RatingService ratingService;

    @BeforeEach
    void setUp() {
        ratingCalc = new RatingCalculator(); // Use the actual implementation
        ratingService = new RatingService(ratingRepo, ratingCalc, userRepo);
    }

    @Test
    void initRating_UserExists_ReturnDefaultRating() {
        User user = new User("user1", Role.PLAYER);

        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);

        when(userRepo.findById(user.getId())).thenReturn(Optional.of(user));
        when(ratingRepo.existsById(user.getId())).thenReturn(false);
        when(ratingRepo.save(any(Rating.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Rating createdRating = ratingService.initRating(user.getId());

        assertTrue(rating.propertiesEqual(createdRating));
        verify(userRepo, times(1)).findById(user.getId());
        verify(ratingRepo, times(1)).existsById(user.getId());
        verify(ratingRepo, times(1)).save(argThat(argRating -> argRating.propertiesEqual(createdRating)));
    }

    @Test
    void initRating_UserDoesNotExist_ThrowsException() {
        User user = new User("user1", Role.PLAYER);

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
        User user = new User("user1", Role.PLAYER);

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

     @Test
     void calcRating_ValidMatch_ReturnsUpdatedRatings() {
         int currentYear = LocalDate.now().getYear();
         LocalDate today = LocalDate.of(currentYear, 10, 24);
         LocalDateTime now = today.atTime(12, 0);

         ResultsDTO match = new ResultsDTO("winnerId", "loserId", now);
         User winner = new User("winnerId", Role.PLAYER);
         User loser = new User("loserId", Role.PLAYER);

         LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
         Rating winnerRating = new Rating(winner, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                 ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
         Rating loserRating = new Rating(loser, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                 ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);

         when(ratingRepo.findById("winnerId")).thenReturn(Optional.of(winnerRating));
         when(ratingRepo.findById("loserId")).thenReturn(Optional.of(loserRating));

         when(ratingRepo.save(any(Rating.class))).thenAnswer(invocation -> invocation.getArgument(0));

         List<Rating> updatedRatings = ratingService.calcRating(match, new RatingPeriodResults());

         assertEquals(2, updatedRatings.size());

         Rating updatedWinnerRating = new Rating(winner, 1663.0585888305718, 291.30440579432036, 0.0599992718190158,
                 1, now);
         Rating updatedLoserRating = new Rating(loser, 1336.9414111694282, 291.30440579432036, 0.0599992718190158,
                 1, now);
         assertTrue(updatedWinnerRating.propertiesEqual(updatedRatings.get(0)));
         assertTrue(updatedLoserRating.propertiesEqual(updatedRatings.get(1)));
     }

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
    }

}