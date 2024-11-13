package com.tms.user;

import com.tms.rating.Rating;
import com.tms.rating.RatingRepository;
import com.tms.ratingCalc.RatingCalculator;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.hamcrest.Matchers.containsString;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class UserControllerTest {
    @LocalServerPort
    private int port;

    private final String baseUrl = "http://localhost:";

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RatingCalculator ratingCalc;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void clear() {
        userRepository.deleteAll();
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    void healthCheck() throws Exception {
        // Arrange: Construct URI for health check endpoint
        URI uri = new URI(baseUrl + port + "/users/health");

        // Act: Send GET request to check service health
        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

        // Assert: Check that the service responds with status OK and expected body message
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Service is healthy", response.getBody());
    }

    @Test
    void getAllUsers() throws Exception {
        // Arrange: Construct URI for getting all users and save a test user to repository
        URI uri = new URI(baseUrl + port + "/users");
        userRepository.save(new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null));

        // Act: Send GET request to retrieve all users
        ResponseEntity<User[]> response = restTemplate.getForEntity(uri, User[].class);

        // Assert: Verify response status and that the test user is included in the response body
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().length);
    }

    @Test
    void getTopPlayers() throws Exception {
        // Arrange: Create a test user and rating, saving both to the repositories
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);
        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        ratingRepository.save(rating);
        userRepository.save(user);
        URI uri = new URI(baseUrl + port + "/users/top-players");

        // Act: Send GET request to retrieve top players
        ResponseEntity<User[]> response = restTemplate.getForEntity(uri, User[].class);

        // Assert: Verify response status and that the test user is retrieved as a top player
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().length);
    }

    @Test
    void getUserById_UserFound_ReturnUser() throws Exception {
        // Arrange: Save a user with a specific ID and create associated rating
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);
        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        ratingRepository.save(rating);
        String id = userRepository.save(user).getId();
        URI uri = new URI(baseUrl + port + "/users/" + id);

        // Act: Send GET request for the user by ID
        ResponseEntity<User> response = restTemplate.getForEntity(uri, User.class);

        // Assert: Verify response status and that the retrieved user's ID matches the expected ID
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(id, response.getBody().getId());
    }

    @Test
    void getUserById_UserNotFound_Return404() throws Exception {
        // Arrange: Define URI with a non-existent user ID
        URI uri = new URI(baseUrl + port + "/users/9999");

        // Act: Attempt to retrieve a user with the given non-existent ID
        ResponseEntity<User> response = restTemplate.getForEntity(uri, User.class);

        // Assert: Verify that the response status is 404 NOT FOUND
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getUsersByIds() throws Exception {
        // Arrange: Save a user to the repository and define the URI for bulk user retrieval
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);
        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        ratingRepository.save(rating);
        userRepository.save(user);
        URI uri = new URI(baseUrl + port + "/users/ids");

        // Act: Send POST request with a list of IDs to retrieve corresponding users
        List<Map<String, String>> ids = Arrays.asList(Collections.singletonMap("id", "1"));
        HttpEntity<List<Map<String, String>>> requestEntity = new HttpEntity<>(ids);
        ResponseEntity<User[]> response = restTemplate.exchange(uri, HttpMethod.POST, requestEntity, User[].class);

        // Assert: Verify response status and that the response includes the test user
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().length);
    }

    @Test
    void createUser() throws Exception {
        // Arrange: Prepare JSON and image files to simulate multipart user creation request
        MockMultipartFile userJson = new MockMultipartFile("user", "", "application/json", 
                ("{ \"id\":\"1\",\"username\":\"testuser1\",\"fullname\":\"Test User1\"," +
                "\"gender\":\"Male\",\"email\":\"test1@example.com\",\"role\":\"PLAYER\"," +
                "\"country\":\"USA\",\"profilePicture\":\"profile_pic_url\"}").getBytes());
        MockMultipartFile profilePicture = new MockMultipartFile("profilePicture", "profile.jpg", MediaType.IMAGE_JPEG_VALUE, "dummy image content".getBytes());

        // Act: Send multipart POST request to create user
        mockMvc.perform(MockMvcRequestBuilders.multipart("/users")
                .file(userJson)
                .file(profilePicture)
                .contentType(MediaType.MULTIPART_FORM_DATA))
            // Assert: Verify response status and user data
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("test1@example.com"))
            .andExpect(jsonPath("$.username").value("testuser1"));
    }

    @Test
    void createUser_InvalidJson_Return500() throws Exception {
        // Arrange: Create an invalid JSON MockMultipartFile for user data
        MockMultipartFile invalidUserJson = new MockMultipartFile(
            "user",
            "",
            "application/json",
            ("{ invalid json }").getBytes()
        );

        // Act: Perform a multipart POST request with invalid JSON content
        mockMvc.perform(MockMvcRequestBuilders.multipart("/users")
                .file(invalidUserJson)
                .contentType(MediaType.MULTIPART_FORM_DATA))
            // Assert: Expect a 500 Internal Server Error status and a specific error message
            .andExpect(status().isInternalServerError())
            .andExpect(content().string(containsString("Failed to create user or upload profile picture")));
    }

    @Test
    void updateUser() throws Exception {
        // Arrange: Create a user and a default rating, save them in repositories
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);
        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        ratingRepository.save(rating);
        String id = userRepository.save(user).getId();

        // Create updated JSON and profile picture files for the user update request
        MockMultipartFile updatedUserJson = new MockMultipartFile(
            "user",
            "",
            "application/json",
            ("{"
                + "\"id\":\"" + id + "\","
                + "\"username\":\"updatedUser\","
                + "\"fullname\":\"Updated User\","
                + "\"gender\":\"Female\","
                + "\"email\":\"updated@example.com\","
                + "\"role\":\"PLAYER\","
                + "\"country\":\"Canada\","
                + "\"profilePicture\":\"updated_profile_pic_url\""
                + "}").getBytes()
        );
        MockMultipartFile updatedProfilePicture = new MockMultipartFile(
            "profilePicture", 
            "updated_profile.jpg", 
            MediaType.IMAGE_JPEG_VALUE, 
            "updated image content".getBytes()
        );

        // Act: Perform a multipart PUT request to update the user's details
        mockMvc.perform(MockMvcRequestBuilders.multipart("/users/" + id)
                .file(updatedUserJson)
                .file(updatedProfilePicture)
                .contentType(MediaType.MULTIPART_FORM_DATA) 
                .with(request -> { request.setMethod("PUT"); return request; }))
            // Assert: Check for OK status and verify updated fields
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("updated@example.com"))
            .andExpect(jsonPath("$.username").value("updatedUser"));
    }

    @Test
    void deleteUser_UserFound() throws Exception {
        // Arrange: Save a user to the repository
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);
        String id = userRepository.save(user).getId();
        URI uri = new URI(baseUrl + port + "/users/" + id);

        // Act: Perform a DELETE request for the user
        restTemplate.delete(uri);

        // Assert: Verify the user is no longer present in the repository
        assertFalse(userRepository.findById(id).isPresent());
    }

    @Test
    void deleteUser_UserNotFound_Return404() throws Exception {
        // Arrange: Set a URI for a non-existing user ID
        URI uri = new URI(baseUrl + port + "/users/9999");

        // Act: Attempt to delete the non-existing user
        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.DELETE, null, String.class);

        // Assert: Expect a 404 Not Found status
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getUsersByRole() throws Exception {
        // Arrange: Save a user with a specific role to the repository
        String role = "Player";
        userRepository.save(new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null));
        URI uri = new URI(baseUrl + port + "/users/role/" + role);

        // Act: Send GET request to retrieve users by role
        ResponseEntity<User[]> response = restTemplate.getForEntity(uri, User[].class);

        // Assert: Check for OK status and validate the expected number of users found
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().length);
    }

    @Test
    void getUsersByRole_NoUsersFound_Return404() throws Exception {
        // Arrange: Define URI for retrieving users of a role with no matching users
        URI uri = new URI(baseUrl + port + "/users/role/" + Role.ADMIN);

        // Act: Send GET request to retrieve users with no matching role
        ResponseEntity<User[]> response = restTemplate.getForEntity(uri, User[].class);

        // Assert: Expect a 404 Not Found status
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void handleClerkWebhook_InvalidSignature_Return401() throws Exception {
        // Arrange: Prepare payload, headers with invalid signature, and target URI
        String payload = "{\"type\":\"user.created\",\"data\":{\"id\":\"1\"}}";
        URI uri = new URI(baseUrl + port + "/users/clerk-webhook");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("svix-id", "test-id");
        headers.add("svix-timestamp", "123456789");
        headers.add("svix-signature", "invalid-signature");

        // Act: Perform POST request with invalid signature
        HttpEntity<String> requestEntity = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(uri, requestEntity, String.class);

        // Assert: Expect a 401 Unauthorized status
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}
