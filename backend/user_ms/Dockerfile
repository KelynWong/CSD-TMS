FROM eclipse-temurin:17-jdk-focal
 
ARG SUPABASE_URL
ARG SUPABASE_API_KEY
ARG SUPABASE_BUCKET
ARG CLERK_SIGNING_SECRET
ARG DB_URL
ARG DB_USER
ARG DB_PW

ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_API_KEY=${SUPABASE_API_KEY}
ENV SUPABASE_BUCKET=${SUPABASE_BUCKET}
ENV CLERK_SIGNING_SECRET=${CLERK_SIGNING_SECRET}
ENV DB_URL=${DB_URL}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PW}

WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
 
COPY src ./src

EXPOSE 8083
CMD ["./mvnw", "spring-boot:run"]