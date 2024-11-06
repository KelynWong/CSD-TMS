package com.tms.tournament;

import java.time.LocalDateTime;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms.tournamentplayer.Player;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @NotNull(message = "Tournament Name cannot be null")
    private String tournamentName;

    @NotNull(message = "Tournament start datetime cannot be null")
    private LocalDateTime startDT;

    @NotNull(message = "Tournament end datetime cannot be null")
    private LocalDateTime endDT;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Tournament status cannot be null")
    private TournamentStatus status = TournamentStatus.SCHEDULED;

    @NotNull(message = "Tournament registration start datetime cannot be null")
    private LocalDateTime regStartDT;

    @NotNull(message = "Tournament registration end datetime cannot be null")
    private LocalDateTime regEndDT;

    @NotNull(message = "Tournament creator cannot be null")
    private String createdBy;
    private String winner = null;

    @ManyToMany(mappedBy = "tournaments") // , cascade = CascadeType.ALL
    @JsonIgnore
    private List<Player> players = new ArrayList<>();

    // Custom Constructor
    public Tournament(String tournamentName, LocalDateTime startDT, LocalDateTime endDT, String status,
            LocalDateTime regStartDT, LocalDateTime regEndDT, String createdBy, String winner) {

        this.tournamentName = tournamentName;
        this.startDT = startDT;
        this.endDT = endDT;
        this.status = TournamentStatus.get(status);
        this.regStartDT = regStartDT;
        this.regEndDT = regEndDT;
        this.createdBy = createdBy;
        this.winner = winner;

    }

    // Custom Methods

    // Purpose : Map player to tournament
    public Player addPlayer(Player p) {
        this.players.add(p);
        p.getTournaments().add(this);
        return p;
    }

    // Purpose : Remove player to tournament mapping
    public Player removePlayer(Player p) {
        this.players.remove(p);
        p.getTournaments().remove(this);
        return p;
    }

    // Purpose : Check if player is in tournament
    public boolean isPlayerInTournament(Player p) {
        return this.players.contains(p);
    }

    // Purpose : Check if player is in tournament
    public boolean isPlayerInTournament(String p_id) {
        for (Player p : this.players) {
            if (p.getId().equals(p_id)) {
                return true;
            }
        }
        return false;
    }

    // Purpose : Remove all player to tournament mapping
    public void removeAllPlayers() {

        for (Player p : this.players) {
            p.getTournaments().remove(this);
        }

        this.players = new ArrayList<>();

    }

}
