package com.tms.user;

import com.tms.exception.UserAlreadyExistsException;
import com.tms.rating.RatingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RatingService ratingService;

    @InjectMocks
    private UserService userService;

    @Test
    void addUser_NewUser_ReturnSavedUserAndRating() {
        User user = new User("user1");

        when(userRepository.save(any(User.class))).thenReturn(user);
        when(ratingService.initRating(user.getId())).thenReturn(user.getRating());

        User createdUser = userService.createUser(user, null);

        assertEquals(user, createdUser);
        verify(userRepository, times(1)).save(user);
        verify(ratingService, times(1)).initRating(user.getId());
    }

    @Test
    void addUser_ExistingUser_ThrowException() {
        User user = new User("user1");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.createUser(user, null);
        });
        verify(userRepository, never()).save(user);
        verify(ratingService, never()).initRating(user.getId());
    }

    @Test
    void getUserById_ExistingUser_ReturnUser() {
        User user = new User("user1");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        User foundUser = userService.getUserById(user.getId());

        assertEquals(user, foundUser);
        verify(userRepository, times(1)).findById(user.getId());
    }

    @Test
    void getUserById_NonExistingUser_ReturnNull() {
        when(userRepository.findById(anyString())).thenReturn(Optional.empty());

        User foundUser = userService.getUserById("nonexistent_id");

        assertNull(foundUser);
        verify(userRepository, times(1)).findById("nonexistent_id");
    }

    @Test
    void getAllUsers_ReturnUserList() {
        List<User> users = List.of(new User("user1"), new User("user2"));

        when(userRepository.findAll()).thenReturn(users);

        List<User> allUsers = userService.getAllUsers();

        assertEquals(users, allUsers);
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getTopPlayers_ReturnPagedUserList() {
        List<User> users = List.of(new User("user1"), new User("user2"));

        when(userRepository.findAllOrderByRatingDesc()).thenReturn(users);

        List<User> topPlayers = userService.getTopPlayers();

        assertEquals(users, topPlayers);
        verify(userRepository, times(1)).findAllOrderByRatingDesc();
    }

    @Test
    void updateUser_ExistingUser_ReturnUpdatedUser() {
        User existingUser = new User("user1");
        User updatedUser = new User("user1");
        updatedUser.setUsername("newUsername");

        when(userRepository.findById(existingUser.getId())).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        User result = userService.updateUser(existingUser.getId(), updatedUser, null);

        assertEquals("newUsername", result.getUsername());
        verify(userRepository, times(1)).findById(existingUser.getId());
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    void updateUser_NonExistingUser_ThrowException() {
        User updatedUser = new User("user1");

        when(userRepository.findById(anyString())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            userService.updateUser("nonexistent_id", updatedUser, null);
        });
        verify(userRepository, times(1)).findById("nonexistent_id");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_ExistingUser_DeleteSuccessfully() {
        User user = new User("user1");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        userService.deleteUser(user.getId());

        verify(userRepository, times(1)).deleteById(user.getId());
        verify(ratingService, times(1)).deleteRating(user.getId());
    }

    @Test
    void deleteUser_NonExistingUser_DoNothing() {
        when(userRepository.findById(anyString())).thenReturn(Optional.empty());

        userService.deleteUser("nonexistent_id");

        verify(userRepository, never()).deleteById(anyString());
        verify(ratingService, never()).deleteRating(anyString());
    }
}