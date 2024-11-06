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

    /**
     * Get a list of all Matches
     * @return a list of Match objects
     */
    @Override
    public List<Match> listMatches() {
        return this.matches.findAll();
    }

    /**
     * Get a Match with the given id
     * @param id the id of the Match
     * @return the Match object
     */
    @Override
    public Match getMatch(Long id) {
        return this.matches.findById(id).map(match -> {
            return match;
        }).orElse(null);
    }

    /**
     * Get a list of Matches with the given tournament id
     * @param tournamentId the id of the Tournament
     * @return a list of Match objects
     */
    @Override
    public List<MatchJson> getMatchesByTournament(Long tournamentId) {
        List<Match> matches = this.matches.findByTournamentIdOrderByIdAsc(tournamentId);
        return MatchJson.fromMatches(matches);
    }

    /**
     * Get a list of Matches where the given playerId won
     * @param playerId the id of the Player
     * @return List of Match objects
     */
    @Override
    public List<Match> getMatchWinsByUser(String playerId) {
        return this.matches.findByWinnerId(playerId);
    }

    /**
     * Get a list of Matches where the given playerId lost
     * @param playerId the id of the Player
     * @return List of Match objects
     */
    @Override
    public List<Match> getMatchLossByUser(String playerId) {
        return this.matches.findByLoserId(playerId);
    }

    /**
     * Get a list of Matches where the given playerId played
     * @param playerId the id of the Player
     * @return List of Match objects
     */
    @Override
    public List<Match> getMatchesPlayedByUser(String playerId) {
        return this.matches.findMatchesPlayedByPlayer(playerId);
    }

    /**
     * Get the win rate of a player
     * @param playerId the id of the Player
     * @return the win rate of the player
     */
    @Override
    public Double getPlayerWinRate(String playerId) {
        List<Match> winningMatches = this.matches.findByWinnerId(playerId);
        List<Match> allMatches = this.matches.findMatchesPlayedByPlayer(playerId);

        if (allMatches.isEmpty()) {
            return 0.0; // Avoid division by zero
        }
        
        return (double) winningMatches.size() / allMatches.size();
    }

    /**
     * Adds a new match to the repository.
     *
     * @param match The MatchJson object containing the details of the match to be added.
     * @return The newly added Match object.
     */
    @Override
    public Match addMatch(MatchJson match) {
        Match newMatch = new Match(match.getTournamentId(), match.getPlayer1Id(), match.getPlayer2Id(),
                match.getWinnerId(), match.getRoundNum());

        Long leftId = match.getLeft();
        Long rightId = match.getRight();

        if (leftId != null) {
            Optional<Match> leftMatch = this.matches.findById(leftId);
            leftMatch.ifPresent(newMatch::setLeft);
        } else {
            match.setLeft(null);
        }

        if (rightId != null) {
            Optional<Match> rightMatch = this.matches.findById(rightId);
            rightMatch.ifPresent(newMatch::setRight);
        } else {
            match.setRight(null);
        }

        return this.matches.save(newMatch);
    }

    /**
     * Adds a new tournament's matches to the repository.
     *
     * @param tournament The CreateTournament object containing the details of the tournament to be added.
     * @return A list of the newly added Match objects.
     */
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

    /**
     * Adds base matches to the tournament.
     *
     * @param tournament The CreateTournament object containing the details of the tournament.
     * @param res The list to store the added Match objects.
     * @param q The deque to store the added Match objects for further processing.
     * @param numMatchesAtBase The number of matches at the base level.
     */
    private void addBaseMatches(CreateTournament tournament, List<Match> res, Deque<Match> q, int numMatchesAtBase) {
        for (int i = 0; i < numMatchesAtBase; i++) {
            MatchJson newMatch = tournament.getMatches().get(i);
            newMatch.setRoundNum(numMatchesAtBase * 2);

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

    /**
     * Adds remaining matches to the tournament.
     *
     * @param tournament The CreateTournament object containing the details of the tournament.
     * @param res The list to store the added Match objects.
     * @param q The deque to store the added Match objects for further processing.
     * @param numMatchesAtBase The number of matches at the base level.
     */
    private void addRemainingMatches(CreateTournament tournament, List<Match> res, Deque<Match> q, int numMatchesAtBase) {
        ListIterator<MatchJson> iterator = tournament.getMatches().listIterator(numMatchesAtBase);
        while (iterator.hasNext()) {
            int step = q.size();
            for (int i = 0; i < step / 2; i++) {
                Match leftMatch = q.poll();
                Match rightMatch = q.poll();

                if (!iterator.hasNext()) {
                    break;
                }

                MatchJson matchToAdd = setChildMatchesAndPlayers(iterator.next(), leftMatch, rightMatch);
                matchToAdd.setRoundNum(step);

                Match match = this.addMatch(matchToAdd);
                res.add(match);
                q.add(match);
            }
        }
    }

    /**
     * Sets the child matches and players for a given match if previous match has a winner.
     *
     * @param matchToAdd The MatchJson object to add to the repository.
     * @param leftMatch The left child match.
     * @param rightMatch The right child match.
     * @return The MatchJson object with the child matches and players set.
     */
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

    /**
     * Sets the winner of a match and updates the parent match with the winner.
     *
     * @param matchId The ID of the match to update.
     * @param player1Wins A boolean indicating if player 1 is the winner.
     * @return The updated Match object, or null if the match is not found.
     */
    @Override
    public Match setWinnerAndUpdateParent(Long matchId, boolean player1Wins) {
        Match match = setWinner(matchId, player1Wins);
        if (match != null) {
            updateParentMatch(match, match.getWinnerId());
        }
        return match;
    }

    /**
     * Sets the winner of a match
     *
     * @param matchId The ID of the match to update.
     * @param player1Wins A boolean indicating if player 1 is the winner.
     * @return The updated Match object, or null if the match is not found.
     */
    private Match setWinner(Long matchId, boolean player1Wins) {
        Optional<Match> optionalMatch = this.matches.findById(matchId);
        if (!optionalMatch.isPresent()) {
            return null;
        }

        Match match = optionalMatch.get();
        String winnerId = player1Wins ? match.getPlayer1Id() : match.getPlayer2Id();

        match.setWinnerId(winnerId);
        this.matches.save(match);
        return match;
    }

    /**
     * Updates the parent match with the winner of a match
     *
     * @param match The match to update the parent match for
     * @param winnerId The ID of the winner of the match
     */
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

    /**
     * Finds the parent match of a given match
     *
     * @param matches The list of matches to search
     * @param matchId The ID of the match to find the parent of
     * @return The parent match of the given match, or null if not found
     */
    private Match findParentMatch(List<Match> matches, Long matchId) {
        for (Match match : matches) {
            if ((match.getLeft() != null && match.getLeft().getId().equals(matchId)) ||
                    (match.getRight() != null && match.getRight().getId().equals(matchId))) {
                return match;
            }
        }
        return null;
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

    /**
     * Remove all Matches with the given tournament id
     * Spring Data JPA does not return a value for delete operation
     * Cascading: removing a Tournament will also remove all its associated matches and games
     */
    @Override
    @Transactional
    public void deleteTournament(Long id) {
        this.matches.deleteGamesByTournamentId(id);
        this.matches.deleteByTournamentId(id);
    }
}