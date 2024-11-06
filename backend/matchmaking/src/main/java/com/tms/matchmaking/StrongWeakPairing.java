package com.tms.matchmaking;

import com.tms.match.MatchJson;
import com.tms.player.Player;

import java.util.ArrayList;
import java.util.List;

public class StrongWeakPairing implements PairingStrategy {

    @Override
    public List<MatchJson> pairPlayers(List<Player> players, Long tournamentId) {
        int start = 0;
        int end = players.size() - 1;
        List<MatchJson> res = new ArrayList<>();

        // pair strong players with weak players
        while (start <= end) {
            List<Player> matchPlayers = new ArrayList<>();
            matchPlayers.add(players.get(start));
            if (start != end) {
                matchPlayers.add(players.get(end));
            }
            MatchJson match = new MatchJson(tournamentId, matchPlayers);
            res.add(match);
            start++;
            end--;
        }
        return res;
    }
}
