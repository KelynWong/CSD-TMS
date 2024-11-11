package com.tms;

import java.io.*;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tms.tournament.*;
import com.tms.tournamentplayer.*;

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

    // Purpose : create tournament obj
    public Tournament createTournamentObj(String typeOfErr) {

        // - mock tournament objects
        String tournamentName = "Tournament Controller Testing";
        LocalDateTime regStartDT = LocalDateTime.of(2024, 10, 01, 10, 00, 00);
        LocalDateTime regEndDT = LocalDateTime.of(2024, 10, 11, 10, 00, 00);
        LocalDateTime startDT = LocalDateTime.of(2024, 10, 21, 10, 00, 00);
        LocalDateTime endDT = LocalDateTime.of(2024, 10, 30, 10, 00, 00);
        String status = "Scheduled";
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
            case "nullStatus":
                tournament.setStatus(null);
                break;
            case "nullCreater":
                // no err - tournament is valid
                tournament.setCreatedBy(null);
                break;
            case "noError":
                // no err - tournament is valid
                tournament.setTournamentName("Tournament Controller Testing - Valid");
                break;
        }


        return tournament;
    }

    // Purpose : create player obj
    public Player createPlayerObj() {
        Player player = new Player("usertesting123", new ArrayList<>());
        return player;
    }

    // Purpsoe : map tournament and player (for controller testing)
    public void mapTournamentPlayerInDB(Tournament tournament, Player player) {
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

    // Purpose : log pass-in msg into out.txt
    public void log(String msg) {

        try (PrintStream out = new PrintStream(new FileOutputStream("out.txt", true))) {
            out.println("Raw JSON Response: " + msg); // write into out.txt
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    // Purpose : remove all mapping (for deleteAll in controller test)
    public void removeAllMapping() {

        List<Tournament> t_list = tournaments.findAll();
        for (Tournament t : t_list) {
            t.setPlayers(new ArrayList<>());
            tournaments.save(t);
        }

        List<Player> p_list = players.findAll();
        for (Player p : p_list) {
            p.setTournaments(new ArrayList<>());
            players.save(p);
        }
    }

}
