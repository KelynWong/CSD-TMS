package com.tms.tournament;

import java.util.List;

public interface TournamentService {

    /* Get all tournaments */
    List<Tournament> listTournaments();
    
    /* Get tournament by Id */
    Tournament getTournament(Long id);

    /* Create tournament */
    Tournament addTournament(Tournament tournament);

    /* Update tournament */
    Tournament updateTournament(Long id, Tournament tournament);

    /* Delete tournament*/
    void deleteTournament(Long id);

}
