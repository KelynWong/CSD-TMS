package com.tms.match;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class Game {
    private Long id;

    @JsonIgnore
    private Match match;
    private final short setNum;
    private final short player1Score;
    private final short player2Score;
}
