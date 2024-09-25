package com.tms.matchmaking;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tms.exceptions.MatchCreationException;
import com.tms.exceptions.TournamentNotFoundException;
import com.tms.player.Player;

@Service
public class MatchmakeService {

    private RestClient restClient;
    private final String MATCH_URL = "http://localhost:8080/matches";

    public MatchmakeService() {
        this.restClient = RestClient.create();
    }

    public Match matchmake(Long tournamentId, List<Player> players) {
        int n = players.size();
        int k = (int) (Math.ceil(Math.log(n) / Math.log(2)));

        Deque<Match> tree = new ArrayDeque<>();
        int byes = (int) Math.pow(2, k) - n;

        // choose top x players to get byes. currently just the first x players
        List<Player> byePlayers = players.subList(0, byes);

        // create matches for byes
        for (int i = 0; i < byes; i++) {
            List<Player> matchPlayers = byePlayers.subList(i, i + 1);
            Match match = createMatch(tournamentId, matchPlayers);
            tree.add(match);
        }

        // create remaining matches for base layer
        List<Player> remainingPlayers = players.subList(byes, n);
        for (int i = 0; i < remainingPlayers.size(); i += 2) {
            List<Player> matchPlayers = remainingPlayers.subList(i, i + 2);
            Match match = createMatch(tournamentId, matchPlayers);
            tree.add(match);
        }

        // create matches for the rest of the tree
        for (int i = (k - 2); i >= 0; i--) {
            int numMatches = (int) Math.pow(2, i);
            for (int j = 0; j < numMatches; j++) {
                Match left = tree.poll();
                Match right = tree.poll();
                Match match = createMatchWithoutPlayers(tournamentId, left, right);
                
                match.setLeft(left);
                match.setRight(right);
                tree.add(match);
            }
        }

        return tree.poll();
    }

    private Match createMatch(Long tournamentId, List<Player> matchPlayers) {
        Long player1 = null;
        Long player2 = null;

        if (matchPlayers.size() == 2) {
            player1 = matchPlayers.get(0).getId();
            player2 = matchPlayers.get(1).getId();
        } else if (matchPlayers.size() == 1) {
            player1 = matchPlayers.get(0).getId();
        } else {
            throw new IllegalArgumentException("Invalid number of players");
        }
        Match match = new Match(tournamentId, player1, player2, null, null);

        return sendCreateRequest(match);
    }

    private Match createMatchWithoutPlayers(Long tournamentId, Match left, Match right) {
        Match match = new Match(tournamentId, null, null, left, right);

        return sendCreateRequest(match);
    }

    private Match sendCreateRequest(Match match) {
        ResponseEntity<String> res = restClient.post()
        .uri(MATCH_URL)
        .contentType(MediaType.APPLICATION_JSON)
        .body(match)
        .retrieve()
        .toEntity(String.class);

        if (res.getStatusCode() != HttpStatus.CREATED) {
            throw new MatchCreationException("Error creating match");
        }

        JsonNode json = parseJson(res);
        Long matchId = json.get("id").asLong();
        match.setId(matchId);
        return match;
    }
    
    private JsonNode parseJson(ResponseEntity<String> res) {
        String json = null;
        if (res != null && res.getBody() != null) {
            json = res.getBody();
        } else {
            return null;
        }

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void inOrderTraversal(Match root) {
        if (root == null) {
            return;
        }
    
        ArrayDeque<Match> queue = new ArrayDeque<>();
        queue.add(root);
    
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                Match node = queue.poll();
                System.out.print(node.getId() + " ");
                if (node.getLeft() != null) {
                    queue.add(node.getLeft());
                }
                if (node.getRight() != null) {
                    queue.add(node.getRight());
                }
            }
            System.out.println();
        }
    }

    public Match getTournament(Long tournamentId) {
        
        ResponseEntity<String> res = restClient.get()
        .uri(MATCH_URL + "/tournament/{tournamentId}", tournamentId)
        .retrieve()
        .toEntity(String.class);

        if (res.getStatusCode() != HttpStatus.OK) {
            throw new TournamentNotFoundException("Tournament not found");
        }

        Match rootMatch = null;
        try {
            rootMatch = tournamentFromJson(res.getBody());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return rootMatch;
    }

    private Match tournamentFromJson(String jsonString) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
    
        List<MatchJson> matchData = objectMapper.readValue(jsonString, new TypeReference<List<MatchJson>>() {});
        
        
        Map<Long, Match> idToNode = new HashMap<>();

        for (MatchJson md : matchData) {
            Match match = new Match();
            match.setId(md.getId());
            match.setTournamentId(md.getTournamentId());
            match.setPlayer1Id(md.getPlayer1Id());
            match.setPlayer2Id(md.getPlayer2Id());
            match.setWinnerId(md.getWinnerId());
            match.setGames(md.getGames());
            idToNode.put(match.getId(), match);
        }

        // Link left and right children
        for (MatchJson md : matchData) {
            Match match = idToNode.get(md.getId());
            if (md.getLeft() != null) {
                Long leftId = md.getLeft();
                Match left = idToNode.get(leftId);
                match.setLeft(left);
                idToNode.remove(leftId);
            }
            if (md.getRight() != null) {
                Long rightId = md.getRight();
                Match right = idToNode.get(rightId);
                match.setRight(right);
                idToNode.remove(rightId);
            }
        }

        if (idToNode.size() != 1) {
            return null;
        }

        return idToNode.values().iterator().next();
    }
}
