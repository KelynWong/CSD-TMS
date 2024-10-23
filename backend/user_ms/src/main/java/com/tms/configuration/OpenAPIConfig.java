package com.tms.configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;


@OpenAPIDefinition(
  info = @Info(
  title = "User and ratings API",
  version = "1.0.0",
  description = "This is a API for user_ms",
    contact = @Contact(
    name = "Kelyn Wong", 
    email = "kelynwonget@gmail.com"
  ),
  license = @License(
    name = "Apache License 2.0", 
    url = "NA")),
  servers = @Server(url = "http://localhost:8083")
)
public class OpenAPIConfig {
    
}