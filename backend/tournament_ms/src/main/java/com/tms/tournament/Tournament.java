package com.tms.tournament;

import java.time.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms.tournamentplayer.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Tournament {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(unique = true, nullable = false)
    private Long id;
    private String tournamentName;
    private LocalDateTime startDT;
    private LocalDateTime endDT;
    private String status; 
    private LocalDateTime regStartDT;
    private LocalDateTime regEndDT;
    private String createdBy;

    @ManyToMany(mappedBy = "tournaments") //, cascade = CascadeType.ALL
    @JsonIgnore
    private List<Player> players;

    // private String[] statusArr = new String[] {"Scheduled", "Registration Start", "Registration Close", "In Progress", "Completed"};

}
