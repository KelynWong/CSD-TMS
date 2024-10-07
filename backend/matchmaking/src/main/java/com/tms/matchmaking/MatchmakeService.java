package com.tms.matchmaking;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Comparator;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tms.exceptions.*;
import com.tms.match.CreateTournament;
import com.tms.match.Match;
import com.tms.match.MatchJson;
import com.tms.match.MatchPlayers;
import com.tms.player.Player;
import com.tms.tournament.Tournament;


@Service
public class MatchmakeService {

    private RestClient restClient;
    
    private final String MATCH_URL = "http://match-ms:8080/matches";
    private final String TOURNAMENT_URL = "http://tournament-ms:8082/tournaments";
    private final String PLAYER_URL = "http://user-ms:8083/api/users";

    public MatchmakeService() {
        this.restClient = RestClient.create();
    }

    public void matchmake(Long tournamentId) {
        List<Player> players = fetchTournamentPlayerIds(tournamentId);
        try {
            List<MatchJson> tournaments = null;
            tournaments = getTournamentMatches(tournamentId);
            if (tournaments != null && !tournaments.isEmpty()) {
                throw new TournamentExistsException(tournamentId);
            }
        } catch (TournamentNotFoundException e) {
            System.out.println("Tournament not found. Creating matches for tournament ID: " + tournamentId);
            int n = players.size();
            int k = (int) (Math.ceil(Math.log(n) / Math.log(2)));

            List<MatchJson> matches = new ArrayList<>();
            int byes = (int) Math.pow(2, k) - n;

            // choose top x players to get byes. currently just the first x players
            List<Player> byePlayers = players.subList(0, byes);

            // create matches for byes
            for (int i = 0; i < byes; i++) {
                List<Player> matchPlayers = byePlayers.subList(i, i + 1);
                MatchJson match = createMatch(tournamentId, matchPlayers);
                matches.add(match);
            }

            // create remaining matches for base layer
            List<Player> remainingPlayers = players.subList(byes, n);
            for (int i = 0; i < remainingPlayers.size(); i += 2) {
                List<Player> matchPlayers = remainingPlayers.subList(i, i + 2);
                MatchJson match = createMatch(tournamentId, matchPlayers);
                matches.add(match);
            }

            double numMatchesAtBase = Math.pow(2, k - 1);
            double numMatchesRemaining = (n - 1) - numMatchesAtBase;

            // create matches for the rest of the tree
            for (int i=0; i < numMatchesRemaining; i++) {
                MatchJson match = createMatchWithoutPlayers(tournamentId);
                matches.add(match);
            }

            sendCreateMatchesRequest(matches, numMatchesAtBase);
        }
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

        return match;
    }

    private MatchJson createMatchWithoutPlayers(Long tournamentId) {
        MatchJson match = new MatchJson(tournamentId, null, null, null, null);
        return match;
    }

    private boolean sendCreateMatchesRequest(List<MatchJson> matches, double numMatchesAtBase) {
        CreateTournament createTournament = new CreateTournament(matches, numMatchesAtBase);

        ResponseEntity<String> res = restClient.post()
        .uri(MATCH_URL + "/tournament")
        .contentType(MediaType.APPLICATION_JSON)
        .body(createTournament)
        .retrieve()
        .toEntity(String.class);

        if (res.getStatusCode() != HttpStatus.CREATED) {
            throw new MatchCreationException("Error creating matches");
        }

        return true;
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

    public void generateWinners(Long tournamentId) {
        List<MatchJson> matches = getTournamentMatches(tournamentId);
        Comparator<MatchJson> byId = Comparator.comparing(MatchJson::getId);
        matches.sort(byId);

        Random random = new Random();

        int matchesToUpdate = (matches.size() + 1) / 2;
        int currUpdated = 0;
        while (matchesToUpdate > 0) {
            for (int i = 0; i < matchesToUpdate; i++) {
                MatchJson match = matches.get(i);
                String player1Id = match.getPlayer1Id();
                String player2Id = match.getPlayer2Id();
                
                String winnerId = match.getWinnerId();
                if (winnerId != null) {
                    continue;
                }
                winnerId = random.nextBoolean() ? player1Id : player2Id;
    
                MatchPlayers matchPlayers = new MatchPlayers(player1Id, player2Id, winnerId);
                updateWinner(matchPlayers, match.getId());
            }
            
            currUpdated += matchesToUpdate;
            matches = getTournamentMatches(tournamentId);
            matches.sort(byId);
            matches = matches.subList(currUpdated, matches.size());
            matchesToUpdate = matchesToUpdate / 2;
        }
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
            throw new TournamentNotFoundException(tournamentId);
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
            throw new TournamentNotFoundException(tournamentId, true);
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
            }
            if (matchJson.getRight() != null) {
                Long rightId = matchJson.getRight();
                Match right = idToMatch.get(rightId);
                match.setRight(right);
            }
        }

        for (MatchJson matchJson : matches) {
            if (matchJson.getLeft() != null) {
                idToMatch.remove(matchJson.getLeft());
            }
            if (matchJson.getRight() != null) {
                idToMatch.remove(matchJson.getRight());
            }
        }

        if (idToMatch.size() != 1) {
            return null;
        }

        return idToMatch.values().iterator().next();
    }

    private void updateWinner(MatchPlayers matchPlayers, Long matchId) {
        ResponseEntity<String> res = restClient.patch()
        .uri(MATCH_URL + "/{matchId}", matchId)
        .body(matchPlayers)
        .retrieve()
        .toEntity(String.class);

        if (res.getStatusCode() != HttpStatus.OK) {
            throw new MatchUpdateException(matchId);
        }
    }
}