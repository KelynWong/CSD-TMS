package com.tms.user;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**") // Adjust this to match your endpoint pattern
        .allowedOrigins("http://localhost:3000") // Allow this origin
        .allowedMethods("GET", "POST", "PUT", "DELETE") // Specify allowed methods
        .allowedHeaders("*") // Allow all headers
        .allowCredentials(true); // Allow credentials (optional)
  }
}