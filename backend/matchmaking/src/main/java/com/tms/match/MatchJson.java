package com.tms.match;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
    private Long parent;
    private int roundNum;

    public MatchJson(Long tournamentId, String player1Id, String player2Id) {
        this.tournamentId = tournamentId;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
    }

    public MatchJson(MatchJson other) {
        this.id = other.id;
        this.tournamentId = other.tournamentId;
        this.player1Id = other.player1Id;
        this.player2Id = other.player2Id;
        this.winnerId = other.winnerId;
        // Assuming Game is immutable or has its own copy constructor
        this.games = (other.games != null) ? new ArrayList<>(other.games) : null;
        this.left = other.left;
        this.right = other.right;
        this.parent = other.parent;
        this.roundNum = other.roundNum;
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof MatchJson otherMatch)) {
            throw new IllegalArgumentException("Cannot compare MatchJson with non-MatchJson object");
        }
        return (Objects.equals(this.tournamentId, otherMatch.tournamentId)) &&
                (Objects.equals(this.player1Id, otherMatch.player1Id)) &&
                (Objects.equals(this.player2Id, otherMatch.player2Id)) &&
                (Objects.equals(this.winnerId, otherMatch.winnerId));
    }
}
