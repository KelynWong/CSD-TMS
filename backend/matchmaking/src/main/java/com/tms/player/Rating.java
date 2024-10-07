package com.tms.player;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

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
