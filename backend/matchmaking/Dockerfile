FROM eclipse-temurin:17-jdk-focal
 
ARG MATCH_URL
ARG TOURNAMENT_URL
ARG PLAYER_URL
ARG RATING_URL

ENV MATCH_URL=${MATCH_URL}
ENV TOURNAMENT_URL=${TOURNAMENT_URL}
ENV PLAYER_URL=${PLAYER_URL}
ENV RATING_URL=${RATING_URL}

WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
 
COPY src ./src

EXPOSE 8081
CMD ["./mvnw", "spring-boot:run"]