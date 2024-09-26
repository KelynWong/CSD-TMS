package com.tms.user;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tms.exception.SupabaseClientException;

import io.github.cdimascio.dotenv.Dotenv;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.stream.Collectors;
import java.net.http.HttpRequest.BodyPublishers;

@Component
public class SupabaseClient {
    private final Dotenv dotenv = Dotenv.load();
    private final String SUPABASE_URL = dotenv.get("SUPABASE_URL");
    private final String SUPABASE_KEY = dotenv.get("SUPABASE_API_KEY");
    private final String STORAGE_BUCKET = dotenv.get("SUPABASE_BUCKET");
    private final HttpClient client = HttpClient.newHttpClient();
    private final String SCHEMA = "user";
    private final String STORAGE_BUCKET_URL = SUPABASE_URL + "/storage/v1/object/" + STORAGE_BUCKET + "/";

    public String uploadProfilePicture(MultipartFile file, String username) throws SupabaseClientException {
        String fileName = username;
        if (fileName == null) {
            throw new IllegalArgumentException("File name cannot be null");
        }

        try {
            // Check if file already exists
            HttpRequest checkRequest = HttpRequest.newBuilder()
                .uri(URI.create(STORAGE_BUCKET_URL + fileName))
                .header("authorization", SUPABASE_KEY)
                .header("Content-Type", "application/json")
                .GET()
                .build();

            HttpResponse<String> checkResponse = client.send(checkRequest, HttpResponse.BodyHandlers.ofString());

            if (checkResponse.statusCode() == 200) {
                // If the picture exists, delete it first
                HttpRequest deleteRequest = HttpRequest.newBuilder()
                    .uri(URI.create(STORAGE_BUCKET_URL + fileName))
                    .header("authorization", SUPABASE_KEY)
                    .DELETE()
                    .build();

                HttpResponse<String> deleteResponse = client.send(deleteRequest, HttpResponse.BodyHandlers.ofString());

                if (deleteResponse.statusCode() != 200 && deleteResponse.statusCode() != 204) {
                    throw new SupabaseClientException("Failed to delete existing profile picture: " + deleteResponse.body());
                }
            }

            // Upload the new file
            try (InputStream inputStream = file.getInputStream()) {
                HttpRequest uploadRequest = HttpRequest.newBuilder()
                    .uri(URI.create(STORAGE_BUCKET_URL + fileName))
                    .header("authorization", SUPABASE_KEY)
                    .header("Content-Type", file.getContentType())
                    .POST(HttpRequest.BodyPublishers.ofInputStream(() -> inputStream))
                    .build();

                HttpResponse<String> uploadResponse = client.send(uploadRequest, HttpResponse.BodyHandlers.ofString());

                if (uploadResponse.statusCode() == 200) {
                    return STORAGE_BUCKET_URL + fileName;
                } else {
                    throw new SupabaseClientException("Failed to upload profile picture: " + uploadResponse.body());
                }
            }
        } catch (IOException | InterruptedException e) {
            throw new SupabaseClientException("Error processing file upload", e);
        }
    }

    // Get all users
    public String getUsers() throws SupabaseClientException {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(SUPABASE_URL + "/rest/v1/user"))
                    .header("apikey", SUPABASE_KEY)
                    .header("Accept-Profile", SCHEMA)
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();
    
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    
            if (response.statusCode() == 200) {
                return response.body();
            } else {
                throw new SupabaseClientException("Failed to fetch users: " + response.body());
            }
        } catch (Exception e) {
            throw new SupabaseClientException("Error while fetching users", e);
        }
    }    

    public String getUserByUsername(String username) throws SupabaseClientException {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/user?username=eq." + username))
                .header("apikey", SUPABASE_KEY)
                .header("Accept-Profile", SCHEMA)
                .header("Content-Type", "application/json")
                .GET()
                .build();
    
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    
            if (response.statusCode() == 200) {
                return response.body();
            } else {
                throw new SupabaseClientException("Failed to get user by username: " + response.body());
            }
        } catch (IOException | InterruptedException e) {
            throw new SupabaseClientException("Error retrieving user by username", e);
        }
    }    

    // get top 10 users by rank
    public String getTop10UsersByRank() throws SupabaseClientException {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(SUPABASE_URL + "/rest/v1/user?order=rank.desc&limit=10"))
                    .header("apikey", SUPABASE_KEY)
                    .header("Accept-Profile", SCHEMA)
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();
    
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    
            if (response.statusCode() == 200) {
                return response.body();
            } else {
                throw new SupabaseClientException("Failed to get top 10 users by rank: " + response.body());
            }
        } catch (Exception e) {
            throw new SupabaseClientException("Error getting top 10 users by rank", e);
        }
    }    

    // Get user by ID 
    public String getUserById(String id) throws SupabaseClientException {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/user?id=eq." + id))
                .header("apikey", SUPABASE_KEY)
                .header("Accept-Profile", SCHEMA)
                .header("Content-Type", "application/json")
                .GET()
                .build();
    
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    
            if (response.statusCode() == 200) {
                return response.body();
            } else {
                throw new SupabaseClientException("Failed to get user: " + response.body());
            }
        } catch (IOException | InterruptedException e) {
            throw new SupabaseClientException("Error retrieving user by ID", e);
        }
    }    

    // Get users by a list of IDs
    public String getUsersByIds(List<String> ids) throws SupabaseClientException {
        try{
            // Format the filter as: or=(id.eq.id1,id.eq.id2,...)
            String idFilter = "or=(" + ids.stream()
                                        .map(id -> "id.eq." + id)
                                        .collect(Collectors.joining(",")) + ")";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(SUPABASE_URL + "/rest/v1/user?" + idFilter))
                    .header("apikey", SUPABASE_KEY)
                    .header("Accept-Profile", SCHEMA)
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                return response.body();
            } else {
                throw new SupabaseClientException("Failed to get user: " + response.body());
            }
        } catch (Exception e) {
            throw new SupabaseClientException("Error getting users by ids", e);
        }
    }

    // Get users by role
    public String getUsersByRole(String role) throws SupabaseClientException {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/user?role=ilike." + role))
                .header("apikey", SUPABASE_KEY)
                .header("Accept-Profile", SCHEMA)
                .header("Content-Type", "application/json")
                .GET()
                .build();
    
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    
            if (response.statusCode() == 200) {
                return response.body();
            } else {
                throw new SupabaseClientException("Failed to get users by role: " + response.body());
            }
        } catch (IOException | InterruptedException e) {
            throw new SupabaseClientException("Error retrieving users by role", e);
        }
    }    

    // Create a new user
    public String createUser(String userJson) throws Exception {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/user"))
                .header("apikey", SUPABASE_KEY)
                .header("Accept-Profile", SCHEMA)
                .header("Content-Type", "application/json")
                .POST(BodyPublishers.ofString(userJson))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (Exception e) {
            throw new SupabaseClientException("Error creating user", e);
        }
    }

    // Update user by ID 
    public String updateUser(String userId, String userJson) throws Exception {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/user?id=eq." + userId))
                .header("apikey", SUPABASE_KEY)
                .header("Accept-Profile", SCHEMA)
                .header("Content-Type", "application/json")
                .method("PUT", BodyPublishers.ofString(userJson))
                .build();
    
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (Exception e) {
            throw new SupabaseClientException("Error updating user", e);
        }
    }    

    // Delete user by ID
    public String deleteUser(String id) throws Exception {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(SUPABASE_URL + "/rest/v1/user?id=eq." + id))
                    .header("apikey", SUPABASE_KEY)
                    .header("Accept-Profile", SCHEMA)
                    .header("Content-Type", "application/json")
                    .DELETE()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (Exception e) {
            throw new SupabaseClientException("Error deleting user", e);
        }
    }
}
