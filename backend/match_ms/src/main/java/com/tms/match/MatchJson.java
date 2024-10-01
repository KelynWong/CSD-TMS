package com.tms.match;

import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.tms.game.Game;

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

    public static List<MatchJson> fromMatches(List<Match> matches) {
        return matches.stream().map(match -> {
            return new MatchJson(match.getId(), match.getTournamentId(), match.getPlayer1Id(), match.getPlayer2Id(),
                    match.getWinnerId(), match.getLeft() == null ? null : match.getLeft().getId(),
                    match.getRight() == null ? null : match.getRight().getId(), match.getGames());
        }).collect(Collectors.toList());
    }
}
