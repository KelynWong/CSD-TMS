package com.tms.match;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Game {
    private Long id;

    @JsonIgnore
    private Match match;
    private short setNum;
    private short player1Score;
    private short player2Score;
}
