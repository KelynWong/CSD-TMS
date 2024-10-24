package com.tms.user;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.svix.Webhook;
import com.svix.exceptions.WebhookVerificationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.http.HttpHeaders;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

  private final UserService userService;

  @Value("${CLERK_SIGNING_SECRET}")
  private String signingSecret;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  // Health check endpoint
  @GetMapping("/health")
  public ResponseEntity<String> healthCheck() {
      return ResponseEntity.ok("Service is healthy");
  }

  // Get all users
  @GetMapping
  public List<User> getAllUsers() {
    return userService.getAllUsers();
  }

  @GetMapping("/top-players")
  public Page<User> getTopRatings(
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    return userService.getTopPlayers(pageable);
  }

  // Get user by ID
  @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) { // String instead of Long
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

  // Get user by list of ids
  @PostMapping("/ids")
  public ResponseEntity<List<User>> getUsersByIds(@RequestBody List<Map<String, String>> ids) {
    List<User> users = userService.getUsersByIds(ids.stream()
        .map(idMap -> idMap.get("id"))
        .collect(Collectors.toList()));
    return ResponseEntity.ok(users);
  }

  // Get users by role
  @GetMapping("/role/{role}")
  public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
    List<User> users = userService.getUsersByRole(role);
    if (!users.isEmpty()) {
      return ResponseEntity.ok(users);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  // Create a new user
  @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
  public ResponseEntity<Object> createUser(@RequestPart("user") String userJson,
      @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      User user = objectMapper.readValue(userJson, User.class);

      // Call your service to create the user
      User userobj = userService.createUser(user, profilePicture);
      return ResponseEntity.ok(userobj);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Failed to create user or upload profile picture: " + e.getMessage());
    }
  }

  // Update user by ID
  @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
  public ResponseEntity<Object> updateUser(@PathVariable String id,
      @RequestPart("user") String userJson,
      @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      User user = objectMapper.readValue(userJson, User.class);
      user.setId(id); // Set the ID of the user to be updated

      // Call your service to update the user
      User userObj = userService.updateUser(id, user, profilePicture);
      return ResponseEntity.ok(userObj);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Failed to update user or upload profile picture: " + e.getMessage());
    }
  }

  // Delete user by ID
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable String id) {
    userService.deleteUser(id);
    return ResponseEntity.ok().build();
  }

  /**
   * Webhook endpoint for Clerk
   */
  @PostMapping(value = "/clerk-webhook", consumes = "application/json")
  public ResponseEntity<String> handleClerkWebhook(@RequestHeader Map<String, String> headers,
      @RequestBody String payload) {
    try {
      // Convert headers to a format that Svix expects (java.net.http.HttpHeaders)
      HashMap<String, List<String>> headerMap = new HashMap<>();
      headerMap.put("svix-id", Arrays.asList(headers.get("svix-id")));
      headerMap.put("svix-timestamp", Arrays.asList(headers.get("svix-timestamp")));
      headerMap.put("svix-signature", Arrays.asList(headers.get("svix-signature")));

      HttpHeaders svixHeaders = HttpHeaders.of(headerMap, (key, value) -> true); // Creating java.net.http.HttpHeaders

      // Initialize Svix Webhook object
      Webhook webhook = new Webhook(signingSecret);

      // Verify the webhook signature using java.net.http.HttpHeaders
      webhook.verify(payload, svixHeaders);

      // Process the webhook payload (after verification)
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode webhookEvent = objectMapper.readTree(payload);
      String eventType = webhookEvent.get("type").asText();
      JsonNode userData = webhookEvent.get("data");

      // Handle the specific event type
      switch (eventType) {
        case "user.created":
          handleUserCreated(userData);
          break;
        case "user.updated":
          handleUserUpdated(userData);
          break;
        case "user.deleted":
          handleUserDeleted(userData);
          break;
        default:
          return ResponseEntity.status(HttpStatus.BAD_REQUEST)
              .body("Unsupported event type: " + eventType);
      }

      return ResponseEntity.ok("Webhook received successfully");
    } catch (WebhookVerificationException e) {
      // Signature verification failed
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
    } catch (IOException e) {
      // Payload parsing or processing failed
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid JSON payload");
    } catch (Exception e) {
      // Handle other exceptions
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error processing webhook: " + e.getMessage());
    }
  }

  // Handle the user.created event from Clerk
  private void handleUserCreated(JsonNode userData) {
    try {
      // Create a new User instance
      User user = new User();

      // Id
      user.setId(userData.get("id").asText());

      // Extract necessary user details from the webhook data
      if (userData.has("username") && !userData.get("username").isNull()) {
        user.setUsername(userData.get("username").asText());
      } else {
        // Use email as username if username is null
        user.setUsername(userData.get("email_addresses").get(0).get("email_address").asText());
      }

      // Full name (First name + Last name)
      if (userData.has("first_name") || userData.has("last_name")) {
        String firstName = userData.has("first_name") ? userData.get("first_name").asText() : "";
        String lastName = userData.has("last_name") ? userData.get("last_name").asText() : "";
        user.setFullname(firstName + " " + lastName);
      }

      // Email
      if (userData.has("email_addresses")) {
        user.setEmail(userData.get("email_addresses").get(0).get("email_address").asText());
      }

      // Gender
      if (userData.has("gender") && !userData.get("gender").isNull()) {
        user.setGender(userData.get("gender").asText());
      } else {
        user.setGender("Not Specified");
      }

      // Role
      user.setRole("Player");

      // Country - Since Clerk data doesn't include country, use a default
      user.setCountry(null);

      // Profile Picture - Use profile_image_url if provided
      if (userData.has("profile_image_url") && !userData.get("profile_image_url").isNull()) {
        user.setProfilePicture(userData.get("profile_image_url").asText());
      }

      // Call your service to create the user in the database
      userService.createUser(user, null);

    } catch (Exception e) {
      throw new RuntimeException("Error handling user.created event: " + e.getMessage());
    }
  }

  // Handle the user.updated event from Clerk
  private void handleUserUpdated(JsonNode userData) {
    try {
      // Fetch the user by ID
      String userId = userData.get("id").asText();
      User user = userService.getUserById(userId);
      
      if (user == null) {
          throw new RuntimeException("User not found");
      }

      // Update email if present
      if (userData.has("email_addresses") && userData.get("email_addresses").size() > 0) {
        user.setEmail(userData.get("email_addresses").get(0).get("email_address").asText());
      }

      // Update username if present
      if (userData.has("username") && !userData.get("username").isNull()) {
        user.setUsername(userData.get("username").asText());
      }

      // Update full name if present
      if (userData.has("first_name") || userData.has("last_name")) {
        String firstName = userData.has("first_name") ? userData.get("first_name").asText() : "";
        String lastName = userData.has("last_name") ? userData.get("last_name").asText() : "";
        user.setFullname(firstName + " " + lastName);
      }

      // Update gender if present
      if (userData.has("public_metadata") && userData.get("public_metadata").has("gender")) {
        user.setGender(userData.get("public_metadata").get("gender").asText());
      }

      // Update profile picture if present
      if (userData.has("profile_image_url") && !userData.get("profile_image_url").isNull()) {
        user.setProfilePicture(userData.get("profile_image_url").asText());
      }

      // Update country if present
      if (userData.has("public_metadata") && userData.get("public_metadata").has("country")) {
        user.setCountry(userData.get("public_metadata").get("country").asText());
      }

      // Role
      if (userData.has("public_metadata") && userData.get("public_metadata").has("role")) {
        user.setRole(userData.get("public_metadata").get("role").asText());
      } else {
        user.setRole("Player");
      }

      // Update the user in your system
      userService.updateUser(userId, user, null);
    } catch (Exception e) {
      throw new RuntimeException("Error handling user.updated event: " + e.getMessage());
    }
  }

  // Handle the user.deleted event from Clerk
  private void handleUserDeleted(JsonNode userData) {
    try {
      String userId = userData.get("id").asText();
      userService.deleteUser(userId);
    } catch (Exception e) {
      throw new RuntimeException("Error handling user.deleted event: " + e.getMessage());
    }
  }
}
