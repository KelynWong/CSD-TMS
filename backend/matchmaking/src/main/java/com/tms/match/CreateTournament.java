package com.tms.match;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateTournament {
    private List<MatchJson> matches;
    private double numMatchesAtBase;
}
