package com.tms.match;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class MatchServiceImpl implements MatchService {

    private MatchRepository matches;

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
    public List<Match> getMatchesByTournament(Long tournamentId) {
        return this.matches.findByTournamentId(tournamentId);
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

        if (allMatches.size() == 0) {
            return 0.0; // Avoid division by zero
        }
        
        return (double) winningMatches.size() / allMatches.size();
    }

    @Override
    public Match addMatch(MatchJson match) {
        Match newMatch = new Match(match.getTournamentId(), match.getPlayer1Id(), match.getPlayer2Id());
        
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
    public Match updateMatchAndParent(Long id, MatchPlayers newMatchPlayers) {
        Optional<Match> optionalMatch = this.matches.findById(id);
        if (!optionalMatch.isPresent()) {
            return null;
        }

        Match match = optionalMatch.get();
        if (newMatchPlayers.getPlayer1Id() != null) {
            match.setPlayer1Id(newMatchPlayers.getPlayer1Id());
        }

        if (newMatchPlayers.getPlayer2Id() != null) {
            match.setPlayer2Id(newMatchPlayers.getPlayer2Id());
        }

        if (newMatchPlayers.getWinnerId() != null) {
            match.setWinnerId((newMatchPlayers.getWinnerId()));
        }
        this.matches.save(match);

        List<Match> tournamentMatches = this.matches.findByTournamentId(match.getTournamentId());
        Match parentMatch = findParentMatch(tournamentMatches, id);
        
        if (parentMatch != null) {
            String player1Id = parentMatch.getPlayer1Id();
            String player2Id = parentMatch.getPlayer2Id();
            if (player1Id == null) {
                parentMatch.setPlayer1Id(newMatchPlayers.getWinnerId());
            } else if (!player1Id.equals(newMatchPlayers.getWinnerId()) && player2Id == null) {
                parentMatch.setPlayer2Id(newMatchPlayers.getWinnerId());
            }
            this.matches.save(parentMatch);
        }

        return match;
    }

    /**
     * Remove a Match with the given id
     * Spring Data JPA does not return a value for delete operation
     * Cascading: removing a Match will also remove all its associated games
     */
    @Override
    public void deleteMatch(Long id) {
        this.matches.deleteById(id);
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
}