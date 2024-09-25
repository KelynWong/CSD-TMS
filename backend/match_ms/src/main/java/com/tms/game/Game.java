package com.tms.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms.match.Match;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Game {
    private  @Id @GeneratedValue (strategy = GenerationType.IDENTITY) Long id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    @JsonIgnore
    private Match match;
    private short setNum;
    private short player1Score;
    private short player2Score;
}
