FROM eclipse-temurin:17-jdk-focal

ARG DB_URL
ARG DB_USER
ARG DB_PW

ENV DB_URL=${DB_URL}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PW}

WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
 
COPY src ./src

EXPOSE 8080
CMD ["./mvnw", "spring-boot:run"]