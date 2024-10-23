package com.tms.rating;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ResultsDTO {
    private String winnerId;
    private String loserId;
    private LocalDateTime tournamentEndDate;
}
