package com.tms.matchmaking;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Match {
    private Long id;
    private Long tournamentId;
    private String player1Id;
    private String player2Id;
    private String winnerId;
    private Match left;
    private Match right;
    private List<Game> games;

    public Match(Long tournamentId, String player1Id, String player2Id, Match left, Match right) {
        this.tournamentId = tournamentId;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.left = left;
        this.right = right;

        this.id = null;
        this.winnerId = null;
        this.games = null;
    }
}
