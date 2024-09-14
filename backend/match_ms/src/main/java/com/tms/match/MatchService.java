package com.tms.match;

import java.util.List;

public interface MatchService {
    List<Match> listMatches();
    Match getMatch(Long id);
    Match addMatch(Match Match);
    Match updateMatch(Long id, Match Match);

    /**
     * Change method's signature: do not return a value for delete operation
     * @param id
     */
    void deleteMatch(Long id);
}