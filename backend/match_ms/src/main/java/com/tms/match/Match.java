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
    private String player1Username;
    private String player1Fullname;
    private String player2Username;
    private String player2Fullname;
    private String winnerUsername;
    private String winnerFullname;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Game> games;
}
