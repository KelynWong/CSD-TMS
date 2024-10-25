package com.tms.matchmaking;

import com.tms.exceptions.TournamentExistsException;
import com.tms.match.MatchJson;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MatchmakeServiceTest {

    @Mock
    private ApiManager apiManager;

    @InjectMocks
    private MatchmakeService matchmakeService;

    @Test
    void matchmake_TournamentAlreadyExists_ThrowsException() {
        when(apiManager.getTournamentMatches(any(Long.class))).thenReturn(List.of(new MatchJson()));
        assertThrows(TournamentExistsException.class, () -> matchmakeService.matchmake(1L));
        verify(apiManager, times(1)).getTournamentMatches(any(Long.class));
    }

//    @Test
//    void matchmake_TournamentNotFound_CreatesMatches() {
//        Long tournamentId = 1L;
//        List<Player> players = new ArrayList<>();
////        players.add(new Player("player1"));
////        players.add(new Player("player2"));
//
//        when(restClient.get()
//                .uri(anyString(), anyLong())
//                .retrieve()
//                .toEntity(new ParameterizedTypeReference<List<Player>>() {
//                }))
//                .thenReturn(new ResponseEntity<>(players, HttpStatus.OK));
//
//        when(restClient.get()
//                .uri(anyString(), anyLong())
//                .retrieve()
//                .toEntity(new ParameterizedTypeReference<List<MatchJson>>() {
//                }))
//                .thenReturn(new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK));
//
//        doNothing().when(restClient).post()
//                .uri(anyString())
//                .contentType(any())
//                .body(any())
//                .retrieve()
//                .toEntity(String.class);
//
//        matchmakeService.matchmake(tournamentId);
//
//        verify(restClient, times(1)).post()
//                .uri(anyString())
//                .contentType(any())
//                .body(any())
//                .retrieve()
//                .toEntity(String.class);
//    }
}