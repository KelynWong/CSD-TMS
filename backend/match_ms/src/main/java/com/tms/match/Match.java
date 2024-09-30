package com.tms.match;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.tms.game.Game;

import jakarta.persistence.*;
import lombok.*;

@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
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

    public Match(Long tournamentId, String player1Id, String player2Id) {
        this.tournamentId = tournamentId;
        this.player1Id = player1Id;
        this.player2Id = player2Id;

        this.id = null;
        this.winnerId = null;
        this.left = null;
        this.right = null;
        this.games = null;

    }
}
