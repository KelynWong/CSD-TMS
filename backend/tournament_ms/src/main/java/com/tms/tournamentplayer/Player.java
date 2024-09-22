package com.tms.tournamentplayer;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms.tournament.Tournament;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Player {
    
    @Id @NotNull
    private Long id;

    private String username;

    @ManyToMany
    @JoinTable(
        name = "TournamentPlayer",
        joinColumns = @JoinColumn(name = "playerId"),
        inverseJoinColumns = @JoinColumn(name = "tournamentId")
    )
    @JsonIgnore
    private List<Tournament> tournaments;

}
