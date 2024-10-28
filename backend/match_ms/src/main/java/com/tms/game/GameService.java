package com.tms.game;

import com.tms.exceptions.GameNotFoundException;
import com.tms.exceptions.MatchNotFoundException;
import com.tms.match.Match;
import com.tms.match.MatchJson;
import com.tms.match.MatchRepository;
import com.tms.match.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    @Autowired
    private GameRepository games;

    @Autowired
    private MatchRepository matches;

    @Autowired
    private MatchService matchService;

    /**
     * @param matchId
     * @return
     */
    public List<Game> getAllGamesByMatchId(Long matchId) {
        if (!matches.existsById(matchId)) {
            throw new MatchNotFoundException(matchId);
        }
        return games.findByMatchId(matchId);
    }

    /**
     * @param matchId
     * @param gamesToAdd
     * @return
     */
    @Transactional
    public MatchJson addGames(Long matchId, List<Game> gamesToAdd) {
        validateGames(matchId, gamesToAdd);
        boolean player1Wins = checkWinner(gamesToAdd);

        Match match = matchService.setWinnerAndUpdateParent(matchId, player1Wins);

        for (Game game : gamesToAdd) {
            game.setMatch(match);
            games.save(game);
        }

        return new MatchJson(match);
    }

    private void validateGames(Long matchId, List<Game> gamesToAdd) {
        ensureNoExistingGames(matchId);
        ensureValidNumberOfGames(gamesToAdd);
        gamesToAdd.forEach(this::validateGame);
    }

    private void ensureNoExistingGames(Long matchId) {
        if (!this.getAllGamesByMatchId(matchId).isEmpty()) {
            throw new IllegalArgumentException("Games already exist for this match. Use PUT to update games.");
        }
    }

    private void ensureValidNumberOfGames(List<Game> gamesToAdd) {
        if (gamesToAdd.size() != 2 && gamesToAdd.size() != 3) {
            throw new IllegalArgumentException("Invalid number of games");
        }
    }

    private void validateGame(Game game) {
        if (!isSetNumberValid(game.getSetNum()) || !isScoreValid(game.getPlayer1Score(), game.getPlayer2Score())) {
            throw new IllegalArgumentException("Invalid game data");
        }
    }

    private boolean isSetNumberValid(int setNum) {
        return setNum > 0 && setNum <= 3;
    }

    private boolean isScoreValid(int p1Score, int p2Score) {
        return (p1Score == 30 && p2Score == 29) ||
                (p2Score == 30 && p1Score == 29) ||
                ((p1Score >= 20 && p2Score >= 20) && Math.abs(p1Score - p2Score) == 2) ||
                ((p1Score == 21 && p2Score >= 0 && p2Score < 20) ||
                        (p2Score == 21 && p1Score >= 0 && p1Score < 20));
    }

    /**
     * @param gamesToAdd
     * @return
     */
    private boolean checkWinner(List<Game> gamesToAdd) {
        int player1Wins = 0;
        int player2Wins = 0;

        for (int i = 0; i < gamesToAdd.size(); i++) {
            Game game = gamesToAdd.get(i);
            if ((player1Wins == 2 || player2Wins == 2) && i == 2) {
                throw new IllegalArgumentException("A player has already won in 2 games but 3 games are provided.");
            }

            if (game.getPlayer1Score() > game.getPlayer2Score()) {
                player1Wins++;
            } else {
                player2Wins++;
            }

        }

        return player1Wins > player2Wins;
    }

    public Game updateGame(Long matchId, Long gameId, Game newGame) {
        validateGame(newGame);

        Optional<Match> optionalMatch = matches.findById(matchId);
        if (!optionalMatch.isPresent()) {
            throw new MatchNotFoundException(matchId);
        }
        Match match = optionalMatch.get();

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
