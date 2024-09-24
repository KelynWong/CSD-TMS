package com.tms.match;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.tms.game.Game;

import jakarta.persistence.*;
import lombok.*;

@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Data
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView({Views.Public.class, Views.Internal.class})
    private Long id;

    @JsonView({Views.Public.class, Views.Internal.class})
    private long tournamentId;

    @JsonView({Views.Public.class, Views.Internal.class})
    private long player1Id;

    @JsonView({Views.Public.class, Views.Internal.class})
    private long player2Id;

    @JsonView({Views.Public.class, Views.Internal.class})
    private long winnerId;

    @ManyToOne
    @JoinColumn(name = "left_id")
    @JsonIgnore
    private Match left;

    @ManyToOne
    @JoinColumn(name = "right_id")
    @JsonIgnore
    private Match right;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonView(Views.Internal.class)
    private List<Game> games;
}
