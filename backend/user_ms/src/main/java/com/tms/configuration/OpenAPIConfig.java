package com.tms.configuration;

import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.info.*;
import io.swagger.v3.oas.annotations.servers.Server;


@OpenAPIDefinition(
  info = @Info(
  title = "Tournament Management Service API",
  version = "1.0.0",
  description = "This is a API for user_ms",
    contact = @Contact(
    name = "Kelyn Wong", 
    email = "kelynwonget@gmail.com"
  ),
  license = @License(
    name = "Apache License 2.0", 
    url = "NA")),
  servers = @Server(url = "http://localhost:8080")
)
public class OpenAPIConfig {
    
}