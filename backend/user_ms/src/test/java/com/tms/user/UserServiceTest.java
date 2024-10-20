package com.tms.user;

import com.tms.rating.RatingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
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
        User user = new User(
                "user1",
                "user1",
                "New User",
                "Male",
                "newuser@example.com",
                "Player",
                "Singapore",
                null,
                null
        );

        when(userRepository.save(any(User.class))).thenReturn(user);
        when(ratingService.initRating(user.getId())).thenReturn(user.getRating());

        User createdUser = userService.createUser(user, null);

        assertEquals(user, createdUser);
        verify(userRepository, times(1)).save(user);
        verify(ratingService, times(1)).initRating(user.getId());
    }

}