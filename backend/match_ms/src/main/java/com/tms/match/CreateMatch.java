package com.tms.match;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CreateMatch {
    private long tournamentId;
    private long player1Id;
    private long player2Id;
    private long winnerId;
    private Long left;
    private Long right;
}
