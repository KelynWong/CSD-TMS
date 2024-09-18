package com.tms.user;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;

@Component
public class SupabaseClient {
    private final Dotenv dotenv = Dotenv.load();
    private final String SUPABASE_URL = dotenv.get("SUPABASE_URL");
    private final String SUPABASE_KEY = dotenv.get("SUPABASE_API_KEY");
    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String SCHEMA = "user";

    // Get all users
    public String getUsers() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/user"))
                .header("apikey", SUPABASE_KEY)
                .header("Accept-Profile", SCHEMA)
                .header("Content-Type", "application/json")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    // Get user by ID 
    public String getUserById(Long id) throws IOException, InterruptedException {
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
            throw new RuntimeException("Failed to get user: " + response.body());
        }
    }

    // Create a new user
    public String createUser(String userJson) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/user"))
                .header("apikey", SUPABASE_KEY)
                .header("Accept-Profile", SCHEMA)
                .header("Content-Type", "application/json")
                .POST(BodyPublishers.ofString(userJson))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    // Update user by ID 
    public String updateUser(Long id, String userJson) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/user?id=eq." + id))
                .header("apikey", SUPABASE_KEY)
                .header("Accept-Profile", SCHEMA)
                .header("Content-Type", "application/json")
                .PUT(BodyPublishers.ofString(userJson))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    // Delete user by ID
    public String deleteUser(Long id) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/rest/v1/user?id=eq." + id))
                .header("apikey", SUPABASE_KEY)
                .header("Accept-Profile", SCHEMA)
                .header("Content-Type", "application/json")
                .DELETE()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
