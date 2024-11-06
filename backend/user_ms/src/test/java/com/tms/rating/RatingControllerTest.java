package com.tms.rating;

import com.tms.UserServiceApplication;
import com.tms.ratingCalc.RatingCalculator;
import com.tms.user.Role;
import com.tms.user.User;
import com.tms.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(classes= UserServiceApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RatingControllerTest {
    @LocalServerPort
    private int port;

    private final String baseUrl = "http://localhost:";

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private RatingRepository ratingRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RatingCalculator ratingCalc;

    @BeforeEach
    void clear() {
        userRepo.deleteAll();
        ratingRepo.deleteAll();
    }

    @Test
    public void updateRating_Success() throws Exception {
        // Create initial data
        int currentYear = LocalDate.now().getYear();
        LocalDate today = LocalDate.of(currentYear, 10, 24);
        LocalDateTime now = today.atTime(12, 0);

        User winner = new User("winnerId", Role.PLAYER);
        User loser = new User("loserId", Role.PLAYER);

        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating winnerRating = new Rating(winner, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        Rating loserRating = new Rating(loser, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);

        ratingRepo.save(winnerRating);
        ratingRepo.save(loserRating);

        // Prepare the request
        ResultsDTO match = new ResultsDTO("winnerId", "loserId", now);

        URI uri = new URI(baseUrl + port + "/users/ratings");

        // Perform the PUT request
        ResponseEntity<Rating[]> response = restTemplate.exchange(
                uri, HttpMethod.PUT, new HttpEntity<>(match), Rating[].class);

        // Verify the response
        assertEquals(200, response.getStatusCode().value());
        List<Rating> updatedRatings = List.of(response.getBody());

        // Add assertions to verify the updated ratings
        assertEquals(2, updatedRatings.size());

        Rating updatedWinnerRating = new Rating(winner, 1663.0585888305718, 291.30440579432036, 0.0599992718190158,
                1, now);
        Rating updatedLoserRating = new Rating(loser, 1336.9414111694282, 291.30440579432036, 0.0599992718190158,
                1, now);

        assertTrue(updatedWinnerRating.propertiesEqual(updatedRatings.get(0)));
        assertTrue(updatedLoserRating.propertiesEqual(updatedRatings.get(1)));
    }
}