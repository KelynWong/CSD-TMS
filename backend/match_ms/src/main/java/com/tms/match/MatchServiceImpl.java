package com.tms.match;

import com.tms.exceptions.MatchNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matches;

    public MatchServiceImpl(MatchRepository matches) {
        this.matches = matches;
    }

    @Override
    public List<Match> listMatches() {
        return this.matches.findAll();
    }

    @Override
    public Match getMatch(Long id) {
        return this.matches.findById(id).map(match -> {
            return match;
        }).orElse(null);
    }

    @Override
    public List<MatchJson> getMatchesByTournament(Long tournamentId) {
        List<Match> matches = this.matches.findByTournamentIdOrderByIdAsc(tournamentId);
        return MatchJson.fromMatches(matches);
    }

    @Override
    public List<Match> getMatchWinsByUser(String playerId) {
        return this.matches.findByWinnerId(playerId);
    }

    @Override
    public List<Match> getMatchLossByUser(String playerId) {
        return this.matches.findByLoserId(playerId);
    }

    @Override
    public List<Match> getMatchesPlayedByUser(String playerId) {
        return this.matches.findMatchesPlayedByPlayer(playerId);
    }

    @Override
    public Double getPlayerWinRate(String playerId) {
        List<Match> winningMatches = this.matches.findByWinnerId(playerId);
        List<Match> allMatches = this.matches.findMatchesPlayedByPlayer(playerId);

        if (allMatches.isEmpty()) {
            return 0.0; // Avoid division by zero
        }
        
        return (double) winningMatches.size() / allMatches.size();
    }

    @Override
    public Match addMatch(MatchJson match) {
        Match newMatch = new Match(match.getTournamentId(), match.getPlayer1Id(), match.getPlayer2Id(), match.getWinnerId());

        Long leftId = match.getLeft();
        Long rightId = match.getRight();

        if (leftId != null) {
            Optional<Match> leftMatch = this.matches.findById(leftId);
            if (leftMatch.isPresent()) {
                newMatch.setLeft(leftMatch.get());
            }
        } else {
            match.setLeft(null);
        }

        if (rightId != null) {
            Optional<Match> rightMatch = this.matches.findById(rightId);
            if (rightMatch.isPresent()) {
                newMatch.setRight(rightMatch.get());
            }
        } else {
            match.setRight(null);
        }

        return this.matches.save(newMatch);
    }

    @Override
    @Transactional
    public List<Match> addTournament(CreateTournament tournament) {
        List<Match> res = new ArrayList<>();
        Deque<Match> q = new ArrayDeque<>();

        int numMatchesAtBase = (int) tournament.getNumMatchesAtBase();
        addBaseMatches(tournament, res, q, numMatchesAtBase);
        addRemainingMatches(tournament, res, q, numMatchesAtBase);

        return res;
    }

    private void addBaseMatches(CreateTournament tournament, List<Match> res, Deque<Match> q, int numMatchesAtBase) {
        for (int i = 0; i < numMatchesAtBase; i++) {
            MatchJson newMatch = tournament.getMatches().get(i);

            // if player given bye, automatically set as winner.
            // Only applies at base layer
            if (newMatch.getPlayer2Id() == null) {
                newMatch.setWinnerId(newMatch.getPlayer1Id());
            }

            Match match = this.addMatch(newMatch);
            res.add(match);
            q.add(match);
        }
    }

    private void addRemainingMatches(CreateTournament tournament, List<Match> res, Deque<Match> q, int numMatchesAtBase) {
        for (int i = numMatchesAtBase; i < tournament.getMatches().size(); i++) {
            Match leftMatch = q.poll();
            Match rightMatch = q.poll();

            MatchJson matchToAdd = setChildMatchesAndPlayers(tournament.getMatches().get(i), leftMatch, rightMatch);
            Match match = this.addMatch(matchToAdd);
            res.add(match);
            q.add(match);
        }
    }

    private MatchJson setChildMatchesAndPlayers(MatchJson matchToAdd, Match leftMatch, Match rightMatch) {
        matchToAdd.setLeft(leftMatch.getId());
        matchToAdd.setRight(rightMatch.getId());

        if (leftMatch.getWinnerId() != null) {
            matchToAdd.setPlayer1Id(leftMatch.getWinnerId());
        }

        if (rightMatch.getWinnerId() != null) {
            matchToAdd.setPlayer2Id(rightMatch.getWinnerId());
        }

        return matchToAdd;
    }

    @Override
    public Match setWinnerAndUpdateParent(Long matchId, boolean player1Wins) {
        Optional<Match> optionalMatch = this.matches.findById(matchId);
        if (!optionalMatch.isPresent()) {
            return null;
        }

        Match match = optionalMatch.get();

        String winnerId = player1Wins ? match.getPlayer1Id() : match.getPlayer2Id();

        match.setWinnerId(winnerId);
        this.matches.save(match);

        updateParentMatch(match, winnerId);
        return match;
    }

    private void updateParentMatch(Match match, String winnerId) {
        List<Match> tournamentMatches = this.matches.findByTournamentIdOrderByIdAsc(match.getTournamentId());
        Match parentMatch = findParentMatch(tournamentMatches, match.getId());

        if (parentMatch != null) {
            String player1Id = parentMatch.getPlayer1Id();
            String player2Id = parentMatch.getPlayer2Id();
            if (player1Id == null) {
                parentMatch.setPlayer1Id(winnerId);
            } else if (!player1Id.equals(winnerId) && player2Id == null) {
                parentMatch.setPlayer2Id(winnerId);
            }
            this.matches.save(parentMatch);
        }
    }

    private Match findParentMatch(List<Match> matches, Long matchId) {
        for (Match match : matches) {
            if ((match.getLeft() != null && match.getLeft().getId().equals(matchId)) ||
                    (match.getRight() != null && match.getRight().getId().equals(matchId))) {
                return match;
            }
        }
        return null;
    }

    @Override
    @Transactional
    public void generateWinners(Long tournamentId) {
        List<Match> matches = this.matches.findByTournamentIdOrderByIdAsc(tournamentId);
        
        Random random = new Random();

        int matchesToUpdate = (matches.size() + 1) / 2;
        int currUpdated = 0;
        while (matchesToUpdate > 0) {
            for (int i = 0; i < matchesToUpdate; i++) {
                Match match = matches.get(i);
                
                String winnerId = match.getWinnerId();
                if (winnerId != null) {
                    continue;
                }
                boolean player1Wins = random.nextBoolean();
    
                if (setWinnerAndUpdateParent(match.getId(), player1Wins) == null) {
                    throw new MatchNotFoundException(match.getId());
                }
            }
            
            currUpdated += matchesToUpdate;
            matches = this.matches.findByTournamentIdOrderByIdAsc(tournamentId);
            matches = matches.subList(currUpdated, matches.size());
            matchesToUpdate = matchesToUpdate / 2;
        }
    }

    /**
     * Remove a Match with the given id
     * Spring Data JPA does not return a value for delete operation
     * Cascading: removing a Match will also remove all its associated games
     */
    @Override
    public void deleteMatch(Long id) {
            if (this.matches.existsById(id)) {
                this.matches.deleteById(id);
            }else {
            throw new MatchNotFoundException(id);
        }
    }
}