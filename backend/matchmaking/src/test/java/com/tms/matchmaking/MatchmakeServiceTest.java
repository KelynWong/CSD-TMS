package com.tms.matchmaking;

import com.tms.match.MatchJson;
import com.tms.player.Player;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MatchmakeServiceTest {

    @Mock
    private RestClient restClient;

    @InjectMocks
    private MatchmakeService matchmakeService;

    @Test
    void matchmake_TournamentAlreadyExists_ThrowsException() {
        Long tournamentId = 1L;

        // when(matchmakeService.getTournamentMatches(tournamentId)).thenThrow(new TournamentExistsException
        // (tournamentId));

        // assertThrows(TournamentExistsException.class, () -> matchmakeService.matchmake(tournamentId));
    }

    @Test
    void matchmake_TournamentNotFound_CreatesMatches() {
        Long tournamentId = 1L;
        List<Player> players = new ArrayList<>();
//        players.add(new Player("player1"));
//        players.add(new Player("player2"));

        when(restClient.get()
                .uri(anyString(), anyLong())
                .retrieve()
                .toEntity(new ParameterizedTypeReference<List<Player>>() {}))
                .thenReturn(new ResponseEntity<>(players, HttpStatus.OK));

        when(restClient.get()
                .uri(anyString(), anyLong())
                .retrieve()
                .toEntity(new ParameterizedTypeReference<List<MatchJson>>() {}))
                .thenReturn(new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK));

        doNothing().when(restClient).post()
                .uri(anyString())
                .contentType(any())
                .body(any())
                .retrieve()
                .toEntity(String.class);

        matchmakeService.matchmake(tournamentId);

        verify(restClient, times(1)).post()
                .uri(anyString())
                .contentType(any())
                .body(any())
                .retrieve()
                .toEntity(String.class);
    }
}