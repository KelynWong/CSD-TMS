package com.tms.matchmaking;

import com.tms.match.MatchJson;
import com.tms.player.Player;

import java.util.List;

public interface PairingStrategy {
    List<MatchJson> pairPlayers(List<Player> players, Long tournamentId);
}
