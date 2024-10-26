package com.tms.match;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Game {
    private Long id;

    @JsonIgnore
    private Match match;
    private short setNum;
    private short player1Score;
    private short player2Score;

    public Game(short setNum, short player1Score, short player2Score) {
        this.setNum = setNum;
        this.player1Score = player1Score;
        this.player2Score = player2Score;
    }
}
