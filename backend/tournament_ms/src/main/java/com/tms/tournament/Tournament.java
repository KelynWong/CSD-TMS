package com.tms.tournament;

import java.time.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tms.tournamentplayer.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Tournament {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private long id;
    private String tournamentName;
    private LocalDateTime startDT;
    private LocalDateTime endDT;
    private String status; 
    private LocalDateTime regStartDT;
    private LocalDateTime regEndDT;

    // CascadeType.ALL: to propagate (cascade) all persistence operations to relating entities
    // E.g., remove a book -> all associated reviews removed
    // orphanRemoval = true: any disconnected entity instances are automatically removed
    // E.g., to clean up dependent objects (reviews) that should not exist without a refererence from the owner object (book)
    // @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    // @JsonIgnore
    // // Ignore the field in both JSON serialization and deserialization
    // private List<Player> Players;

    @ManyToMany(mappedBy = "tournaments")
    @JsonIgnore
    private List<Player> players;

    // private String[] statusArr = new String[] {"Scheduled", "Registration Start", "Registration Close", "In Progress", "Completed"};

}
