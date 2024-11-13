package com.tms.user;

import com.tms.exception.RatingNotFoundException;
import com.tms.exception.UserAlreadyExistsException;
import com.tms.exception.UserNotFoundException;
import com.tms.rating.RatingService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        return userRepository.findById(id)
            .map(this::enrichUserWithRankIfNotAdmin)
            .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));
    }
    
    public List<User> getUsersByIds(List<String> ids) {
        List<User> players = userRepository.findByIdInOrderByRatingDesc(ids);
        Map<String, Number> playerToRank = getPlayerRanksMap(ids);
    
        players.forEach(player -> player.setRank(playerToRank.getOrDefault(player.getId(), null)));
        return players;
    }
    
    public List<User> getTopPlayers() {
        List<Object[]> results = userRepository.findAllOrderByRatingDesc();
        return results.stream()
            .map(result -> enrichUserWithRank((User) result[0], (Long) result[1]))
            .collect(Collectors.toList());
    }
    
    public User createUser(User user, MultipartFile profilePicture) {
        if (userRepository.existsById(user.getId())) {
            throw new UserAlreadyExistsException("User with id " + user.getId() + " already exists");
        }
    
        User createdUser = userRepository.save(user);
        if (isPlayer(createdUser)) {
            ratingService.initRating(createdUser.getId());
        }
        return createdUser;
    }
    
    public User updateUser(String id, User updatedUser, MultipartFile profilePicture) {
        return userRepository.findById(id)
            .map(existingUser -> applyUserUpdates(existingUser, updatedUser))
            .map(userRepository::save)
            .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));
    }
    
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
    
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User with ID " + id + " not found");
        }
        userRepository.deleteById(id);
        ratingService.deleteRating(id);
    }
    
    // Helper method to enrich a user with rank if they are not an admin
    private User enrichUserWithRankIfNotAdmin(User user) {
        if (!isAdmin(user)) {
            user.setRank(userRepository.findUserRankById(user.getId())
                .orElseThrow(() -> new RatingNotFoundException(user.getId())));
        }
        return user;
    }
    
    // Helper method to map player ranks
    private Map<String, Number> getPlayerRanksMap(List<String> ids) {
        return userRepository.findUserRanksByIds(ids).stream()
            .collect(Collectors.toMap(
                result -> (String) result[0],
                result -> (Number) result[1]
            ));
    }
    
    // Helper method to enrich user with rank
    private User enrichUserWithRank(User user, Long rank) {
        user.setRank(rank);
        return user;
    }
    
    // Helper method to check if user is an admin
    private boolean isAdmin(User user) {
        return Role.ADMIN.equals(user.getRole());
    }
    
    // Helper method to check if user is a player
    private boolean isPlayer(User user) {
        return Role.PLAYER.equals(user.getRole());
    }
    
    // Helper method to apply updates to an existing user
    private User applyUserUpdates(User existingUser, User updatedUser) {
        if (updatedUser.getUsername() != null) existingUser.setUsername(updatedUser.getUsername());
        if (updatedUser.getFullname() != null) existingUser.setFullname(updatedUser.getFullname());
        if (updatedUser.getGender() != null) existingUser.setGender(updatedUser.getGender());
        if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
        if (updatedUser.getRole() != null) existingUser.setRole(updatedUser.getRole());
        if (updatedUser.getCountry() != null) existingUser.setCountry(updatedUser.getCountry());
        if (updatedUser.getProfilePicture() != null) existingUser.setProfilePicture(updatedUser.getProfilePicture());
        return existingUser;
    }    
}
