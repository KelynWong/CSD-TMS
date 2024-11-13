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
        URI uri = new URI(baseUrl + port + "/users/health");
        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Service is healthy", response.getBody());
    }

    @Test
    void getAllUsers() throws Exception {
        URI uri = new URI(baseUrl + port + "/users");
        userRepository.save(new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null));

        ResponseEntity<User[]> response = restTemplate.getForEntity(uri, User[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().length);
    }

    @Test
    void getTopPlayers() throws Exception {
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);
        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        ratingRepository.save(rating);
        userRepository.save(user);
        URI uri = new URI(baseUrl + port + "/users/top-players");

        ResponseEntity<User[]> response = restTemplate.getForEntity(uri, User[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().length);
    }

    @Test
    void getUserById_UserFound_ReturnUser() throws Exception {
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);

        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        ratingRepository.save(rating);

        String id = userRepository.save(user).getId();

        URI uri = new URI(baseUrl + port + "/users/" + id);

        ResponseEntity<User> response = restTemplate.getForEntity(uri, User.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(id, response.getBody().getId());
    }

    @Test
    void getUserById_UserNotFound_Return404() throws Exception {
        URI uri = new URI(baseUrl + port + "/users/9999");
        ResponseEntity<User> response = restTemplate.getForEntity(uri, User.class);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getUsersByIds() throws Exception {
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);
        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        ratingRepository.save(rating);
        userRepository.save(user);
        URI uri = new URI(baseUrl + port + "/users/ids");

        List<Map<String, String>> ids = Arrays.asList(Collections.singletonMap("id", "1"));
        HttpEntity<List<Map<String, String>>> requestEntity = new HttpEntity<>(ids);

        ResponseEntity<User[]> response = restTemplate.exchange(uri, HttpMethod.POST, requestEntity, User[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().length);
    }

    @Test
    void createUser() throws Exception {
        MockMultipartFile userJson = new MockMultipartFile(
            "user", 
            "", 
            "application/json", 
            ("{"
                + "\"id\":\"1\","
                + "\"username\":\"testuser1\","
                + "\"fullname\":\"Test User1\","
                + "\"gender\":\"Male\","
                + "\"email\":\"test1@example.com\","
                + "\"role\":\"PLAYER\","
                + "\"country\":\"USA\","
                + "\"profilePicture\":\"profile_pic_url\""
                + "}").getBytes()
        );

        MockMultipartFile profilePicture = new MockMultipartFile(
            "profilePicture", 
            "profile.jpg", 
            MediaType.IMAGE_JPEG_VALUE, 
            "dummy image content".getBytes()
        );

        mockMvc.perform(MockMvcRequestBuilders.multipart("/users")
                .file(userJson)
                .file(profilePicture)
                .contentType(MediaType.MULTIPART_FORM_DATA))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("test1@example.com"))
            .andExpect(jsonPath("$.username").value("testuser1"));
    }

    @Test
    void createUser_InvalidJson_Return500() throws Exception {
        MockMultipartFile invalidUserJson = new MockMultipartFile(
            "user",
            "",
            "application/json",
            ("{ invalid json }").getBytes()
        );

        mockMvc.perform(MockMvcRequestBuilders.multipart("/users")
                .file(invalidUserJson)
                .contentType(MediaType.MULTIPART_FORM_DATA))
            .andExpect(status().isInternalServerError())
            .andExpect(content().string(containsString("Failed to create user or upload profile picture")));
    }

    @Test
    void updateUser() throws Exception {
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);

        LocalDateTime firstDayOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        Rating rating = new Rating(user, ratingCalc.getDefaultRating(), ratingCalc.getDefaultRatingDeviation(),
                ratingCalc.getDefaultVolatility(), 0, firstDayOfYear);
        ratingRepository.save(rating);

        String id = userRepository.save(user).getId();

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

        mockMvc.perform(MockMvcRequestBuilders.multipart("/users/" + id)
                .file(updatedUserJson)
                .file(updatedProfilePicture)
                .contentType(MediaType.MULTIPART_FORM_DATA) 
                .with(request -> {
                    request.setMethod("PUT"); 
                    return request;
                }))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("updated@example.com"))
            .andExpect(jsonPath("$.username").value("updatedUser"));
    }

    @Test
    void deleteUser_UserFound() throws Exception {
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);
        String id = userRepository.save(user).getId();
        URI uri = new URI(baseUrl + port + "/users/" + id);

        restTemplate.delete(uri);

        assertFalse(userRepository.findById(id).isPresent());
    }

    @Test
    void deleteUser_UserNotFound_Return404() throws Exception {
        URI uri = new URI(baseUrl + port + "/users/9999");
        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.DELETE, null, String.class);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getUsersByRole() throws Exception {
        String role = "Player";
        userRepository.save(new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null));
        URI uri = new URI(baseUrl + port + "/users/role/" + role);

        ResponseEntity<User[]> response = restTemplate.getForEntity(uri, User[].class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().length);
    }

    @Test
    void getUsersByRole_NoUsersFound_Return404() throws Exception {
        URI uri = new URI(baseUrl + port + "/users/role/" + Role.ADMIN);

        ResponseEntity<User[]> response = restTemplate.getForEntity(uri, User[].class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void handleClerkWebhook_InvalidSignature_Return401() throws Exception {
        String payload = "{\"type\":\"user.created\",\"data\":{\"id\":\"1\"}}";
        URI uri = new URI(baseUrl + port + "/users/clerk-webhook");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("svix-id", "test-id");
        headers.add("svix-timestamp", "123456789");
        headers.add("svix-signature", "invalid-signature");

        HttpEntity<String> requestEntity = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(uri, requestEntity, String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}
