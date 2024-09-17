package com.tms.tournament;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Tournament {
    @Id @GeneratedValue
    private long tournamentId;
    private String tournamentName;
    private LocalDateTime startDT;
    private LocalDateTime endDT;
    private String status; 
    private LocalDateTime regStartDT;
    private LocalDateTime regEndDT;


    // private String[] statusArr = new String[] {"Scheduled", "Registration Start", "Registration Close", "In Progress", "Completed"};

}
