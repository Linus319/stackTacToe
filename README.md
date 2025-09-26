# ThicTacToe
A 3D Tic Tac Toe game with real-time multiplayer support, built with Flask, React, and Three.js.
Add screenshot here.

## Features
- Multiplayer Mode: Create/join games with short codes.
- Single Player Mode: Play against a simple robot.
- 3D Game Board: Interactive 3D grid using Three.js.
- Real-Time Updates: WebSocket communication with Flack-SocketIO.
- REST API for game creation, joining, and moves.

## Tech Stack
### Frontend
- React
- ...

### Backend
- Python + Flask
- ...

## Getting Started
Prerequisites:
- Node.js
- Python3
- pip

Local Setup:
1. Clone the repository
`commands here`
2. Backend Setup (Flask)
`commands here`
3. Frontend Setup (React)
`commands here`

## API Endpoints
- Health Check: `GET /api/health → { status: "healthy" }`
- Create Game: `POST /api/game/new → { gameId, joinCode }`
- Join Game: `POST /api/game/join with { code }`
- Make Move: `POST /api/game/<gameId>/move with { x, y, z }`
- Get Game State: `GET /api/game/<gameId>/state`

## Deployment

Local: run Flask + React dev servers as above.
Docker (optional): Create a Dockerfile for backend + frontend, then run: `commands here`

## Screenshots
Add some screenshots or GIFs of gameplay here.

## Future Improvements
- Add authentication (user accounts).
- Smarter AI for single-player mode.
- Deploy to AWS (EC2 + Docker + CI/CD).

## Author
- Thomas Fagan - [GitHub](https://github.com/Linus319)