package com.tms.matchmaking;

import com.tms.match.MatchJson;
import com.tms.player.Player;
import lombok.Data;

import java.util.Map;

@Data
public class TournamentSimSetup {
    private final Map<Long, MatchJson> idToMatch;
    private final Map<String, Player> idToPlayer;
}