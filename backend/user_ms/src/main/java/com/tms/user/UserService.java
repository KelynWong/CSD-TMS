package com.tms.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;

@Service
public class UserService {

    private final SupabaseClient supabaseClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public UserService(SupabaseClient supabaseClient, ObjectMapper objectMapper) {
        this.supabaseClient = supabaseClient;
        this.objectMapper = objectMapper;
    }

    // Get all users
    public List<User> getAllUsers() {
        try {
            String response = supabaseClient.getUsers();
            return Arrays.asList(objectMapper.readValue(response, User[].class));
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    // Get user by ID 
    public Optional<User> getUserById(Long id) {
        try {
            String response = supabaseClient.getUserById(id); 
            User[] usersArray = objectMapper.readValue(response, User[].class);
            if (usersArray.length > 0) {
                return Optional.of(usersArray[0]);
            } else {
                return Optional.empty();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    // Create a new user
    public User createUser(User user) {
        try {
            String userJson = objectMapper.writeValueAsString(user);
            String response = supabaseClient.createUser(userJson);
            return objectMapper.readValue(response, User.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update user by ID 
    public User updateUser(Long id, User user) {
        try {
            String userJson = objectMapper.writeValueAsString(user);
            String response = supabaseClient.updateUser(id, userJson); 
            
            return objectMapper.readValue(response, User.class); 
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Delete user by ID 
    public void deleteUser(Long id) {
        try {
            supabaseClient.deleteUser(id); 
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
