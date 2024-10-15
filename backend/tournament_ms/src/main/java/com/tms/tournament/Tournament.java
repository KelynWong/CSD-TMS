package com.tms.tournament;

import java.time.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms.tournamentplayer.*;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Tournament {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(unique = true, nullable = false)
    private Long id;
    @NotNull(message = "Tournament Name cannot be null")
    private String tournamentName;
    @NotNull(message = "Tournament start datetime cannot be null")
    private LocalDateTime startDT;
    @NotNull(message = "Tournament end datetime cannot be null")
    private LocalDateTime endDT;
    @NotNull(message = "Tournament status cannot be null")
    private String status = "Scheduled"; 
    @NotNull(message = "Tournament registration start datetime cannot be null")
    private LocalDateTime regStartDT;
    @NotNull(message = "Tournament registration end datetime cannot be null")
    private LocalDateTime regEndDT;
    @NotNull(message = "Tournament creator cannot be null")
    private String createdBy;
    private String winner = null;

    @ManyToMany(mappedBy = "tournaments") //, cascade = CascadeType.ALL
    @JsonIgnore
    private List<Player> players;

    // {"Scheduled", "Registration Start", "Registration Close", "Ongoing", "Completed"}

}
