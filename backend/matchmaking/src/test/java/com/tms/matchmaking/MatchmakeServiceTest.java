package com.tms.matchmaking;

import com.tms.ListUtils;
import com.tms.exceptions.TournamentExistsException;
import com.tms.exceptions.TournamentNotFoundException;
import com.tms.match.MatchJson;
import com.tms.player.Player;
import com.tms.player.Rating;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MatchmakeServiceTest {

    @Mock
    private ApiManager apiManager;

    @InjectMocks
    private MatchmakeService matchmakeService;

    @Test
    void matchmake_TournamentAlreadyExists_ThrowsException() {
        when(apiManager.getTournamentMatches(any(Long.class))).thenReturn(List.of(new MatchJson(1L, "user1", "user2")));
        assertThrows(TournamentExistsException.class, () -> matchmakeService.matchmake(1L));
        verify(apiManager, times(1)).getTournamentMatches(any(Long.class));
    }

    // test logic for 7, 8 and 9 players. 8 is a magic number
    @ParameterizedTest
    @ValueSource(ints = {7, 8, 9})
    void matchmake_TournamentNotFound_CreatesMatches(int numPlayers) {
        List<Player> players = createPlayers(numPlayers);

        int n = players.size();
        int k = (int) (Math.ceil(Math.log(n) / Math.log(2))); // k is height of tree, or number of rounds in tournament
        double numMatches = Math.pow(2, k) - 1;
        int byes = (int) Math.pow(2, k) - n;
        double numMatchesAtBase = Math.pow(2, k - 1);

        List<MatchJson> expectedMatches = createExpectedMatches(byes, numMatches, players);

        when(apiManager.getTournamentMatches(any(Long.class))).thenThrow(new TournamentNotFoundException(1L));
        when(apiManager.fetchTournamentPlayerIds(any(Long.class))).thenReturn(players);
        when(apiManager.fetchPlayerData(anyList())).thenReturn(players);
        doNothing().when(apiManager).sendCreateMatchesRequest(anyList(), anyDouble());

        List<MatchJson> actualMatches = matchmakeService.matchmake(1L);

        // assert that strong players are paired with the weaker players
        for (int i = byes; i < numMatchesAtBase; i++) {
            MatchJson match = actualMatches.get(i);
            String player1 = match.getPlayer1Id();
            String player2 = match.getPlayer2Id();
            assertEquals(player1, "user" + (i + 1));
            assertEquals(player2, "user" + (n - i + byes));
        }

        assertEquals(numMatches, actualMatches.size());
        // assert correct number of byes are given
        assertTrue(ListUtils.areFirstNItemsEqual(expectedMatches, actualMatches, byes));

        verify(apiManager, times(1)).getTournamentMatches(any(Long.class));
        verify(apiManager, times(1)).fetchTournamentPlayerIds(any(Long.class));
        verify(apiManager, times(1)).fetchPlayerData(anyList());
    }

    private List<Player> createPlayers(int numPlayers) {
        List<Player> players = new ArrayList<>();
        for (int i = 0; i < numPlayers; i++) {
            String userId = "user" + (i + 1);
            Rating rating = new Rating(userId, 1500 - (i * 100));
            players.add(new Player(userId, rating));
        }
        return players;
    }

    private List<MatchJson> createExpectedMatches(int byes, double numMatches, List<Player> players) {
        List<MatchJson> matches = new ArrayList<>();
        for (int i = 0; i < byes; i++) {
            matches.add(new MatchJson(1L, players.get(i).getId(), null));
        }

        int l = byes;
        int r = players.size() - 1;
        while (l < r) {
            matches.add(new MatchJson(1L, players.get(byes).getId(), players.get(r).getId()));
            l++;
            r--;
        }
        return matches;
    }

    @Test
    void matchmake_TournamentNotFound_CreatesMatchesRandomisePlayerWithSameRating() {
        List<Player> players = createPlayersWithRatings(new int[]{1500, 1400, 1300}, 2);
        players.add(new Player("user7", new Rating("user7", 1200)));

        int n = players.size();
        int k = (int) (Math.ceil(Math.log(n) / Math.log(2))); // k is height of tree, or number of rounds in tournament
        double numMatchesAtBase = Math.pow(2, k - 1);

        when(apiManager.getTournamentMatches(any(Long.class))).thenThrow(new TournamentNotFoundException(1L));
        when(apiManager.fetchTournamentPlayerIds(any(Long.class))).thenReturn(players);
        when(apiManager.fetchPlayerData(anyList())).thenReturn(players);
        doNothing().when(apiManager).sendCreateMatchesRequest(anyList(), anyDouble());

        List<String> byePlayers = new ArrayList<>();
        Map<Integer, List<String[]>> tournamentToPair = new HashMap<>();
        for (int i = 0; i < 20; i++) {
            List<MatchJson> matchesCreated = matchmakeService.matchmake(1L);
            byePlayers.add(matchesCreated.get(0).getPlayer1Id());

            List<String[]> playerPairs = new ArrayList<>();
            for (int j = 1; j < numMatchesAtBase; j++) {
                playerPairs.add(new String[]{matchesCreated.get(j).getPlayer1Id(), matchesCreated.get(j).getPlayer2Id()});
            }
            tournamentToPair.put(i, playerPairs);
        }

        // assert that a players with same rating are given bye randomly.
        // test may fail with a 1 in 2 ^ 20 chance.
        // assert that only players with the highest rating are given bye
        assertTrue(ListUtils.areMoreThanNItemsUnique(byePlayers, 1));
        for (String byePlayer : byePlayers) {
            assertTrue(isUser1OrUser2(byePlayer));
        }

        List<String> lastMatchPlayers = new ArrayList<>();

        for (List<String[]> pairings : tournamentToPair.values()) {
            String[] lastMatchPair = pairings.get(pairings.size() - 1);
            lastMatchPlayers.add(lastMatchPair[0]);
            lastMatchPlayers.add(lastMatchPair[1]);
        }

        // assert that players with the same rating are not always paired in the same order
        assertTrue(ListUtils.areMoreThanNItemsUnique(lastMatchPlayers, 3));
    }

    private List<Player> createPlayersWithRatings(int[] ratings, int countPerRating) {
        List<Player> players = new ArrayList<>();
        for (int rating : ratings) {
            for (int i = 0; i < countPerRating; i++) {
                String userId = "user" + (players.size() + 1);
                players.add(new Player(userId, new Rating(userId, rating)));
            }
        }
        return players;
    }

    private boolean isUser1OrUser2(String user) {
        return "user1".equals(user) || "user2".equals(user);
    }
}