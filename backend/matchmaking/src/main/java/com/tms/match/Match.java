package com.tms.match;

import com.tms.player.Player;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Match {
    private Long id;
    private Long tournamentId;
    private Player player1;
    private Player player2;
    private Player winner;
    private Match left;
    private Match right;
    private List<Game> games;
    private int roundNum;

}
