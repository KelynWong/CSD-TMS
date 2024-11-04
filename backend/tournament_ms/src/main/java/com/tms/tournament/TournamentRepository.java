package com.tms.tournament;

import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;


/**
 * We only need this interface declaration
 * Spring will automatically generate an implementation of the repo
 * 
 * JpaRepository provides more features by extending PagingAndSortingRepository, which in turn extends CrudRepository
 * For the purpose of this exercise, CrudRepository would also be sufficient
 */
@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    // additional derived queries specified here will be implemented by Spring Data JPA
    // start the derived query with "findBy", then reference the entity attributes you want to filter

    List<Tournament> findByTournamentName(String tournamentName);

    List<Tournament> findByStatus(TournamentStatus status);

    // @Query("DELETE FROM Game g WHERE g.match.id IN (SELECT m.id FROM Match m WHERE m.tournamentId = :tournamentId)")
    // void truncateTable(@Param("tournamentId") Long tournamentId);

}
