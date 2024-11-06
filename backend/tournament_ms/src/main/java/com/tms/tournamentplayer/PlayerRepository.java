package com.tms.tournamentplayer;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tms.tournament.Tournament;

import java.util.*;

public interface PlayerRepository extends JpaRepository<Player, String> {
    // additional derived queries specified here will be implemented by Spring Data
    // JPA
    // start the derived query with "findBy", then reference the entity attributes
    // you want to filter

}
