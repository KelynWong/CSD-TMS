// package com.tms.user;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.junit.jupiter.api.AfterEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.web.client.TestRestTemplate;
// import org.springframework.boot.test.web.server.LocalServerPort;
// import org.springframework.http.HttpMethod;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;

// import java.net.URI;
// import java.util.List;
// import java.util.Map;

// import static org.junit.jupiter.api.Assertions.*;

// @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
// class UserControllerTest {
//     @LocalServerPort
//     private int port;

//     private final String baseUrl = "http://localhost:";

//     @Autowired
//     private TestRestTemplate restTemplate;

//     @Autowired
//     private UserRepository userRepository;

//     @AfterEach
//     void tearDown() {
//         userRepository.deleteAll();
//     }

//     @Test
//     void healthCheck() throws Exception {
//         URI uri = new URI(baseUrl + port + "/users/health");
//         ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
//         assertEquals(HttpStatus.OK, response.getStatusCode());
//         assertEquals("Service is healthy", response.getBody());
//     }

//     @Test
//     void getAllUsers() throws Exception {
//         // Arrange
//         URI uri = new URI(baseUrl + port + "/users");
//         userRepository.save(new User("1", "test1@example.com", "Test User1", "Player"));

//         // Act
//         ResponseEntity<User[]> response = restTemplate.getForEntity(uri, User[].class);

//         // Assert
//         assertEquals(HttpStatus.OK, response.getStatusCode());
//         assertNotNull(response.getBody());
//         assertEquals(1, response.getBody().length);
//     }

//     @Test
//     void getUserById_UserFound_ReturnUser() throws Exception {
//         // Arrange
//         User user = new User("1", "test1@example.com", "Test User1", "Player");
//         String id = userRepository.save(user).getId();
//         URI uri = new URI(baseUrl + port + "/users/" + id);

//         // Act
//         ResponseEntity<User> response = restTemplate.getForEntity(uri, User.class);

//         // Assert
//         assertEquals(HttpStatus.OK, response.getStatusCode());
//         assertNotNull(response.getBody());
//         assertEquals(id, response.getBody().getId());
//     }

//     @Test
//     void getUserById_UserNotFound_Return404() throws Exception {
//         URI uri = new URI(baseUrl + port + "/users/9999");
//         ResponseEntity<User> response = restTemplate.getForEntity(uri, User.class);
//         assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
//     }

//     @Test
//     void createUser() throws Exception {
//         // Arrange
//         URI uri = new URI(baseUrl + port + "/users");
//         UserJson userJson = new UserJson("test1@example.com", "Test User1", "Player");

//         // Act
//         ResponseEntity<User> response = restTemplate.postForEntity(uri, userJson, User.class);

//         // Assert
//         assertEquals(HttpStatus.OK, response.getStatusCode());
//         assertNotNull(response.getBody());
//         assertEquals("test1@example.com", response.getBody().getEmail());
//     }

//     @Test
//     void deleteUser_UserFound() throws Exception {
//         // Arrange
//         User user = new User("1", "test1@example.com", "Test User1", "Player");
//         String id = userRepository.save(user).getId();
//         URI uri = new URI(baseUrl + port + "/users/" + id);

//         // Act
//         restTemplate.delete(uri);

//         // Assert
//         assertFalse(userRepository.findById(id).isPresent());
//     }

//     @Test
//     void deleteUser_UserNotFound_Return404() throws Exception {
//         URI uri = new URI(baseUrl + port + "/users/9999");
//         ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.DELETE, null, String.class);
//         assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
//     }

//     @Test
//     void getUsersByRole() throws Exception {
//         // Arrange
//         String role = "Player";
//         userRepository.save(new User("1", "test1@example.com", "Test User1", role));
//         URI uri = new URI(baseUrl + port + "/users/role/" + role);

//         // Act
//         ResponseEntity<User[]> response = restTemplate.getForEntity(uri, User[].class);

//         // Assert
//         assertEquals(HttpStatus.OK, response.getStatusCode());
//         assertNotNull(response.getBody());
//         assertEquals(1, response.getBody().length);
//     }

//     @Test
//     void handleClerkWebhook_InvalidSignature_Return401() throws Exception {
//         // Arrange
//         String payload = "{\"type\":\"user.created\",\"data\":{\"id\":\"1\"}}";
//         URI uri = new URI(baseUrl + port + "/users/clerk-webhook");

//         // Act
//         ResponseEntity<String> response = restTemplate.postForEntity(uri, payload, String.class);

//         // Assert
//         assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
//     }
// }
