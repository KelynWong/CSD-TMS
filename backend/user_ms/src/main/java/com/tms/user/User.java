package com.tms.user;

import javax.persistence.*;

@Entity
public class User {
    @Id
    private String id;

    @Column(unique = true)
    private String username;

    private String fullname;
    private String gender;

    @Column(unique = true)
    private String email;

    private String role;
    private Integer rank;
    
    private String country; 

    private String profilePicture;

    // Constructors
    public User() {}

    public User(String id, String username, String fullname, String gender, String email, String role, Integer rank, String country) {
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.gender = gender;
        this.email = email;
        this.role = role;
        this.rank = rank;
        this.country = country;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}
