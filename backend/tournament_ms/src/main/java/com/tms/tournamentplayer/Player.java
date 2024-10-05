package com.tms.tournamentplayer;


import jakarta.persistence.*;
import lombok.*;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms.tournament.Tournament;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Player {
    
    @Id
    @Column(unique = true, nullable = false)
    private String id;

    @ManyToMany
    @JoinTable(
        name = "TournamentPlayer",
        joinColumns = @JoinColumn(name = "playerId"),
        inverseJoinColumns = @JoinColumn(name = "tournamentId"),
        uniqueConstraints = @UniqueConstraint(columnNames = {"playerId", "tournamentId"})
    )
    @JsonIgnore
    private List<Tournament> tournaments;

}
