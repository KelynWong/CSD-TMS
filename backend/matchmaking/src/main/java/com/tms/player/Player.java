package com.tms.player;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
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
}
