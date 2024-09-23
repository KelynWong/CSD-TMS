package com.tms.match;

import lombok.*;
import java.util.List;
import com.tms.game.Game;

@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Data
public class MatchDTO {
    private Long id;
    private long tournamentId;
    private short roundNum;
    private short matchNum;
    private long player1Id;
    private long player2Id;
    private long winnerId;
    private List<Game> games;    
}   