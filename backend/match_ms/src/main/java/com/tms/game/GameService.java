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
     * Retrieves all games associated with a given match ID.
     *
     * @param matchId The ID of the match for which to retrieve games.
     * @return A list of Game objects associated with the specified match ID.
     * @throws MatchNotFoundException if no match with the given ID is found.
     */
    public List<Game> getAllGamesByMatchId(Long matchId) {
        if (!matches.existsById(matchId)) {
            throw new MatchNotFoundException(matchId);
        }
        return games.findByMatchId(matchId);
    }

    /**
     * Adds a list of games to a match. Winner needs to win 2 games.
     *
     * @param matchId    The ID of the match to which to add games.
     * @param gamesToAdd A list of Game objects to add to the match.
     * @return A MatchJson object representing the updated match.
     * @throws IllegalArgumentException if the number of games is not 2 or 3, if the set number or scores are invalid, or if a player has already won in 2 games but 3 games are provided.
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

    /**
     * Validates the games to be added to a match.
     *
     * @param matchId    The ID of the match to which to add games.
     * @param gamesToAdd A list of Game objects to add to the match.
     * @throws IllegalArgumentException if the number of games is not 2 or 3, if the set number or scores are invalid, or if a player has already won in 2 games but 3 games are provided.
     */
    private void validateGames(Long matchId, List<Game> gamesToAdd) {
        ensureNoExistingGames(matchId);
        ensureValidNumberOfGames(gamesToAdd);
        gamesToAdd.forEach(this::validateGame);
    }

    /**
     * Ensures that no games already exist for a given match ID.
     *
     * @param matchId The ID of the match for which to check for existing games.
     * @throws IllegalArgumentException if games already exist for the specified match ID.
     */
    private void ensureNoExistingGames(Long matchId) {
        if (!this.getAllGamesByMatchId(matchId).isEmpty()) {
            throw new IllegalArgumentException("Games already exist for this match. Use PUT to update games.");
        }
    }

    /**
     * Ensures that the number of games to be added is either 2 or 3.
     *
     * @param gamesToAdd A list of Game objects to add to the match.
     * @throws IllegalArgumentException if the number of games is not 2 or 3.
     */
    private void ensureValidNumberOfGames(List<Game> gamesToAdd) {
        if (gamesToAdd.size() != 2 && gamesToAdd.size() != 3) {
            throw new IllegalArgumentException("Invalid number of games");
        }
    }

    /**
     * Validates a game to be added to a match.
     *
     * @param game The Game object to validate.
     * @throws IllegalArgumentException if the set number or scores are invalid.
     */
    private void validateGame(Game game) {
        if (!isSetNumberValid(game.getSetNum()) || !isScoreValid(game.getPlayer1Score(), game.getPlayer2Score())) {
            throw new IllegalArgumentException("Invalid game data");
        }
    }

    /**
     * Checks if the set number is valid.
     *
     * @param setNum The set number to check.
     * @return true if the set number is valid, false otherwise.
     */
    private boolean isSetNumberValid(int setNum) {
        return setNum > 0 && setNum <= 3;
    }

    /**
     * Checks if the scores are valid. Player must win by at least 2 points unless the score is 29-30.
     *
     * @param p1Score The score of player 1.
     * @param p2Score The score of player 2.
     * @return true if the scores are valid, false otherwise.
     */
    private boolean isScoreValid(int p1Score, int p2Score) {
        return (p1Score == 30 && p2Score == 29) ||
                (p2Score == 30 && p1Score == 29) ||
                ((p1Score >= 20 && p2Score >= 20) && Math.abs(p1Score - p2Score) == 2) ||
                ((p1Score == 21 && p2Score >= 0 && p2Score < 20) ||
                        (p2Score == 21 && p1Score >= 0 && p1Score < 20));
    }

    /**
     * Checks which player wins the match.
     *
     * @param gamesToAdd A list of Game objects to check.
     * @return true if player 1 has won in 2 games, false otherwise.
     * @throws IllegalArgumentException if a player has already won in 2 games but 3 games are provided.
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

    /**
     * Updates a game associated with a given match ID.
     *
     * @param matchId The ID of the match to which the game belongs.
     * @param gameId  The ID of the game to update.
     * @param newGame The updated Game object.
     * @return The updated Game object.
     * @throws MatchNotFoundException if no match with the given ID is found.
     * @throws GameNotFoundException  if no game with the given ID is found.
     */
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

    /**
     * Deletes a game associated with a given match ID.
     *
     * @param matchId The ID of the match to which the game belongs.
     * @param gameId  The ID of the game to delete.
     * @return The deleted Game object.
     * @throws MatchNotFoundException if no match with the given ID is found.
     * @throws GameNotFoundException  if no game with the given ID is found.
     */
    public Game deleteGame(Long matchId, Long gameId) {
        if (!matches.existsById(matchId)) {
            throw new MatchNotFoundException(matchId);
        }

        Optional<Game> gameOptional = games.findByIdAndMatchId(gameId, matchId);
        gameOptional.ifPresent(games::delete);
        return gameOptional.orElseThrow(() -> new GameNotFoundException(gameId));
    }

}
