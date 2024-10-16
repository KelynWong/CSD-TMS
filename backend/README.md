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
| Match-MS        | [http://localhost:8080/matches/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) | [http://172.206.210.225/matches/swagger-ui/index.html](http://172.206.210.225/matches/swagger-ui/index.html) |
| Matchmaking-MS  | [http://localhost:8081/matchmaking/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html) | [http://172.206.210.225/matchmaking/index.html](http://172.206.210.225/matchmaking/index.html) |
| Tournament-MS   | [http://localhost:8082/tournaments/swagger-ui/index.html](http://localhost:8082/swagger-ui/index.html) | [http://172.206.210.225/tournaments/swagger-ui/index.html](http://172.206.210.225/tournaments/swagger-ui/index.html) |
| User-MS         | [http://localhost:8083/users/swagger-ui/index.html](http://localhost:8083/swagger-ui/index.html) | [http://172.206.210.225/users/swagger-ui/index.html](http://172.206.210.225/users/swagger-ui/index.html) |
| Rating-MS         | [http://localhost:8084/ratings/swagger-ui/index.html](http://localhost:8084/swagger-ui/index.html) | [http://172.206.210.225/ratings/swagger-ui/index.html](http://172.206.210.225/ratings/swagger-ui/index.html) |
