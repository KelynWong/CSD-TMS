package com.tms.player;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Player {
    private String id;
    private String username;
    private String fullname;
    private String password;
    private String gender;
    private String email;
    private String role;
    private Integer rank;
    private String country;
    private String profilePicture;
}
