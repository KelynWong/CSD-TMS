package com.tms.match;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.tms.game.Game;

import jakarta.persistence.*;
import lombok.*;

@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView({Views.Public.class})
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
    @JsonView({Views.Patch.class, Views.Public.class})
    private Match left;

    @ManyToOne
    @JoinColumn(name = "right_id")
    @JsonView({Views.Patch.class, Views.Public.class})
    private Match right;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonView(Views.Internal.class)
    private List<Game> games;
}
