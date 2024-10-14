# Run Backend

To run the backend services, first cd into the backend folder. Then, you can use Docker Compose:

- To rebuild images:

  ```sh
  docker-compose up --build
  ```

- To run from existing images:

  ```sh
  docker compose up
  ```

## Individual Swagger Pages

| Service         | Local URL                                     | Deployed URL                                    |
|-----------------|-----------------------------------------------| ----------------------------------------------- |
| Match-MS        | [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) | [http://57.151.43.79:8080/swagger-ui/index.html](http://57.151.43.79:8080/swagger-ui/index.html) |
| Matchmaking-MS  | [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html) | [http://???:8081/swagger-ui/index.html](http://???:8081/swagger-ui/index.html) |
| Tournament-MS   | [http://localhost:8082/swagger-ui/index.html](http://localhost:8082/swagger-ui/index.html) | [http://20.241.220.108:8082/swagger-ui/index.html](http://20.241.220.108:8082/swagger-ui/index.html) |
| User-MS         | [http://localhost:8083/swagger-ui/index.html](http://localhost:8083/swagger-ui/index.html) | [http://52.191.103.210:8083/swagger-ui/index.html](http://52.191.103.210:8083/swagger-ui/index.html) |
| Rating-MS         | [http://localhost:8084/swagger-ui/index.html](http://localhost:8084/swagger-ui/index.html) | [http://4.156.48.5:8084/swagger-ui/index.html](http://4.156.48.5:8084/swagger-ui/index.html) |
