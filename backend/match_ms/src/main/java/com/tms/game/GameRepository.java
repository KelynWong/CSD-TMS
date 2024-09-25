package com.tms.game;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long>{
    // additional derived queries specified here will be implemented by Spring Data JPA
    // start the derived query with "findBy", then reference the entity attributes you want to filter
    List<Game> findByMatchId(Long matchId);
    Optional<Game> findByIdAndMatchId(Long id, Long matchId);
}