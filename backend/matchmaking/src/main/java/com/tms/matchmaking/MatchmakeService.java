package com.tms.matchmaking;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tms.player.Player;

import io.swagger.v3.core.util.Json;

@Service
public class MatchmakeService {

    private RestClient restClient;
    private final String matchUrl = "http://localhost:8080/matches";

    public MatchmakeService() {
        this.restClient = RestClient.create();
    }

    public TreeNode matchmake(Long tournamentId, List<Player> players) {
        int n = players.size();
        int k = (int) (Math.ceil(Math.log(n) / Math.log(2)));

        Deque<TreeNode> tree = new ArrayDeque<>();
        int byes = (int) Math.pow(2, k) - n;

        // choose top x players to get byes. currently just the first x players
        List<Player> byePlayers = players.subList(0, byes);

        // create matches for byes
        for (int i = 0; i < byes; i++) {
            List<Player> matchPlayers = byePlayers.subList(i, i + 1);
            Long id = createMatch(tournamentId, matchPlayers);
            TreeNode node = new TreeNode(id);
            tree.add(node);
        }

        // create remaining matches for base layer
        List<Player> remainingPlayers = players.subList(byes, n);
        for (int i = 0; i < remainingPlayers.size(); i += 2) {
            List<Player> matchPlayers = remainingPlayers.subList(i, i + 2);
            Long id = createMatch(tournamentId, matchPlayers);
            TreeNode node = new TreeNode(id);
            tree.add(node);
        }

        // create matches for the rest of the tree
        for (int i = (k - 2); i >= 0; i--) {
            int numMatches = (int) Math.pow(2, i);
            for (int j = 0; j < numMatches; j++) {
                TreeNode left = tree.poll();
                TreeNode right = tree.poll();
                Long id = createMatchWithoutPlayers(tournamentId, left.getId(), right.getId());
                
                TreeNode node = new TreeNode(id); 
                node.setLeft(left);
                node.setRight(right);
                tree.add(node);
            }
        }

        return tree.poll();
    }

    private Long createMatch(Long tournamentId, List<Player> matchPlayers) {
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
        CreateMatch match = new CreateMatch(tournamentId, player1, player2, null, null, null);

        ResponseEntity<String> res = restClient.post()
        .uri(matchUrl)
        .contentType(MediaType.APPLICATION_JSON)
        .body(match)
        .retrieve()
        .toEntity(String.class);

        JsonNode json = parseJson(res);

        if (json == null) {
            return null;
        }

        Long matchId = json.get("id").asLong();
        return matchId;
    }

    private Long createMatchWithoutPlayers(Long tournamentId, Long left, Long right) {
        CreateMatch match = new CreateMatch(tournamentId, null, null, null, left, right);

        ResponseEntity<String> res = restClient.post()
        .uri(matchUrl)
        .contentType(MediaType.APPLICATION_JSON)
        .body(match)
        .retrieve()
        .toEntity(String.class);
        
        JsonNode json = parseJson(res);

        if (json == null) {
            return null;
        }

        Long matchId = json.get("id").asLong();
        return matchId;
        
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

    public void inOrderTraversal(TreeNode root) {
        if (root == null) {
            return;
        }
    
        ArrayDeque<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
    
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
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

    public TreeNode getTournament(Long tournamentId) {
        
        ResponseEntity<String> res = restClient.get()
        .uri(matchUrl + "/tournament/{tournamentId}", tournamentId)
        .retrieve()
        .toEntity(String.class);

        JsonNode json = parseJson(res);
        System.out.println(json);

        return new TreeNode(tournamentId);

    }
}
