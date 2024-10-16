package com.tms.tournament;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms.tournamentplayer.Player;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    // Custom Constructor
    public Tournament(String tournamentName, LocalDateTime startDT, LocalDateTime endDT, String status, 
    LocalDateTime regStartDT, LocalDateTime regEndDT, String createdBy, String winner) {

        this.tournamentName = tournamentName;
        this.startDT = startDT;
        this.endDT = endDT;
        this.status = status;
        this.regStartDT = regStartDT;
        this.regEndDT = regEndDT;
        this.createdBy = createdBy;
        this.winner = winner;
        // List<Player> players = new ArrayList<>();

    }

}
