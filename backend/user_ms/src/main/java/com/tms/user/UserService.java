package com.tms.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tms.exception.UserNotFoundException;
import com.tms.exception.UserAlreadyExistsException;
import com.tms.exception.InvalidUserException;
import com.tms.exception.FileUploadException;
import com.tms.exception.SupabaseClientException;

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
        } catch (IOException e) {
            throw new SupabaseClientException("Error fetching users", e);
        }
    }

    // Get top 10 users by rank
    public List<User> getTop10UsersByRank() {
        try {
            String response = supabaseClient.getTop10UsersByRank();
            return Arrays.asList(objectMapper.readValue(response, User[].class));
        } catch (IOException e) {
            throw new SupabaseClientException("Error fetching top 10 users", e);
        }
    }

    public Optional<User> getUserByUsername(String username) {
        try {
            String response = supabaseClient.getUserByUsername(username);
            User[] usersArray = objectMapper.readValue(response, User[].class);
            if (usersArray.length > 0) {
                return Optional.of(usersArray[0]);
            } else {
                return Optional.empty(); 
            }
        } catch (IOException e) {
            throw new SupabaseClientException("Error fetching user by username", e);
        }
    }    

    // Get user by ID
    public Optional<User> getUserById(String id) {
        try {
            String response = supabaseClient.getUserById(id);
            User[] usersArray = objectMapper.readValue(response, User[].class);
            if (usersArray.length > 0) {
                return Optional.of(usersArray[0]);
            } else {
                return Optional.empty();
            }
        } catch (IOException e) {
            throw new SupabaseClientException("Error fetching user by ID", e);
        }
    }

    // Get users by a list of IDs
    public List<User> getUsersByIds(List<String> ids) {
        try {
            String response = supabaseClient.getUsersByIds(ids);
            return Arrays.asList(objectMapper.readValue(response, User[].class));
        } catch (IOException e) {
            throw new SupabaseClientException("Error fetching users by IDs", e);
        }
    }

    // Get users by role
    public List<User> getUsersByRole(String role) {
        try {
            String response = supabaseClient.getUsersByRole(role);
            User[] usersArray = objectMapper.readValue(response, User[].class);
            return Arrays.asList(usersArray);
        } catch (IOException e) {
            throw new SupabaseClientException("Error fetching users by role", e);
        }
    }    

    // Create a new user
    public String createUser(User user, MultipartFile file) {
        try {
            // Validate user data
            if (user.getUsername() == null || user.getUsername().isEmpty()) {
                throw new InvalidUserException("Invalid username");
            }
    
            // Check if the username already exists
            Optional<User> existingUserByUsername = getUserByUsername(user.getUsername());
            if (existingUserByUsername.isPresent()) {
                throw new UserAlreadyExistsException("User with username " + user.getUsername() + " already exists");
            }

            // Check if user already exists by ID
            Optional<User> existingUserById = getUserById(user.getId());
            if (existingUserById.isPresent()) {
                throw new UserAlreadyExistsException("User with ID " + user.getId() + " already exists");
            }
    
            // Upload the profile picture and set the URL in the user object
            if (file != null && !file.isEmpty()) {
                String profilePictureUrl = supabaseClient.uploadProfilePicture(file, user.getUsername());
                user.setProfilePicture(profilePictureUrl);
            }
    
            // Convert user object to JSON
            ObjectNode userNode = objectMapper.valueToTree(user);
            String userJson = objectMapper.writeValueAsString(userNode);
    
            // Send to Supabase for creation
            String response = supabaseClient.createUser(userJson);
            return userJson;
        } catch (Exception e) {
            e.printStackTrace();
            throw new SupabaseClientException("Error creating user", e);
        }
    }    

    // Update user by ID
    public String updateUser(User user, MultipartFile file) {
        try {
            // Validate user data
            if (user.getUsername() == null || user.getUsername().isEmpty()) {
                throw new InvalidUserException("Invalid username");
            }

            // Upload profile picture if provided
            if (file != null && !file.isEmpty()) {
                try {
                    String profilePictureUrl = supabaseClient.uploadProfilePicture(file, user.getUsername());
                    user.setProfilePicture(profilePictureUrl);
                } catch (Exception e) {
                    throw new FileUploadException("Error uploading profile picture", e);
                }
            }

            // Convert user object to JSON
            ObjectNode userNode = objectMapper.valueToTree(user);
            String userJson = objectMapper.writeValueAsString(userNode);

            // Send to Supabase for update
            String response = supabaseClient.updateUser(user.getId(), userJson);
            return userJson;
        } catch (Exception e) {
            throw new SupabaseClientException("Error updating user", e);
        }
    }
    

    // Delete user by ID
    public void deleteUser(String id) {
        try {
            // Check if user exists before deletion
            Optional<User> user = getUserById(id);
            if (user.isPresent()) {
                supabaseClient.deleteUser(id);
            } else {
                throw new UserNotFoundException("User with ID " + id + " not found");
            }
        } catch (Exception e) {
            throw new SupabaseClientException("Error deleting user", e);
        }
    }
}
