package com.tms.user;

import com.tms.rating.Rating;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "\"user\"", schema = "\"user\"")
public class User {
    @Id
    private String id;

    @Column(unique = true)
    private String username;

    private String fullname;

    private String gender;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;
    
    private String country;

    private String profilePicture;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Rating rating;

    @Transient
    private Number rank;

    public User(String id, Role role) {
        this.id = id;
        this.role = role;
    }

}
