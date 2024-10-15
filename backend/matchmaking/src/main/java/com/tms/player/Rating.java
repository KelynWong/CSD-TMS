package com.tms.player;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class Rating {
    private String id;
    private double rating;
	private double ratingDeviation;
	private double volatility;
	private int numberOfResults;
	private LocalDateTime lastRatingPeriodEndDate;
}
