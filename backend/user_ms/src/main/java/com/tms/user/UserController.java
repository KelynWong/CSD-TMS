package com.tms.user;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.svix.Webhook;
import com.svix.exceptions.WebhookVerificationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.http.HttpHeaders;
import java.util.Collections;
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

  // Health check endpoint to verify if the service is running (for the app gateway to call)
  @GetMapping("/health")
  public ResponseEntity<String> healthCheck() {
      return ResponseEntity.ok("Service is healthy");
  }

  // Retrieve all users from the database
  @GetMapping
  public List<User> getAllUsers() {
      return userService.getAllUsers();
  }

  // Retrieve users with the highest ratings (top players)
  @GetMapping("/top-players")
  public List<User> getTopRatings() {
      return userService.getTopPlayers();
  }

  // Retrieve a user by their unique ID
  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(@PathVariable String id) { // String is used instead of Long for ID type
      User user = userService.getUserById(id);
      if (user != null) {
          return ResponseEntity.ok(user);
      } else {
          return ResponseEntity.notFound().build();
      }
  }

  // Retrieve a list of users by a list of provided IDs
  @PostMapping("/ids")
  public ResponseEntity<List<User>> getUsersByIds(@RequestBody List<Map<String, String>> ids) {
      List<User> users = userService.getUsersByIds(ids.stream()
          .map(idMap -> idMap.get("id"))
          .collect(Collectors.toList()));
      return ResponseEntity.ok(users);
  }

  // Retrieve users by a specified role (e.g., PLAYER, ADMIN)
  @GetMapping("/role/{role}")
  public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
      List<User> users = userService.getUsersByRole(Role.valueOf(role.toUpperCase()));
      if (!users.isEmpty()) {
          return ResponseEntity.ok(users);
      } else {
          return ResponseEntity.notFound().build();
      }
  }

  // Create a new user with optional profile picture upload
  @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
  public ResponseEntity<Object> createUser(@RequestPart("user") String userJson,
      @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
      try {
          ObjectMapper objectMapper = new ObjectMapper();
          User user = objectMapper.readValue(userJson, User.class);

          // Call the service to save the user in the database
          User userobj = userService.createUser(user, profilePicture);
          return ResponseEntity.ok(userobj);
      } catch (Exception e) {
          e.printStackTrace();
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("Failed to create user or upload profile picture: " + e.getMessage());
      }
  }

  // Update an existing user by their ID, with optional profile picture update
  @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
  public ResponseEntity<Object> updateUser(@PathVariable String id,
      @RequestPart("user") String userJson,
      @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
      try {
          ObjectMapper objectMapper = new ObjectMapper();
          User user = objectMapper.readValue(userJson, User.class);
          user.setId(id); // Ensure the ID is set on the user being updated

          // Call the service to update the user in the database
          User userObj = userService.updateUser(id, user, profilePicture);
          return ResponseEntity.ok(userObj);
      } catch (Exception e) {
          e.printStackTrace();
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("Failed to update user or upload profile picture: " + e.getMessage());
      }
  }

  // Delete a user by their ID from the database
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
      HttpHeaders svixHeaders = convertToSvixHeaders(headers);

      // Initialize Svix Webhook object
      Webhook webhook = new Webhook(signingSecret);

      // Verify the webhook signature
      webhook.verify(payload, svixHeaders);

      // Process the webhook payload (after verification)
      JsonNode webhookEvent = new ObjectMapper().readTree(payload);
      String eventType = getNodeText(webhookEvent, "type");
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
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid JSON payload");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error processing webhook: " + e.getMessage());
    }
  }

  // Convert headers to Svix-compliant HttpHeaders
  private HttpHeaders convertToSvixHeaders(Map<String, String> headers) {
    HashMap<String, List<String>> headerMap = new HashMap<>();
    headerMap.put("svix-id", Collections.singletonList(headers.get("svix-id")));
    headerMap.put("svix-timestamp", Collections.singletonList(headers.get("svix-timestamp")));
    headerMap.put("svix-signature", Collections.singletonList(headers.get("svix-signature")));
    return HttpHeaders.of(headerMap, (key, value) -> true);
  }

  // Helper to safely extract text from JsonNode
  private String getNodeText(JsonNode node, String key) {
    return node.has(key) && !node.get(key).isNull() ? node.get(key).asText() : "";
  }

  // Handle the user.created event from Clerk
  private void handleUserCreated(JsonNode userData) {
    try {
      User user = new User();

      // Extract user details
      user.setId(getNodeText(userData, "id"));
      user.setUsername(extractUsername(userData));
      user.setFullname(extractFullname(userData));
      user.setEmail(extractEmail(userData));
      user.setGender(getNodeText(userData, "gender"));
      user.setProfilePicture(getNodeText(userData, "profile_image_url"));
      user.setRole(Role.PLAYER); // Default role
      user.setCountry(null); // Default country since Clerk doesn't provide it

      userService.createUser(user, null);
    } catch (Exception e) {
      throw new RuntimeException("Error handling user.created event: " + e.getMessage());
    }
  }

  // Handle the user.updated event from Clerk
  private void handleUserUpdated(JsonNode userData) {
    try {
      String userId = getNodeText(userData, "id");
      User user = userService.getUserById(userId);

      if (user == null) {
        throw new RuntimeException("User not found");
      }

      // Update user fields if present
      user.setEmail(extractEmail(userData));
      user.setUsername(getNodeText(userData, "username"));
      user.setFullname(extractFullname(userData));
      user.setGender(extractMetadataField(userData, "gender"));
      user.setProfilePicture(getNodeText(userData, "profile_image_url"));
      user.setCountry(extractMetadataField(userData, "country"));
      user.setRole(extractRole(userData));

      userService.updateUser(userId, user, null);
    } catch (Exception e) {
      throw new RuntimeException("Error handling user.updated event: " + e.getMessage());
    }
  }

  // Handle the user.deleted event from Clerk
  private void handleUserDeleted(JsonNode userData) {
    try {
      String userId = getNodeText(userData, "id");
      userService.deleteUser(userId);
    } catch (Exception e) {
      throw new RuntimeException("Error handling user.deleted event: " + e.getMessage());
    }
  }

  // Extract role with default fallback
  private Role extractRole(JsonNode userData) {
    String roleText = extractMetadataField(userData, "role").toUpperCase();
    return roleText.isEmpty() ? Role.PLAYER : Role.valueOf(roleText);
  }

  // Extract full name by combining first and last names if available
  private String extractFullname(JsonNode userData) {
    String firstName = getNodeText(userData, "first_name");
    String lastName = getNodeText(userData, "last_name");
    return (firstName + " " + lastName).trim();
  }

  // Extract primary email if available
  private String extractEmail(JsonNode userData) {
    if (userData.has("email_addresses") && userData.get("email_addresses").size() > 0) {
      return getNodeText(userData.get("email_addresses").get(0), "email_address");
    }
    return "";
  }

  // Extract username, using email as fallback
  private String extractUsername(JsonNode userData) {
    String username = getNodeText(userData, "username");
    return username.isEmpty() ? extractEmail(userData) : username;
  }

  // Extract field from public_metadata if available
  private String extractMetadataField(JsonNode userData, String field) {
    return userData.has("public_metadata") && userData.get("public_metadata").has(field) ?
        getNodeText(userData.get("public_metadata"), field) : "";
  }
}
