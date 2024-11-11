/*
 * Copyright (C) 2013 Jeremy Gooch <http://www.linkedin.com/in/jeremygooch/>
 *
 * The licence covering the contents of this file is described in the file LICENCE.txt,
 * which should have been included as part of the distribution containing this file.
 */

package com.tms.player;

import org.springframework.stereotype.Component;

@Component
public class RatingCalculator {
    private static final double q = Math.log(10) / 400;

    private double g(double deviation) {
        return 1.0 / ( Math.sqrt( 1.0 + ( 3.0 * Math.pow(q,2) * Math.pow(deviation, 2) / Math.pow(Math.PI,2) )));
    }

    private double E(double playerRating, double playerRD, double opponentRating, double opponentRD) {
        return 1 / (1 + Math.exp(-g(playerRD) * g(opponentRD) * (playerRating - opponentRating) / 400));
    }

    public double calcWinProb(double playerRating, double playerRD, double opponentRating, double opponentRd) {
        return E(playerRating, playerRD, opponentRating, opponentRd);
    }
}