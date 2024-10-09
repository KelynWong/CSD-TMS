FROM eclipse-temurin:17-jdk-focal
 
ARG DB_URL
ARG DB_USER
ARG DB_PASSWORD

ENV DB_URL=${DB_URL}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}

WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
 
COPY src ./src

# To run unit test
# RUN ./mvnw -Dtest=TournamentServiceTest test
# To run integration test
# RUN ./mvnw -Dtest=SpringBootIntegrationTest test

EXPOSE 8082
CMD ["./mvnw", "spring-boot:run"]