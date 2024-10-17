package com.tms.rating;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResultsDTO {
    private String winnerId;
    private String loserId;
    private LocalDateTime tournamentEndDate;
}
