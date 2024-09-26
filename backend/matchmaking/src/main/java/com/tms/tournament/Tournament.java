package com.tms.tournament;

import java.time.*;
import java.util.*;

import com.tms.player.Player;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Tournament {
    private Long id;
    private String tournamentName;
    private LocalDateTime startDT;
    private LocalDateTime endDT;
    private String status; 
    private LocalDateTime regStartDT;
    private LocalDateTime regEndDT;
    private List<Player> players;

    // private String[] statusArr = new String[] {"Scheduled", "Registration Start", "Registration Close", "In Progress", "Completed"};

}
