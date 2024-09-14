package com.tms.match;

import java.util.List;

import org.springframework.stereotype.Service;


@Service
public class MatchServiceImpl implements MatchService {
   
    private MatchRepository matches;
    

    public MatchServiceImpl(MatchRepository matches){
        this.matches = matches;
    }

    @Override
    public List<Match> listMatches() {
        return this.matches.findAll();
    }

    
    @Override
    public Match getMatch(Long id){
        return this.matches.findById(id).map(match -> {
            return match;
        }).orElse(null);
    }
    
    @Override
    public Match addMatch(Match Match) {
        return this.matches.save(Match);
    }
    
    @Override
    public Match updateMatch(Long id, Match newMatchInfo){
        return this.matches.findById(id).map(match -> {
            match.setTournamentId(newMatchInfo.getTournamentId());
            match.setRoundNum(newMatchInfo.getRoundNum());
            match.setMatchNum(newMatchInfo.getMatchNum());
            match.setPlayer1Username(newMatchInfo.getPlayer1Username());
            match.setPlayer1Fullname(newMatchInfo.getPlayer1Fullname());
            match.setPlayer2Username(newMatchInfo.getPlayer2Username());
            match.setPlayer2Fullname(newMatchInfo.getPlayer2Fullname());
            match.setWinnerUsername(newMatchInfo.getWinnerUsername());
            match.setWinnerFullname(newMatchInfo.getWinnerFullname());
            match.setGames(newMatchInfo.getGames());
            return this.matches.save(match);
        }).orElse(null);

        /*
        // You can also handle Optional objects in this way
        //
        Optional<Match> b = Matchs.findById(id);
        if (b.isPresent()){
            Match Match = b.get();
            Match.setTitle(newMatchInfo.getTitle());
            return Matchs.save(Match);
        }else
            return null;*/
    }

    /**
     * Remove a Match with the given id
     * Spring Data JPA does not return a value for delete operation
     * Cascading: removing a Match will also remove all its associated games
     */
    @Override
    public void deleteMatch(Long id){
        this.matches.deleteById(id);
    }
}