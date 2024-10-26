package com.tms.match;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    public MatchJson(Long tournamentId, String player1Id, String player2Id) {
        this.tournamentId = tournamentId;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
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
