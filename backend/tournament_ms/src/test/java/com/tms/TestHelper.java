package com.tms;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.stereotype.Component;

import com.tms.tournament.Tournament;
import com.tms.tournament.TournamentRepository;
import com.tms.tournamentplayer.Player;
import com.tms.tournamentplayer.PlayerRepository;

/* Class containing all test helper methods */
@Component
public class TestHelper {

    @Autowired
	private TournamentRepository tournaments;
	@Autowired
	private PlayerRepository players;

    @Autowired
    public TestHelper(TournamentRepository tr, PlayerRepository pr) {
        this.tournaments = tr;
        this.players = pr;
    }

    /* HELPER METHODS */
    public Tournament createTestTournament(String typeOfErr) { // no err - input "noError"

        // - mock tournament objects
        String tournamentName = "Tournament Controller Testing - Invalid";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        String status = "Registration Start";
        String createdBy = "admin1";
        String winner = null;

        Tournament tournament = new Tournament(tournamentName, startDT, endDT, status, regStartDT, regEndDT, createdBy,
                winner);

        // set up any specified error
        switch (typeOfErr) {
            case "emptyName":
                tournament.setTournamentName("");
                break;
            case "regEndDTBefRegStartDT":
                tournament.setRegStartDT(regEndDT);
                tournament.setRegEndDT(regStartDT);
                break;
            case "regEndDTAftStartDT":
                tournament.setStartDT(regEndDT);
                tournament.setRegEndDT(startDT);
                break;
            case "endDTBefStartDT":
                tournament.setStartDT(endDT);
                tournament.setEndDT(startDT);
                break;
            case "wrongStatus":
                tournament.setStatus("HAHAHAHA WRONG");
                break;
            case "noError":
                // no err - tournament is valid
                tournament.setTournamentName("Tournament Controller Testing - Valid");
                break;
        }

        return tournament;
    }

    public Player createTestPlayer() {
        return new Player("usertesting123", new ArrayList<>());
    }

    public void mapTournamentPlayer(Tournament tournament, Player player) {
        // map the player and tournament
        List<Player> playerList = new ArrayList<>();
        List<Tournament> tournamentList = new ArrayList<>();

        playerList.add(player);
        tournamentList.add(tournament);
        tournament.setPlayers(playerList);
        player.setTournaments(tournamentList);

        players.save(player);
        tournaments.save(tournament);
    }

    public void reset(Long t_id, String p_id) {

        if (t_id == null) {
            // if no tournament, just del player
            players.deleteById(p_id);
        } else if (p_id == null) {
            // if no player, just del tournament
            tournaments.deleteById(t_id);

        } else {
            // if got both
            Tournament t = tournaments.findById(t_id).get();
            Player p = players.findById(p_id).get();
            // - remove the mapping
            t.setPlayers(new ArrayList<>());
            p.setTournaments(new ArrayList<>());
            // - save the changes
            players.save(p);
            tournaments.save(t);
            // - delete both objects
            tournaments.deleteById(t_id);
            players.deleteById(p_id);
        }

    }

}
