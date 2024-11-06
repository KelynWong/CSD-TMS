package com.tms.tournamentplayer;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;

import java.util.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.EmptyResultDataAccessException;

import com.tms.TestHelper;
import com.tms.tournament.AutoStatusUpdateService;
import com.tms.tournament.TournamentRepository;
import com.tms.tournament.TournamentServiceImpl;

// @ExtendWith(MockitoExtension.class)
public class PlayerServiceTest {
    
    // @Mock
    // private TournamentRepository tournaments;

    // @Mock
    // private PlayerRepository players;

    // @Mock
    // private AutoStatusUpdateService autoStatusUpdateService;

    // @InjectMocks
    // private PlayerService playerService;

    // @InjectMocks
	// private TestHelper helper;

    // @Test // getPlayer - case 1 : found player (return player)
    // void getPlayer_Found_ReturnPlayer() {
    //     // Arrange 
    //     // - mock object (player)
    //     Player player = helper.createTestPlayer();
    //     String id = player.getId();
    //     Optional<Player> optPlayer = Optional.of(player);

    //     // - mock methods/operations
    //     when(players.findById(id)).thenReturn(optPlayer);

    //     // Act
    //     Player savedPlayer = playerService.getPlayer(id);

    //     // Assert
    //     assertNotNull(savedPlayer);
    //     verify(players).findById(id);
    // }


}
