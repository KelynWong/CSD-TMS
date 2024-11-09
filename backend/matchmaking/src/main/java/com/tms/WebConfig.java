package com.tms;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // Adjust this to match your endpoint pattern
        .allowedOrigins("http://localhost:3000", "https://csd-tms.vercel.app") // Allow this origin
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Specify allowed methods
        .allowedHeaders("*"); // Allow all headers
        // .allowCredentials(true); // Allow credentials
  }
}