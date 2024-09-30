package com.tms.match;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchJson {
    private Long id;
    private Long tournamentId;
    private String player1Id;
    private String player2Id;
    private String winnerId;
    private Long left;
    private Long right;
    private List<Game> games;

    public MatchJson(Long tournamentId, String player1Id, String player2Id, Long left, Long right) {
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
