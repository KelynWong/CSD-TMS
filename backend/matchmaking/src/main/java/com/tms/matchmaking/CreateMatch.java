package com.tms.matchmaking;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CreateMatch {
    private Long tournamentId;
    private Long player1Id;
    private Long player2Id;
    private Long winnerId;
    private Long left;
    private Long right;
}
