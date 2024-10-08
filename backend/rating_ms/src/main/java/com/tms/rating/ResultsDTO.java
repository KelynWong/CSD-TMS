package com.tms.rating;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ResultsDTO {
    private String winnerId;
    private String loserId;
    private LocalDateTime tournamentEndDate;
}
