package com.tms.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.net.URI;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerTest {
    @LocalServerPort
    private int port;

    private final String baseUrl = "http://localhost:";

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

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
    void getUserById_UserFound_ReturnUser() throws Exception {
        User user = new User("1", "testuser1", "Test User1", "Male", "test1@example.com", Role.PLAYER, "USA", "profile_pic_url", null, null);
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
    void createUser() throws Exception {
        URI uri = new URI(baseUrl + port + "/users");
        MockMultipartFile userJson = new MockMultipartFile("user", "", "application/json", 
            "{\"email\":\"test1@example.com\", \"username\":\"Test User1\", \"role\":\"Player\"}".getBytes());

        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        parts.add("user", userJson);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(parts, headers);
        ResponseEntity<User> response = restTemplate.postForEntity(uri, requestEntity, User.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("test1@example.com", response.getBody().getEmail());
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
