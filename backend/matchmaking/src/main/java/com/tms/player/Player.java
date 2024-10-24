package com.tms.player;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class Player {
    private final String id;
    private String username;
    private String fullname;
    private String gender;
    private String email;
    private String role;
    private String country;
    private String profilePicture;
    private final Rating rating;
}
