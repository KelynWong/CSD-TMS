package com.tms.matchmaking;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tms.exceptions.*;
import com.tms.match.Match;
import com.tms.match.MatchJson;
import com.tms.player.Player;
import com.tms.tournament.Tournament;


@Service
public class MatchmakeService {

    private RestClient restClient;
    private final String MATCH_URL = "http://localhost:8080/matches";
    private final String TOURNAMENT_URL = "http://localhost:8082/tournaments";
    private final String PLAYER_URL = "http://localhost:8083/api/users";

    public MatchmakeService() {
        this.restClient = RestClient.create();
    }

    public void matchmake(Long tournamentId) {
        List<Player> players = fetchTournamentPlayerIds(tournamentId);
        try {
            List<MatchJson> tournaments = null;
            tournaments = getTournamentMatches(tournamentId);
            if (tournaments != null && !tournaments.isEmpty()) {
                throw new TournamentExistsException("Matches already created for tournament ID: " + tournamentId);
            }
            
        } catch (TournamentNotFoundException e) {
            System.out.println("Tournament not found. Creating matches for tournament ID: " + tournamentId);
            int n = players.size();
            int k = (int) (Math.ceil(Math.log(n) / Math.log(2)));

            Deque<MatchJson> tree = new ArrayDeque<>();
            int byes = (int) Math.pow(2, k) - n;

            // choose top x players to get byes. currently just the first x players
            List<Player> byePlayers = players.subList(0, byes);

            // create matches for byes
            for (int i = 0; i < byes; i++) {
                List<Player> matchPlayers = byePlayers.subList(i, i + 1);
                MatchJson match = createMatch(tournamentId, matchPlayers);
                tree.add(match);
            }

            // create remaining matches for base layer
            List<Player> remainingPlayers = players.subList(byes, n);
            for (int i = 0; i < remainingPlayers.size(); i += 2) {
                List<Player> matchPlayers = remainingPlayers.subList(i, i + 2);
                MatchJson match = createMatch(tournamentId, matchPlayers);
                tree.add(match);
            }

            // create matches for the rest of the tree
            for (int i = (k - 2); i >= 0; i--) {
                int numMatches = (int) Math.pow(2, i);
                for (int j = 0; j < numMatches; j++) {
                    Long left = tree.poll().getId();
                    Long right = tree.poll().getId();
                    MatchJson match = createMatchWithoutPlayers(tournamentId, left, right);
                    
                    tree.add(match);
                }
            }
        }
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

    public Tournament getTournament(Long tournamentId) {
        // Get tournament data
        Tournament tournament = fetchTournamentData(tournamentId);

        // Get player ids for a particular tournament   
        List<Player> playerIds = fetchTournamentPlayerIds(tournamentId);

        // Get player data for a particular tournament
        ResponseEntity<List<Player>> playerRes = restClient.post()
                .uri(PLAYER_URL + "/ids")
                .body(playerIds)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<List<Player>>() {});
        
        if (playerRes.getStatusCode() != HttpStatus.OK) {
            throw new PlayerNotFoundException("Player ID not registered in database.");
        }
        
        tournament.setPlayers(playerRes.getBody());
        
        // Get matches of a given tournament id
        List<MatchJson> matchRes = getTournamentMatches(tournamentId);

        HashMap<String, Player> playerMap = new HashMap<>();
        for (Player player : tournament.getPlayers()) {
            playerMap.put(player.getId(), player);
        }
        Match rootMatch = null;
        rootMatch = constructTournament(matchRes, playerMap);
        tournament.setRootMatch(rootMatch);

        return tournament;
    }

    private MatchJson createMatch(Long tournamentId, List<Player> matchPlayers) {
        String player1 = null;
        String player2 = null;

        if (matchPlayers.size() == 2) {
            player1 = matchPlayers.get(0).getId();
            player2 = matchPlayers.get(1).getId();
        } else if (matchPlayers.size() == 1) {
            player1 = matchPlayers.get(0).getId();
        } else {
            throw new IllegalArgumentException("Invalid number of players");
        }
        MatchJson match = new MatchJson(tournamentId, player1, player2, null, null);

        return sendCreateMatchRequest(match);
    }

    private MatchJson createMatchWithoutPlayers(Long tournamentId, Long leftId, Long rightId) {
        MatchJson match = new MatchJson(tournamentId, null, null, leftId, rightId);

        return sendCreateMatchRequest(match);
    }

    private MatchJson sendCreateMatchRequest(MatchJson match) {
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

    private Tournament fetchTournamentData(Long tournamentId) {
        ResponseEntity<Tournament> tournamentRes = restClient.get()
                .uri(TOURNAMENT_URL + "/id/{tournamentId}", tournamentId)
                .retrieve()
                .toEntity(Tournament.class);

        if (tournamentRes.getStatusCode() != HttpStatus.OK) {
            throw new TournamentNotFoundException("Tournament not found");
        }

        return tournamentRes.getBody();
    }

    private List<Player> fetchTournamentPlayerIds(Long tournamentId) {
        ResponseEntity<List<Player>> playerIdRes = restClient.get()
                .uri(TOURNAMENT_URL + "/{tournamentId}/players", tournamentId)
                .retrieve()
                .toEntity(new ParameterizedTypeReference<List<Player>>() {});

        if (playerIdRes.getStatusCode() != HttpStatus.OK || playerIdRes.getBody().isEmpty()) {
            throw new NoPlayersRegisteredException("No players registered for tournament");
        }

        return playerIdRes.getBody();
    }

    private List<MatchJson> getTournamentMatches(Long tournamentId) {
        ResponseEntity<List<MatchJson>> matchRes = restClient.get()
        .uri(MATCH_URL + "/tournament/{tournamentId}", tournamentId)
        .retrieve()
        .toEntity(new ParameterizedTypeReference<List<MatchJson>>() {});

        if (matchRes.getStatusCode() != HttpStatus.OK || matchRes.getBody().isEmpty()) {
            throw new TournamentNotFoundException("Tournament not found");
        }

        return matchRes.getBody();
    }

    private Match constructTournament(List<MatchJson> matches, HashMap<String, Player> playerMap) {
        Map<Long, Match> idToMatch = new HashMap<>();

        for (MatchJson matchJson : matches) {
            Match match = new Match();
            match.setId(matchJson.getId());
            match.setTournamentId(matchJson.getTournamentId());
            match.setPlayer1(playerMap.get(matchJson.getPlayer1Id()));
            match.setPlayer2(playerMap.get(matchJson.getPlayer2Id()));
            match.setWinner(playerMap.get(matchJson.getWinnerId()));
            match.setGames(matchJson.getGames());
            idToMatch.put(match.getId(), match);
        }

        // Link left and right children
        for (MatchJson matchJson : matches) {
            Match match = idToMatch.get(matchJson.getId());
            if (matchJson.getLeft() != null) {
                Long leftId = matchJson.getLeft();
                Match left = idToMatch.get(leftId);
                match.setLeft(left);
                idToMatch.remove(leftId);
            }
            if (matchJson.getRight() != null) {
                Long rightId = matchJson.getRight();
                Match right = idToMatch.get(rightId);
                match.setRight(right);
                idToMatch.remove(rightId);
            }
        }

        if (idToMatch.size() != 1) {
            return null;
        }

        return idToMatch.values().iterator().next();
    }
}
