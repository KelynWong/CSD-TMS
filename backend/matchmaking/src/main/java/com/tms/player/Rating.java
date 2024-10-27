package com.tms.player;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rating {
    private String id;
    private double rating;
	private double ratingDeviation;
	private double volatility;
	private int numberOfResults;
	private LocalDateTime lastRatingPeriodEndDate;

	public Rating(String id, double rating, double ratingDeviation) {
		this.id = id;
		this.rating = rating;
		this.ratingDeviation = ratingDeviation;
	}
}
