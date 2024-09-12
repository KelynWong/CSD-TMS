# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY target/user-service-0.0.1-SNAPSHOT.jar user-service.jar

# Expose port 8081
EXPOSE 8081

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "user-service.jar"]
