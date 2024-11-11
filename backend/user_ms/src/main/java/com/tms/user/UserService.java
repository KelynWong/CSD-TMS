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
import java.util.Optional;
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
        Optional<User> result = userRepository.findById(id);
        return result.map(user -> {
            if (checkIfAdmin(user)) {
                return user;
            }
            user.setRank(userRepository.findUserRankById(user.getId())
                    .orElseThrow(() -> new RatingNotFoundException(user.getId())));
            return user;
        }).orElse(null);
    }

    public List<User> getUsersByIds(List<String> ids) {
        List<User> players = userRepository.findByIdInOrderByRatingDesc(ids);
        List<Object[]> playerRankRes = userRepository.findUserRanksByIds(ids);

        Map<String, Number> playerToRank = playerRankRes.stream()
            .collect(Collectors.toMap(
                result -> (String) result[0],
                result -> (Number) result[1]
            ));

        players.forEach(player -> player.setRank(playerToRank.getOrDefault(player.getId(), null)));
        return players;
    }

    private boolean checkIfAdmin(User user) {
        return user.getRole().equals(Role.ADMIN);
    }

    public List<User> getTopPlayers() {
        List<Object[]> results = userRepository.findAllOrderByRatingDesc();
        return results.stream().map(result -> {
            User user = (User) result[0];
            Long rank = (Long) result[1];
            user.setRank(rank);
            return user;
        }).collect(Collectors.toList());
    }

    public User createUser(User user, MultipartFile profilePicture) {
        userRepository.findById(user.getId()).ifPresent(u -> {
            throw new UserAlreadyExistsException("User with id " + u.getId() + " already exists");
        });
        User createdUser = userRepository.save(user);
        if (createdUser.getRole().equals(Role.PLAYER)) {
            ratingService.initRating(createdUser.getId());
        }
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
            .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));
    }    

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public void deleteUser(String id) { 
        if (userRepository.findById(id).isPresent()){
            userRepository.deleteById(id);
            ratingService.deleteRating(id);
        } else {
            throw new UserNotFoundException("User with ID " + id + " not found");
        }
    }
}
