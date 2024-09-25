package com.tms.tournamentplayer;


import org.springframework.data.jpa.repository.JpaRepository;


import java.util.*;


public interface PlayerRepository extends JpaRepository<Player, Long>{
    // additional derived queries specified here will be implemented by Spring Data JPA
    // start the derived query with "findBy", then reference the entity attributes you want to filter

}
