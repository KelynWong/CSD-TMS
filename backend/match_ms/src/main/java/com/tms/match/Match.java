package com.tms.match;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms.game.Game;

import jakarta.persistence.*;
import lombok.*;

@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Data
public class Match {
    private @Id @GeneratedValue (strategy = GenerationType.IDENTITY) Long id;
    private long tournamentId;
    private short roundNum;
    private short matchNum;
    private long player1Id;
    private long player2Id;
    private long winnerId;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Game> games;
}
