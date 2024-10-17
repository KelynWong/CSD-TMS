package com.tms.game;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.MethodArgumentNotValidException;

import com.tms.exceptions.GameNotFoundException;
import com.tms.exceptions.MatchNotFoundException;
import com.tms.match.Match;
import com.tms.match.MatchRepository;
import com.tms.match.MatchService;

@Service
public class GameService {

    @Autowired
    private GameRepository games;

    @Autowired
    private MatchRepository matches;

    @Autowired
    private MatchService matchService;

    public List<Game> getAllGamesByMatchId(Long matchId) {
        if (!matches.existsById(matchId)) {
            throw new MatchNotFoundException(matchId);
        }
        return games.findByMatchId(matchId);
    }

    @Transactional
    public Match addGames(Long matchId, List<Game> gamesToAdd) {
        if (this.getAllGamesByMatchId(matchId).size() > 0) {
            throw new IllegalArgumentException("Games already exist for this match. Use PUT to update games.");
        }

        for (Game game : gamesToAdd) {
            if (!validateGame(game)) {
                throw new IllegalArgumentException("Invalid game data");
            }
        }

        boolean player1Wins = checkWinner(gamesToAdd);
        Match match = matchService.setWinnerAndUpdateParent(matchId, player1Wins);

        for (Game game : gamesToAdd) {
            game.setMatch(match);
            games.save(game);
        }

        return match;

    }

    public Game updateGame(Long matchId, Long gameId, Game newGame) {
        if (!validateGame(newGame)) {
            throw new IllegalArgumentException("Invalid game data");
        }

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

    @Transactional
    public void createGames() {
        List<Match> matches = this.matches.findAll();
        Random random = new Random();
        for (Match match : matches) {
            List<Game> existingGames = this.getAllGamesByMatchId(match.getId());
            if (!existingGames.isEmpty()) {
                continue; // Skip this match if games already exist
            }

            int numGames = random.nextInt(2) + 2; // 2 or 3 games
            int player2Win = 0;

            if (numGames == 3) {
                player2Win = random.nextInt(2); // choose game that player2 wins
            }
            for (int i = 0; i < numGames; i++) {
                Game game = new Game();
                game.setMatch(match);
                game.setSetNum((short) (i + 1));

                if (numGames == 2) {
                    // only player1 can win
                    game.setPlayer1Score((short) 21);
                    game.setPlayer2Score((short) (random.nextInt(10) + 10));
                } else if (numGames == 3) {
                    if (i == player2Win) {
                        // Player2 wins this game
                        game.setPlayer1Score((short) (random.nextInt(10) + 10));
                        game.setPlayer2Score((short) 21);
                    } else {
                        // Player1 wins this game
                        game.setPlayer1Score((short) 21);
                        game.setPlayer2Score((short) (random.nextInt(10) + 10));
                    }
                }
                games.save(game);
            }
        }
    }

    private boolean validateGame(Game game) {
        boolean setCheck = game.getSetNum() > 0 && game.getSetNum() <= 3;

        int p1Score = game.getPlayer1Score();
        int p2Score = game.getPlayer2Score();

        boolean scoreCheck = (p1Score == 30 && p2Score == 29) ||
                (p2Score == 30 && p1Score == 29) ||
                ((p1Score >= 20 && p2Score >= 20) && Math.abs(p1Score - p2Score) == 2) ||
                ((p1Score == 21 && p2Score >= 0 && p2Score < 20) || 
                    (p2Score == 21 && p1Score >= 0 && p1Score < 20));

        return setCheck && scoreCheck;
    }

    private boolean checkWinner(List<Game> gamesToAdd) {
        int player1Wins = 0;
        int player2Wins = 0;
        for (Game game : gamesToAdd) {
            if (game.getPlayer1Score() > game.getPlayer2Score()) {
                player1Wins++;
            } else {
                player2Wins++;
            }
        }

        return player1Wins > player2Wins ? true : false;
    }
}
