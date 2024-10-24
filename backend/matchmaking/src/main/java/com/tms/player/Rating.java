package com.tms.player;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class Rating {
    private final String id;
    private final double rating;
	private double ratingDeviation;
	private double volatility;
	private int numberOfResults;
	private LocalDateTime lastRatingPeriodEndDate;
}
