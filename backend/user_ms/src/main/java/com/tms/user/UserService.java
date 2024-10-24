package com.tms.user;

import com.tms.exception.UserAlreadyExistsException;
import com.tms.rating.RatingService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RatingService ratingService;

    public UserService(UserRepository userRepository, RatingService ratingService) {
        this.userRepository = userRepository;
        this.ratingService = ratingService;
    }

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
        return userRepository.findByIdInOrderByRatingDesc(ids);
    }

    public Page<User> getTopPlayers(Pageable pageable) {
        Pageable sortedByRatingDesc = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize()
        );
//        return userRepository.findAll(sortedByRatingDesc);
        return userRepository.findAllOrderByRatingDesc(sortedByRatingDesc);
    }

    public User createUser(User user, MultipartFile profilePicture) {
        userRepository.findById(user.getId()).ifPresent(u -> {
            throw new UserAlreadyExistsException("User with id " + u.getId() + " already exists");
        });
        User createdUser = userRepository.save(user);
        ratingService.initRating(createdUser.getId());
        return createdUser;
    }

    public User updateUser(String id, User updatedUser, MultipartFile profilePicture) { 
        return userRepository.findById(id)
            .map(user -> {
                if (updatedUser.getUsername() != null) {
                    user.setUsername(updatedUser.getUsername());
                }
                if (updatedUser.getFullname() != null) {
                    user.setFullname(updatedUser.getFullname());
                }
                if (updatedUser.getGender() != null) {
                    user.setGender(updatedUser.getGender());
                }
                if (updatedUser.getEmail() != null) {
                    user.setEmail(updatedUser.getEmail());
                }
                if (updatedUser.getRole() != null) {
                    user.setRole(updatedUser.getRole());
                }
                if (updatedUser.getCountry() != null) {
                    user.setCountry(updatedUser.getCountry());
                }
                if (updatedUser.getProfilePicture() != null) {
                    user.setProfilePicture(updatedUser.getProfilePicture()); 
                }
                return userRepository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("User not found"));
    }    

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRoleIgnoreCase(role);
    }

    public void deleteUser(String id) { 
        if (userRepository.findById(id).isPresent()){
            userRepository.deleteById(id);
            ratingService.deleteRating(id);
        }
    }
}
