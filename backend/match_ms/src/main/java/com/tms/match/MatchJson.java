package com.tms.match;

import com.tms.game.Game;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

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
    private Integer roundNum;

    public static List<MatchJson> fromMatches(List<Match> matches) {
        return matches.stream().map(match -> {
            return new MatchJson(match.getId(), match.getTournamentId(), match.getPlayer1Id(), match.getPlayer2Id(),
                    match.getWinnerId(), match.getLeft() == null ? null : match.getLeft().getId(),
                    match.getRight() == null ? null : match.getRight().getId(), match.getGames(), match.getRoundNum());
        }).collect(Collectors.toList());
    }

    public MatchJson(Match match) {
        this.id = match.getId();
        this.tournamentId = match.getTournamentId();
        this.player1Id = match.getPlayer1Id();
        this.player2Id = match.getPlayer2Id();
        this.winnerId = match.getWinnerId();
        this.left = match.getLeft() == null ? null : match.getLeft().getId();
        this.right = match.getRight() == null ? null : match.getRight().getId();
        this.games = match.getGames();
    }
}
