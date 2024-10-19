package com.tms.user;

import com.tms.rating.Rating;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
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

    private String role;
    
    private String country; 

    private String profilePicture;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Rating rating;
}
