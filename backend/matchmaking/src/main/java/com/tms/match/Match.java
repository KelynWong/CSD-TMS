package com.tms.match;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonView;
import com.tms.Views;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Match {
    @JsonView(Views.Public.class)
    private Long id;

    @JsonView(Views.Public.class)
    private Long tournamentId;

    @JsonView(Views.Public.class)
    private String player1Id;

    @JsonView(Views.Public.class)
    private String player2Id;

    @JsonView(Views.Public.class)
    private String winnerId;

    @JsonView(Views.Public.class)
    private Match left;

    @JsonView(Views.Public.class)
    private Match right;

    @JsonView(Views.Public.class)
    private List<Game> games;

    public Match(Long tournamentId, String player1Id, String player2Id, Match left, Match right) {
        this.tournamentId = tournamentId;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.left = left;
        this.right = right;

        this.id = null;
        this.winnerId = null;
        this.games = null;
    }
}
