package com.tms.match;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Objects;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class MatchJson {
    private Long id;
    private final Long tournamentId;
    private final String player1Id;
    private final String player2Id;
    private String winnerId;
    private Long left;
    private Long right;
    private List<Game> games;

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
