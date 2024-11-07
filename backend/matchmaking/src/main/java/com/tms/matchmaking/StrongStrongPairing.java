package com.tms.matchmaking;

import com.tms.match.MatchJson;
import com.tms.player.Player;

import java.util.ArrayList;
import java.util.List;

public class StrongStrongPairing implements PairingStrategy {

    @Override
    public List<MatchJson> pairPlayers(List<Player> players, Long tournamentId) {
        List<MatchJson> res = new ArrayList<>();

        // pair strong players with weak players
        for (int i = 0; i < players.size(); i+=2) {
            List<Player> matchPlayers = new ArrayList<>();
            matchPlayers.add(players.get(i));
            matchPlayers.add(players.get(i + 1));
            MatchJson match = new MatchJson(tournamentId, matchPlayers);
            res.add(match);
        }

        return res;
    }
}
