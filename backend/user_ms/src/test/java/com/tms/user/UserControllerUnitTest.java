package com.tms.user;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class UserControllerUnitTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    public UserControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers() {
        List<User> mockUsers = List.of(new User("id123","john_doe", "John Doe", "Male", "john@example.com", "USER", 1, "USA"));
        when(userService.getAllUsers()).thenReturn(mockUsers);

        List<User> users = userController.getAllUsers();

        assertNotNull(users);
        assertEquals(1, users.size());
        assertEquals("john_doe", users.get(0).getUsername());
    }

	@Test
	void testGetUserById() {
		User mockUser = new User("id123","john_doe", "John Doe", "Male", "john@example.com", "USER", 1, "USA");
		when(userService.getUserById("1")).thenReturn(Optional.of(mockUser));

		ResponseEntity<User> response = userController.getUserById("1");

		assertEquals(ResponseEntity.ok(mockUser), response);
		assertEquals("john_doe", response.getBody().getUsername());
	}

	@Test
	void testCreateUser() throws Exception {
		MultipartFile profilePicture = Mockito.mock(MultipartFile.class);
		String userJson = "{\"username\": \"john_doe\", \"fullname\": \"John Doe\"}";

		User mockUser = new User("id123","john_doe", "John Doe", "Male", "john@example.com", "USER", 1, "USA");
		when(userService.createUser(any(User.class), eq(profilePicture))).thenReturn("User Created");

		ResponseEntity<Object> response = userController.createUser(userJson, profilePicture);

		assertEquals(ResponseEntity.ok("User Created"), response);
	}

	@Test
	void testUpdateUser() throws Exception {
		MultipartFile profilePicture = Mockito.mock(MultipartFile.class);
		String userJson = "{\"username\": \"john_doe\", \"fullname\": \"John Doe\"}";
		String userId = "1";

		User mockUser = new User("id123","john_doe", "John Doe", "Male", "john@example.com", "USER", 1, "USA");
		when(userService.updateUser(any(User.class), eq(profilePicture))).thenReturn("User Updated");

		ResponseEntity<Object> response = userController.updateUser(userId, userJson, profilePicture);

		assertEquals(ResponseEntity.ok("User Updated"), response);
	}

	@Test
	void testCreateUserFailure() throws Exception {
		MultipartFile profilePicture = Mockito.mock(MultipartFile.class);
		String userJson = "{\"username\": \"john_doe\", \"fullname\": \"John Doe\"}";

		when(userService.createUser(any(User.class), eq(profilePicture))).thenThrow(new RuntimeException("Creation failed"));

		ResponseEntity<Object> response = userController.createUser(userJson, profilePicture);

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
		assertEquals("Creation failed", response.getBody());
	}

	@Test
	void testUpdateUserNotFound() throws Exception {
		MultipartFile profilePicture = Mockito.mock(MultipartFile.class);
		String userJson = "{\"username\": \"john_doe\", \"fullname\": \"John Doe\"}";
		String userId = "non_existing_id";

		when(userService.updateUser(any(User.class), eq(profilePicture))).thenThrow(new RuntimeException("User not found"));

		ResponseEntity<Object> response = userController.updateUser(userId, userJson, profilePicture);

		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
		assertEquals("User not found", response.getBody());
	}

	@Test
	void testDeleteUser() {
		doNothing().when(userService).deleteUser("1");

		ResponseEntity<Void> response = userController.deleteUser("1");

		assertEquals(ResponseEntity.ok().build(), response);
		verify(userService, times(1)).deleteUser("1");
	}

	@Test
	void testDeleteUserNotFound() {
		doThrow(new RuntimeException("User not found")).when(userService).deleteUser("non_existing_id");

		ResponseEntity<Void> response = userController.deleteUser("non_existing_id");

		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
		assertEquals("User not found", response.getBody());
	}

	@Test
	void testHandleClerkWebhook() throws Exception {
		String payload = "{\"type\": \"user.created\", \"data\": { \"id\": \"1\", \"username\": \"john_doe\"}}";
		Map<String, String> headers = Map.of("svix-id", "123", "svix-timestamp", "123456", "svix-signature", "signature");

		// Create a mock User object or set an appropriate return value for createUser
		User mockUser = new User("id123","john_doe", "John Doe", "Male", "john@example.com", "USER", 1, "USA");

		// Assuming createUser returns a User object
		when(userService.createUser(any(User.class), isNull())).thenReturn("lalala");

		ResponseEntity<String> response = userController.handleClerkWebhook(headers, payload);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("Webhook received successfully", response.getBody());
	}
}