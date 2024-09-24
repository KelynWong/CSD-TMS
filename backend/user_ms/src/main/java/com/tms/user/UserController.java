package com.tms.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tms.user.User;
import com.tms.user.UserService;

import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/top10")
    public ResponseEntity<List<User>> getTop10UsersByRank() {
        List<User> topUsers = userService.getTop10UsersByRank();
        return ResponseEntity.ok(topUsers);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new user
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Object> createUser(@RequestPart("user") String userJson,
                                            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(userJson, User.class);
            
            // Call your service to create the user
            String userString = userService.createUser(user, profilePicture);
            return ResponseEntity.ok(userString);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create user or upload profile picture: " + e.getMessage());
        }
    }

    // Update user by ID
    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Object> updateUser(@PathVariable Long id,
                                            @RequestPart("user") String userJson,
                                            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(userJson, User.class);
            user.setId(id); // Set the ID of the user to be updated
            
            // Call your service to update the user
            String userString = userService.updateUser(user, profilePicture);
            return ResponseEntity.ok(userString);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update user or upload profile picture: " + e.getMessage());
        }
    }


    // Delete user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
