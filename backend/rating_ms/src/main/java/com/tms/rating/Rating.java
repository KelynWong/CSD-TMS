package com.tms.rating;

import jakarta.persistence.*;
import lombok.*;
import org.joda.time.DateTime;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Rating {
    private @Id String id; // references clerk userId
    private double rating;
	private double ratingDeviation;
	private double volatility;
	private int numberOfResults; // the number of results from which the rating has been calculated
	private DateTime lastRatingPeriodEndDate;
}
