package com.tms.match;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MatchPlayers {
    private String player1Id;
    private String player2Id;
    private String winnerId;
}
