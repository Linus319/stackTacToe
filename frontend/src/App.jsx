import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import TicTacToeGrid from './TicTacToeGrid';

const socket = io('http://192.168.1.141:5050');

function App() {
  const [screen, setScreen] = useState("home");
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null); // 'X' | 'O' | null
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(null); // 'single' | 'double' | null
  const [joinCode, setJoinCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState(null) // 'waiting'
  const [mySymbol, setMySymbol] = useState(null); // 'X' | 'O' | null

  const API_BASE = 'http://192.168.1.141:5050/api';

  // set document title
  useEffect(() => {
    let title = "StackTacToe";
    if (screen === "in-game") {
      if (winner) {
        title = `🏆 ${winner} Wins! | StackTacToe`;
      } else if (mode === 'double') {
        title = `Multiplayer | StackTacToe`;
      } else if (mode === 'single') {
        title = `Single Player | StackTacToe`;
      }
    }
    document.title = title;
  }, [screen, winner, mode]);

  // listen for game updates
  useEffect(() => {
    socket.on("game_update", (data) => {
      setBoard(data.board);
      setCurrentPlayer(data.current_player);
      setWinner(data.winner);
      setGameStatus(data.status);
    });

    return () => {
      socket.off('game_update');
    };
  }, []);

  // join room when gameId changes
  useEffect(() => {
    if (!gameId) return;

    const joinRoom = () => {
      socket.emit('join', { gameId });
    };

    if (socket.connected) joinRoom();
    else socket.once('connect', joinRoom);

    // If already connected, just join immediately
    if (socket.connected) {
      joinRoom();
    } else {
      socket.once('connect', joinRoom);
    }

    // Clean up to avoid multiple listeners
    return () => {
      socket.off('connect', joinRoom);
    };
  }, [gameId]);

  // handle a player refreshing or closing the page
  useEffect(() => {
    const handleUnload = () => {
      if (mode === 'double' && gameId) {
        socket.emit('leave', { gameId });
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [mode, gameId]);

  // handle an opponent leaving a two player game
  useEffect(() => {
    socket.on('player_left', ({ status }) => {
      alert('Opponent left the game.');
      setGameStatus(status);
      setWinner(null);
      setBoard(null);
      setGameId(null);
      setMode(null);
      setScreen('home');
    });

    return () => {
      socket.off('player_left');
    };
  }, []);

  // check api connection
  useEffect(() => {
    const checkHealth = async () => {
      await axios.get(`${API_BASE}/health`)
        .then(response => setBackendStatus(`✅ ${response.data.message}`))
        .catch(() => setBackendStatus('❌ Backend not connected'));
    }
    checkHealth();
  }, [])

  useEffect(() => {
    socket.on('switch_game', async ({ gameId }) => {
      setGameId(gameId);
      await fetchGameState(gameId);
      setWinner(null);
    });

    return () => {
      socket.off('switch_game');
    };
  }, []);

  const fetchGameState = async (id) => {
    const res = await axios.get(`${API_BASE}/game/${id}/state`);
    setBoard(res.data.board);
    setCurrentPlayer(res.data.current_player);
    setWinner(res.data.winner);
  };

  const startSinglePlayerGame = async () => {
    try {
      const res = await axios.post(`${API_BASE}/game/new`, { mode: 'single' });
      setGameId(res.data.gameId);
      await fetchGameState(res.data.gameId);
      setMode('single');
      setMySymbol('X');
      setScreen("in-game");
    } catch (err) {
      console.error(err);
    }
  }

  const createMultiplayerGame = async () => {
    try {
      const res = await axios.post(`${API_BASE}/game/new`, { mode: "double" });
      setGameId(res.data.gameId);
      setJoinCode(res.data.joinCode);
      setMode('double');
      setGameStatus('waiting');
      setMySymbol('X');
      setScreen('in-game');
    } catch (err) {
      console.error(err);
    }
  }

  const joinMultiplayerGame = async () => {
    try {
      const res = await axios.post(`${API_BASE}/game/join`, { code: joinCode });
      setGameId(res.data.gameId);
      setMode('double');
      setGameStatus('active');
      setMySymbol('O');
      setScreen('in-game');

      socket.emit('join', { gameId: res.data.gameId });

    } catch (err) {
      console.error(err);
    }
  }

  const makeMove = async (x, y, z) => {
    if (!gameId || winner) return;

    if (mode === 'single' && currentPlayer !== 'X') return;
    if (mode === 'double' && currentPlayer !== mySymbol) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/game/${gameId}/move`, { x, y, z });
      await fetchGameState(gameId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const newGame = async () => {
    if (!gameId) return;

    try {
      const res = await axios.post(`${API_BASE}/game/new`, { mode: mode });
      const newId = res.data.gameId;

      socket.emit('new_game', { oldGameId: gameId, newGameId: newId });

      setGameId(newId);
      await fetchGameState(newId);
      setWinner(null);
    } catch (err) {
      console.error(err);
    }
  };

  const backHome = () => {
    if (mode === 'double' && gameId) {
      socket.emit('leave', { gameId });
    }

    setMode(null);
    setJoinCode(null);
    setGameId(null);
    setBoard(null);
    setWinner(null);
    setScreen("home");
  };

  const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#f0f0f0',
    fontFamily: 'sans-serif'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1000,
    background: 'white',
    padding: '10px 15px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif'
  };

  if (screen === "home") {
    return (
      <div style={centerStyle}>
        <h1>StackTacToe</h1>
        <button onClick={startSinglePlayerGame}>🎮 Single Player</button>
        <button onClick={() => setScreen("multiplayer-menu")}>👥 Two Player</button>
      </div>
    );
  }

  if (screen === "multiplayer-menu") {
    return (
      <div style={centerStyle}>
        <h2>Two Player</h2>
        <button onClick={createMultiplayerGame}>Create Game</button>
        <input
          placeholder="Enter Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button onClick={joinMultiplayerGame}>Join Game</button>
        <button onClick={backHome}>Back</button>
      </div>
    );
  }

  if (screen === "in-game") {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <div style={overlayStyle}>
          <h3>StackTacToe</h3>

          <p>Backend: {backendStatus}</p>

          <p>Game type: {mode}</p>

          <p>{mode && mode === 'double' ? `Join code: ${joinCode}` : ""}</p>

          <p>{gameStatus && mode === 'double' ? `Game status: ${gameStatus}` : ""}</p>

          <p>
            {winner
              ? `🎉 Winner: ${winner === 'X' ? "Red" : "Blue"}`
              : (currentPlayer === mySymbol ? "Your turn" : "Waiting for opponent")}
          </p>

          <button onClick={newGame} disabled={mode === 'double' && (!winner || loading)}>New Game</button>
          <button onClick={backHome}>Back</button>
        </div>

        <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} />
          <TicTacToeGrid gameId={gameId} board={board} makeMove={makeMove} isLoading={loading} />
          <OrbitControls />
        </Canvas>

      </div>
    );
  }

  return null;
}

export default App;
