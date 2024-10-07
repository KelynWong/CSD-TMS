package com.tms.rating;

import org.joda.time.DateTime;

import lombok.Data;

@Data
public class ResultsDTO {
    private String winnerId;
    private String loserId;
    private DateTime tournamentEndDate;
}
