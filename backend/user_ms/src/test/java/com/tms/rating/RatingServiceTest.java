package com.tms.rating;

import com.tms.ratingCalc.RatingCalculator;
import com.tms.user.User;
import com.tms.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
    void addUser_NewUser_ReturnDefaultRating() {
        User user = new User(
                "user1",
                "user1",
                "New User",
                "Male",
                "newuser@example.com",
                "Player",
                "Singapore",
                null,
                null
        );

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

}