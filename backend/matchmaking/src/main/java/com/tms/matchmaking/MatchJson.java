package com.tms.matchmaking;

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
    private Long player1Id;
    private Long player2Id;
    private Long winnerId;
    private Long left;
    private Long right;
    private List<Game> games;
}
