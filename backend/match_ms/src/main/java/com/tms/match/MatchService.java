package com.tms.match;

import java.util.List;

public interface MatchService {

    List<Match> listMatches();
    Match getMatch(Long id);

    List<MatchJson> getMatchesByTournament(Long id);

    List<Match> getMatchWinsByUser(String id);
    List<Match> getMatchLossByUser(String id);
    List<Match> getMatchesPlayedByUser(String id);
    Double getPlayerWinRate(String id);

    Match addMatch(MatchJson match);
    List<Match> addTournament(CreateTournament tournament);

    Match setWinnerAndUpdateParent(Long matchId, boolean player1Wins);

    /**
     * Change method's signature: do not return a value for delete operation
     * @param id
     */
    void deleteMatch(Long id);

    void deleteTournament(Long id);
}