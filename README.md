# CSD-TMS

## Overview
The **Badminton Tournament Management System (BTMS)** is an intuitive platform designed to streamline the entire tournament lifecycle, from registration and scheduling to scoring and rankings. It serves organizers, participants, and spectators with features like:
- Easy tournament management.
- Player ranking and scoring integration using the **Glicko rating system** for fair matchmaking.

## Features
- **Tournament Registration**: Smooth participant sign-ups.
- **Scheduling and Matches**: Automated tournament scheduling.
- **Scoring and Rankings**: Real-time updates and player rankings.
- **Spectator Dashboard**: Stay updated with tournament progress.

---

## Installation
Follow these steps to install and set up the project:

### Prerequisites
- **Node.js** and **npm** installed.
- **Docker** installed for backend containerization.

### Steps
1. **Clone the repository**:
    ```bash
    git clone https://github.com/KelynWong/CSD-TMS.git
    ```
2. **Navigate to the project directory**:
    ```bash
    cd CSD-TMS
    ```

3. **Set up the Frontend**:
    - Navigate to the `frontend` directory:
      ```bash
      cd frontend
      ```
    - Install dependencies:
      ```bash
      npm install
      ```

4. **Set up the Backend**:
    - Open a new terminal and navigate to the `backend` directory:
      ```bash
      cd backend
      ```
    - Build and start the backend using Docker:
      ```bash
      docker compose up --build
      ```

---

## Usage
To start the application:

1. **Start the Frontend**:
    - In the `frontend` directory, run:
      ```bash
      npm run dev
      ```

2. **Access the Dashboard**:
    - Open your browser and navigate to:
      ```
      http://localhost:3000
      ```
