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

    public List<User> getAllUsers() {
        try {
            String response = supabaseClient.getUsers();
            return Arrays.asList(objectMapper.readValue(response, User[].class));
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
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
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }  

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

    public User updateUser(String username, User user) {
        try {
            String userJson = objectMapper.writeValueAsString(user);
            String response = supabaseClient.updateUser(username, userJson);
            
            return user; 
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    

    public void deleteUser(String username) {
        try {
            supabaseClient.deleteUser(String.valueOf(username));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}