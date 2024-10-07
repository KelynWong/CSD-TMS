package com.tms.configuration;

import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.info.*;
import io.swagger.v3.oas.annotations.servers.Server;


@OpenAPIDefinition(
  info = @Info(
  title = "Player Glicko-2 rating API",
  version = "1.0.0",
  description = "This is a simple API for getting player rating data",
    contact = @Contact(
    name = "Your Name", 
    url = "Your Website", 
    email = "youremail@smu.edu.sg"
  ),
  license = @License(
    name = "Apache License 2.0", 
    url = "NA")),
  servers = @Server(url = "http://localhost:8084")
)
public class OpenAPIConfig {
    
}