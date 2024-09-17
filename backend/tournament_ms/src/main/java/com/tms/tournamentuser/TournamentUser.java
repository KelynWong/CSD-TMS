package com.tms.tournamentuser;

import javax.persistence.*;
import lombok.*;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TournamentUser {
    private long tournamentId;
    private String username;
}
