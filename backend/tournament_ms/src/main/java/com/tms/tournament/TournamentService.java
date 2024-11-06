package com.tms.tournament;

import java.util.List;

public interface TournamentService {

    /* Get all tournaments */
    List<Tournament> listTournaments();
    
    /* Get tournament by Status */
    List<Tournament> getTournamentsByStatus(TournamentStatus status);

    /* Get tournament by Tournament Name */
    List<Tournament> getTournamentsByTournamentName(String tournamentName);
    
    /* Get tournament by Id */
    Tournament getTournament(Long id);

    /* Create tournament */
    Tournament addTournament(Tournament tournament);

    /* Update tournament */
    Tournament updateTournament(Long id, Tournament tournament);

    /* Delete tournament*/
    Tournament deleteTournament(Long id);

}
