package com.tms.match;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

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

}
