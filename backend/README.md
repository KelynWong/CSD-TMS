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

| Service        | Local URL                                                                                                          | Deployed URL                                                                                                                               |
|----------------|--------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Match-MS       | [http://localhost:8080/matches/swagger-ui/index.html](http://localhost:8080/matches/swagger-ui/index.html)         | [https://csdtmssgapi.azure-api.net/matches/swagger-ui/index.html](https://csdtmssgapi.azure-api.net/matches/swagger-ui/index.html)         |
| Matchmaking-MS | [http://localhost:8081/matchmaking/swagger-ui/index.html](http://localhost:8081/matchmaking/swagger-ui/index.html) | [https://csdtmssgapi.azure-api.net/matchmaking/index.html](https://csdtmssgapi.azure-api.net/matchmaking/index.html)                       |
| Tournament-MS  | [http://localhost:8082/tournaments/swagger-ui/index.html](http://localhost:8082/tournaments/swagger-ui/index.html) | [https://csdtmssgapi.azure-api.net/tournaments/swagger-ui/index.html](https://csdtmssgapi.azure-api.net/tournaments/swagger-ui/index.html) |
| User-MS        | [http://localhost:8083/users/swagger-ui/index.html](http://localhost:8083/users/swagger-ui/index.html)             | [https://csdtmssgapi.azure-api.net/users/swagger-ui/index.html](https://csdtmssgapi.azure-api.net/users/swagger-ui/index.html)             |
