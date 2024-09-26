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
}
