package com.tms.player;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class RatingCalculatorTest {

    @InjectMocks
    private RatingCalculator ratingCalculator;

    @Test
    void testCalcWinProb() {
        // given
        double playerRating = 1996;
        double playerDeviation = 189;
        double opponentRating = 1321;
        double opponentDeviation = 280;

        // when
        double winProb = ratingCalculator.calcWinProb(playerRating, playerDeviation, opponentRating, opponentDeviation);
        System.out.println("Win prob: " + winProb);
        // then
    }
}