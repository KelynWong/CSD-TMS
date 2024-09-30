package com.tms.match;

import lombok.*;

@Data
@AllArgsConstructor
public class Game {
    private Long id;
    private Match match;
    private short setNum;
    private short player1Score;
    private short player2Score;
}
