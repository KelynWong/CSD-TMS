package com.tms.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getUserById(String id) { 
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getUsersByIds(List<String> ids) { 
        return userRepository.findByIdIn(ids);
    }

    public User createUser(User user, MultipartFile profilePicture) {
        return userRepository.save(user);
    }

    public User updateUser(String id, User updatedUser, MultipartFile profilePicture) { 
        return userRepository.findById(id)
            .map(user -> {
                user.setUsername(updatedUser.getUsername());
                user.setRole(updatedUser.getRole());
                // Update other fields
                return userRepository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRoleIgnoreCase(role);
    }

    public void deleteUser(String id) { 
        userRepository.deleteById(id);
    }
}
