package com.tms.configuration;

import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.info.*;
import io.swagger.v3.oas.annotations.servers.Server;


@OpenAPIDefinition(
  info = @Info(
  title = "Match and Game API",
  version = "1.0.0",
  description = "This is a simple API for getting match and games data...",
    contact = @Contact(
    name = "Your Name", 
    url = "Your Website", 
    email = "youremail@smu.edu.sg"
  ),
  license = @License(
    name = "Apache License 2.0", 
    url = "NA")),
    servers = {
      @Server(url = "http://localhost:8080"),
      @Server(url = "https://csdtmssgapi.azure-api.net/matches")
    }
)
public class OpenAPIConfig {
    
}