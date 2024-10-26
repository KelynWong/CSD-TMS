/*
 * Copyright (C) 2013 Jeremy Gooch <http://www.linkedin.com/in/jeremygooch/>
 *
 * The licence covering the contents of this file is described in the file LICENCE.txt,
 * which should have been included as part of the distribution containing this file.
 */
package com.tms.rating;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms.ratingCalc.RatingCalculator;
import com.tms.user.User;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Holds an individual's Glicko-2 rating.
 *
 * <p>Glicko-2 ratings are an average skill value, a standard deviation and a volatility (how consistent the player is).
 * Prof Glickman's paper on the algorithm allows scaling of these values to be more directly comparable with existing rating
 * systems such as Elo or USCF's derivation thereof. This implementation outputs ratings at this larger scale.</p>
 *
 * @author Jeremy Gooch
 */
@Entity
@NoArgsConstructor
@Table(name = "\"rating\"", schema = "\"user\"", indexes = @Index(columnList = "rating DESC"))
public class Rating implements Cloneable {
	@Id
	private String id;

	@OneToOne
	@MapsId
	@JoinColumn(name = "user_id")
	private User user;

    private double rating;
	private double ratingDeviation;
	private double volatility;
	private int numberOfResults; // the number of results from which the rating has been calculated
	private LocalDateTime lastRatingPeriodEndDate;

	 // the following variables are used to hold values temporarily whilst running calculations
	@Transient
	@JsonIgnore
	private double workingRating;

	@Transient
	@JsonIgnore
	private double workingRatingDeviation;
	
	@Transient
	@JsonIgnore
	private double workingVolatility;

	public Rating(User user, double initRating, double initRatingDeviation, double initVolatility, int nbResults, LocalDateTime lastRatingPeriodEndDate) {
		this.user = user;
		this.rating = initRating;
		this.ratingDeviation = initRatingDeviation;
		this.volatility = initVolatility;
		this.numberOfResults = nbResults;
		this.lastRatingPeriodEndDate = lastRatingPeriodEndDate;
	}

	public String getId() {
		return this.user.getId();
	}

	@Override
	protected Rating clone() {
		try {
			return (Rating) super.clone();
		} catch (CloneNotSupportedException e) {
			throw new AssertionError(); // Can't happen
		}
	}

	public boolean equals(Rating other) {
		return this.user.getId().equals(other.user.getId());
	}

	public boolean propertiesEqual(Rating other) {
		 return (this.user.getId().equals(other.user.getId())) &&
				 (this.rating == other.rating) &&
				(this.ratingDeviation == other.ratingDeviation) &&
				(this.volatility == other.volatility) &&
				(this.numberOfResults == other.numberOfResults);
	}

	/**
	 * Return the average skill value of the player.
	 *
	 * @return double
	 */
	public double getRating() {
		return this.rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	/**
	 * Return the average skill value of the player scaled down
	 * to the scale used by the algorithm's internal workings.
	 *
	 * @return double
	 */
	@JsonIgnore
	public double getGlicko2Rating() {
		return RatingCalculator.convertRatingToGlicko2Scale(this.rating);
	}

	/**
	 * Set the average skill value, taking in a value in Glicko2 scale.
	 *
	 * @param double
	 */
	public void setGlicko2Rating(double rating) {
		this.rating = RatingCalculator.convertRatingToOriginalGlickoScale(rating);
	}

	public double getVolatility() {
		return volatility;
	}

	public void setVolatility(double volatility) {
		this.volatility = volatility;
	}

	public double getRatingDeviation() {
		return ratingDeviation;
	}

	public void setRatingDeviation(double ratingDeviation) {
		this.ratingDeviation = ratingDeviation;
	}

	public LocalDateTime getLastRatingPeriodEndDate() {
		return lastRatingPeriodEndDate;
	}

	/**
	 * Return the rating deviation of the player scaled down
	 * to the scale used by the algorithm's internal workings.
	 *
	 * @return double
	 */
	@JsonIgnore
	public double getGlicko2RatingDeviation() {
		return RatingCalculator.convertRatingDeviationToGlicko2Scale( ratingDeviation );
	}

	/**
	 * Set the rating deviation, taking in a value in Glicko2 scale.
	 *
	 * @param double
	 */
	public void setGlicko2RatingDeviation(double ratingDeviation) {
		this.ratingDeviation = RatingCalculator.convertRatingDeviationToOriginalGlickoScale( ratingDeviation );
	}

	/**
	 * Used by the calculation engine, to move interim calculations into their "proper" places.
	 *
	 */
	public void finaliseRating() {
		this.setGlicko2Rating(workingRating);
		this.setGlicko2RatingDeviation(workingRatingDeviation);
		this.setVolatility(workingVolatility);

		this.setWorkingRatingDeviation(0);
		this.setWorkingRating(0);
		this.setWorkingVolatility(0);
	}

	/**
	 * Returns a formatted rating for inspection
	 *
	 * @return {id} / {ratingDeviation} / {volatility} / {numberOfResults}
	 */
	@Override
	public String toString() {
		return user.getId() + " / " +
				rating + " / " +
				ratingDeviation + " / " +
				volatility + " / " +
				numberOfResults;
	}

	public int getNumberOfResults() {
		return numberOfResults;
	}

	public void incrementNumberOfResults(int increment) {
		this.numberOfResults = numberOfResults + increment;
	}

	public void setNumberOfResults(int numberOfResults) {
		this.numberOfResults = numberOfResults;
	}

	public void setWorkingVolatility(double workingVolatility) {
		this.workingVolatility = workingVolatility;
	}

	public void setWorkingRating(double workingRating) {
		this.workingRating = workingRating;
	}

	public void setWorkingRatingDeviation(double workingRatingDeviation) {
		this.workingRatingDeviation = workingRatingDeviation;
	}

	public void setLastRatingPeriodEndDate(LocalDateTime lastRatingPeriodEndDate) {
		this.lastRatingPeriodEndDate = lastRatingPeriodEndDate;
	}
}
