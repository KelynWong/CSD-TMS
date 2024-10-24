package com.tms.match;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MatchJsonTest {

    @Test
    void fromMatches_ConvertMatchListToMatchJson() {
        // Arrange
        Match match1 = new Match(1L, "player1", "player2");
        match1.setId(100L);
        Match match2 = new Match(1L, "player3", "player4");
        match2.setId(101L);
        List<Match> matches = Arrays.asList(match1, match2);

        // Act
        List<MatchJson> matchJsons = MatchJson.fromMatches(matches);

        // Assert
        assertEquals(2, matchJsons.size());
        assertEquals(100L, matchJsons.get(0).getId());
        assertEquals("player1", matchJsons.get(0).getPlayer1Id());
        assertEquals("player2", matchJsons.get(0).getPlayer2Id());
        assertEquals(101L, matchJsons.get(1).getId());
        assertEquals("player3", matchJsons.get(1).getPlayer1Id());
        assertEquals("player4", matchJsons.get(1).getPlayer2Id());
    }

    @Test
    void fromMatches_ConvertMatchListToMatchJsonWithNullValues() {
        // Arrange
        Match match1 = new Match(1L, "player1", "player2");
        match1.setId(100L);
        Match match3 = new Match(2L, "player5", "player6");
        match3.setId(102L);
        match1.setLeft(match3);
        Match match2 = new Match(1L, "player3", "player4");
        match2.setId(101L);
        Match match4 = new Match(3L, "player7", "player8");
        match4.setId(103L);
        match2.setRight(match4);
        List<Match> matches = Arrays.asList(match1, match2);

        // Act
        List<MatchJson> matchJsons = MatchJson.fromMatches(matches);

        // Assert
        assertEquals(2, matchJsons.size());
        assertEquals(100L, matchJsons.get(0).getId());
        assertEquals("player1", matchJsons.get(0).getPlayer1Id());
        assertEquals("player2", matchJsons.get(0).getPlayer2Id());
        assertEquals(102L, matchJsons.get(0).getLeft());
        assertEquals(101L, matchJsons.get(1).getId());
        assertEquals("player3", matchJsons.get(1).getPlayer1Id());
        assertEquals("player4", matchJsons.get(1).getPlayer2Id());
        assertEquals(103L, matchJsons.get(1).getRight());
    }

}