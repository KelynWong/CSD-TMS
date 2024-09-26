package com.tms.player;

import com.fasterxml.jackson.annotation.JsonView;
import com.tms.Views;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Player {
    @JsonView(Views.Public.class)
    private String id;

    @JsonView(Views.Get.class)
    private String username;

    @JsonView(Views.Get.class)
    private String fullname;

    @JsonView(Views.Get.class)
    private String password;

    @JsonView(Views.Get.class)
    private String gender;

    @JsonView(Views.Get.class)
    private String email;

    @JsonView(Views.Get.class)
    private String role;

    @JsonView(Views.Get.class)
    private Integer rank;

    @JsonView(Views.Get.class)
    private String country;

    @JsonView(Views.Get.class)
    private String profilePicture;
}
