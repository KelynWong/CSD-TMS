package com.tms.user;

import javax.persistence.*;

@Entity
public class User {
    @Column(unique = true)
    private String username;

    private String fullname;
    private String password;
    private String gender;
    
    @Column(unique = true)
    private String email;
    
    private String role;
    
    private Integer rank;

    // Constructors
    public User() {}

    public User(String username, String fullname, String password, String gender, String email, String role, Integer rank) {
        this.username = username;
        this.fullname = fullname;
        this.password = password;
        this.gender = gender;
        this.email = email;
        this.role = role;
        this.rank = rank;
    }

    // Getters and Setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
}