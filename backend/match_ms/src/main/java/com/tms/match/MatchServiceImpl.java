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
    public MatchDTO getMatchWithGames(Long id) {
        Optional<Match> matchOptional = this.matches.findByIdWithGames(id);
        if (matchOptional.isPresent()) {
            Match match = matchOptional.get();
            MatchDTO matchDTO = new MatchDTO();
            matchDTO.setId(match.getId());
            matchDTO.setTournamentId(match.getTournamentId());
            matchDTO.setRoundNum(match.getRoundNum());
            matchDTO.setMatchNum(match.getMatchNum());
            matchDTO.setPlayer1Id(match.getPlayer1Id());
            matchDTO.setPlayer2Id(match.getPlayer2Id());
            matchDTO.setWinnerId(match.getWinnerId());
            matchDTO.setGames(match.getGames());
            return matchDTO;
        }
        return null;
    }

    @Override
    public List<Match> getMatchesByTournament(Long tournamentId) {
        return this.matches.findByTournamentId(tournamentId);
    }

    @Override
    public List<Match> getMatchWinsByUser(Long playerId) {
        return this.matches.findByWinnerId(playerId);
    }

    @Override
    public List<Match> getMatchLossByUser(Long playerId) {
        return this.matches.findByLoserId(playerId);
    }

    @Override
    public List<Match> getMatchesPlayedByUser(Long playerId) {
        return this.matches.findMatchesPlayedByPlayer(playerId);
    }

    @Override
    public Double getPlayerWinRate(Long playerId) {
        List<Match> winningMatches = this.matches.findByWinnerId(playerId);
        List<Match> allMatches = this.matches.findMatchesPlayedByPlayer(playerId);

        if (allMatches.size() == 0) {
            return 0.0; // Avoid division by zero
        }
        
        return (double) winningMatches.size() / allMatches.size();
    }

    @Override
    public Match addMatch(Match Match) {
        return this.matches.save(Match);
    }

    @Override
    public Match updateMatch(Long id, Match newMatchInfo) {
        return this.matches.findById(id).map(match -> {
            match.setTournamentId(newMatchInfo.getTournamentId());
            match.setRoundNum(newMatchInfo.getRoundNum());
            match.setMatchNum(newMatchInfo.getMatchNum());
            match.setPlayer1Id(newMatchInfo.getPlayer1Id());
            match.setPlayer2Id(newMatchInfo.getPlayer2Id());
            match.setGames(newMatchInfo.getGames());
            return this.matches.save(match);
        }).orElse(null);

        /*
         * // You can also handle Optional objects in this way
         * //
         * Optional<Match> b = Matchs.findById(id);
         * if (b.isPresent()){
         * Match Match = b.get();
         * Match.setTitle(newMatchInfo.getTitle());
         * return Matchs.save(Match);
         * }else
         * return null;
         */
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
}