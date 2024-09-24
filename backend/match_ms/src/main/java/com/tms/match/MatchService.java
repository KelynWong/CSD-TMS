package com.tms.match;

import java.util.List;

public interface MatchService {

    List<Match> listMatches();
    Match getMatch(Long id);

    List<Match> getMatchesByTournament(Long id);

    List<Match> getMatchWinsByUser(Long id);
    List<Match> getMatchLossByUser(Long id);
    List<Match> getMatchesPlayedByUser(Long id);
    Double getPlayerWinRate(Long id);

    Match addMatch(CreateMatch Match);

    Match updateMatch(Long id, Match Match);
    Match setChildren(Long id, Long leftId, Long rightId);

    /**
     * Change method's signature: do not return a value for delete operation
     * @param id
     */
    void deleteMatch(Long id);
}