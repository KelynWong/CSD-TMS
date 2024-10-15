package com.tms.game;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tms.exceptions.GameNotFoundException;
import com.tms.exceptions.MatchNotFoundException;
import com.tms.match.Match;
import com.tms.match.MatchRepository;

@Service
public class GameService {

    @Autowired
    private GameRepository games;

    @Autowired
    private MatchRepository matches;

    public List<Game> getAllGamesByMatchId(Long matchId) {
        if (!matches.existsById(matchId)) {
            throw new MatchNotFoundException(matchId);
        }
        return games.findByMatchId(matchId);
    }

    public Game addGame(Long matchId, Game game) {
        return matches.findById(matchId)
                .map(match -> {
                    game.setMatch(match);
                    return games.save(game);
                })
                .orElseThrow(() -> new MatchNotFoundException(matchId));
    }

    public Game updateGame(Long matchId, Long gameId, Game newGame) {
        Optional<Match> optionalMatch = matches.findById(matchId);
        Match match = optionalMatch.orElseThrow(() -> new MatchNotFoundException(matchId));

        return games.findByIdAndMatchId(gameId, matchId).map(game -> {
            game.setSetNum(newGame.getSetNum());
            game.setPlayer1Score(newGame.getPlayer1Score());
            game.setPlayer2Score(newGame.getPlayer2Score());
            game.setMatch(match);
            return games.save(game);
        }).orElseThrow(() -> new GameNotFoundException(gameId));
    }

    public Game deleteGame(Long matchId, Long gameId) {
        if (!matches.existsById(matchId)) {
            throw new MatchNotFoundException(matchId);
        }
    
        Optional<Game> gameOptional = games.findByIdAndMatchId(gameId, matchId);
        gameOptional.ifPresent(games::delete);
        return gameOptional.orElseThrow(() -> new GameNotFoundException(gameId));
    }
}
