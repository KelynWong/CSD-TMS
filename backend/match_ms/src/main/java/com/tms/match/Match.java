package com.tms.match;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.tms.game.Game;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tournamentId;

    private String player1Id;

    private String player2Id;

    private String winnerId;

    @ManyToOne
    @JoinColumn(name = "left_id")
    private Match left;

    @ManyToOne
    @JoinColumn(name = "right_id")
    private Match right;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Game> games;

    private Integer roundNum;

    public Match(Long tournamentId, String player1Id, String player2Id) {
        this.tournamentId = tournamentId;
        this.player1Id = player1Id;
        this.player2Id = player2Id;

        this.winnerId = null;
        this.left = null;
        this.right = null;
        this.games = null;
    }

    public Match(Long tournamentId, String player1Id, String player2Id, String winnerId, int roundNum) {
        this.tournamentId = tournamentId;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.winnerId = winnerId;
        this.roundNum = roundNum;

        this.id = null;
        this.left = null;
        this.right = null;
        this.games = null;

    }
}
