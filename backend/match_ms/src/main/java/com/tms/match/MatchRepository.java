package com.tms.match;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * We only need this interface declaration
 * Spring will automatically generate an implementation of the repo
 * 
 * JpaRepository provides more features by extending PagingAndSortingRepository, which in turn extends CrudRepository
 * For the purpose of this exercise, CrudRepository would also be sufficient
 */
@Repository
public interface MatchRepository extends JpaRepository <Match, Long> {
    
    @Query("SELECT m FROM Match m LEFT JOIN FETCH m.games WHERE m.id = :id")
    Optional<Match> findByIdWithGames(@Param("id") Long id);

    List<Match> findByTournamentId(long tournamentId);
    
    List<Match> findByWinnerId(String winnerId);

    @Query("SELECT m FROM Match m WHERE (:playerId = m.player1Id OR :playerId = m.player2Id) AND :playerId <> m.winnerId")
    List<Match> findByLoserId(@Param("playerId") String playerId);

    @Query("SELECT m FROM Match m WHERE (m.player1Id = :playerId OR m.player2Id = :playerId) AND m.winnerId <> :playerId")
    List<Match> findMatchesPlayedByPlayer(@Param("playerId") String playerId);

}
