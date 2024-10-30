package com.tms.player;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Player {
    private String id;
    private String username;
    private String fullname;
    private String gender;
    private String email;
    private String role;
    private String country;
    private String profilePicture;
    private Rating rating;
    private Number rank;

    public Player(String id, Rating rating) {
        this.id = id;
        this.rating = rating;
    }
}
