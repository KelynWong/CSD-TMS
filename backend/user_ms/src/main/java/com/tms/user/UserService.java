package com.tms.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.Optional;
import java.io.IOException;
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

    // Get top 10 users by rank
    public List<User> getTop10UsersByRank() {
        try {
            String response = supabaseClient.getTop10UsersByRank();
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
    public String createUser(User user, MultipartFile file) throws IOException, InterruptedException {
        try {
            // Upload the profile picture and set the URL in the user object
            if (file != null && !file.isEmpty()) {
                String profilePictureUrl = supabaseClient.uploadProfilePicture(file, user.getUsername());
                user.setProfilePicture(profilePictureUrl);
            }

            // Convert the user object to JSON
            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode userNode = objectMapper.valueToTree(user);

            // Remove the "id" field from the JSON
            userNode.remove("id");

            // Convert the modified JSON back to a string
            String userJson = objectMapper.writeValueAsString(userNode);

            // Send the modified JSON to the Supabase client for insertion
            String response = supabaseClient.createUser(userJson);
            return userJson;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update user by ID 
    public String updateUser(User user, MultipartFile file) throws IOException, InterruptedException {
        try {
            // Upload the profile picture and set the URL in the user object
            if (file != null && !file.isEmpty()) {
                String profilePictureUrl = supabaseClient.uploadProfilePicture(file, user.getUsername());
                user.setProfilePicture(profilePictureUrl);
            }
    
            // Convert the user object to JSON
            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode userNode = objectMapper.valueToTree(user);
    
            // Convert the modified JSON back to a string
            String userJson = objectMapper.writeValueAsString(userNode);
    
            // Send the modified JSON to the Supabase client for updating
            String response = supabaseClient.updateUser(user.getId(), userJson);
            return userJson;
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
