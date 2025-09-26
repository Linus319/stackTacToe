// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
// import TicTacToeGrid from './components/TicTacToeGrid';
import { useSocketEvent } from './utils/useSocketEvent';
import HomeScreen from './components/HomeScreen';
import MultiplayerMenu from './components/MultiplayerMenu';
import GameScreen from './components/GameScreen';

const socket = io(process.env.REACT_APP_API_URL);

function App() {
  const [screen, setScreen] = useState("home");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(null); // 'single' | 'double' | null

  const [gameState, setGameState] = useState({
    board: null,
    currentPlayer: null,
    winner: null,
    joinCode: "",
    gameId: null,
    gameStatus: null,
    mySymbol: null
  })
  const { board, currentPlayer, winner, joinCode, gameId, gameStatus, mySymbol } = gameState;

  const setBoard = (board) => setGameState(prev => ({ ...prev, board }));
  const setCurrentPlayer = (currentPlayer) => setGameState(prev => ({ ...prev, currentPlayer }));
  const setWinner = (winner) => setGameState(prev => ({ ...prev, winner }));
  const setJoinCode = (joinCode) => setGameState(prev => ({ ...prev, joinCode }));
  const setGameId = (gameId) => setGameState(prev => ({ ...prev, gameId }));
  const setGameStatus = (gameStatus) => setGameState(prev => ({ ...prev, gameStatus }));
  const setMySymbol = (mySymbol) => setGameState(prev => ({ ...prev, mySymbol }));

  const updateGameFromSocket = (data) => {
    setGameState(prev => ({
      ...prev,
      board: data.board,
      currentPlayer: data.current_player,
      winner: data.winner,
      gameStatus: data.status
    }));
  };

  const resetGameState = () => {
    setGameState({
      board: null,
      currentPlayer: null,
      winner: null,
      joinCode: null,
      gameId: null,
      gameStatus: null,
      mySymbol: null
    });
  };

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

  useSocketEvent(socket, "game_update", (data) => {
    updateGameFromSocket(data);
  })

  useSocketEvent(socket, "switch_game", async ({ gameId }) => {
    setGameId(gameId);
    await fetchGameState(gameId);
    setWinner(null);
  })

  useSocketEvent(socket, 'player_left', ({ status }) => {
    alert('Opponent left the game.');
    resetGameState();
    setMode(null);
    setScreen('home');
  })

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
    resetGameState();
    setMode(null);
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
      <HomeScreen 
        startSinglePlayerGame={startSinglePlayerGame} 
        setScreen={setScreen} 
        centerStyle={centerStyle}
      />
    );
  }

  if (screen === "multiplayer-menu") {
    return (
      <MultiplayerMenu 
        centerStyle={centerStyle}
        createMultiplayerGame={createMultiplayerGame}
        joinCode={joinCode}
        setJoinCode={setJoinCode}
        joinMultiplayerGame={joinMultiplayerGame}
        backHome={backHome}
      />
    )
  }

  if (screen === "in-game") {
    return (
      <GameScreen 
        overlayStyle={overlayStyle}
        mode={mode}
        winner={winner}
        currentPlayer={currentPlayer}
        gameStatus={gameStatus}
        mySymbol={mySymbol}
        loading={loading}
        joinCode={joinCode}
        newGame={newGame}
        backHome={backHome}
        gameId={gameId}
        board={board}
        makeMove={makeMove}
      />
      // <div style={{ width: '100vw', height: '100vh' }}>
      //   <div style={overlayStyle}>
      //     <h3>StackTacToe</h3>

      //     <p>Game type: {mode}</p>

      //     <p>{mode && mode === 'double' ? `Join code: ${joinCode}` : ""}</p>

      //     <p>{gameStatus && mode === 'double' ? `Game status: ${gameStatus}` : ""}</p>

      //     <p>
      //       {winner
      //         ? `🎉 Winner: ${winner === 'X' ? "Red" : "Blue"}`
      //         : (currentPlayer === mySymbol ? "Your turn" : "Waiting for opponent")}
      //     </p>

      //     <button onClick={newGame} disabled={mode === 'double' && (!winner || loading)}>New Game</button>
      //     <button onClick={backHome}>Back</button>
      //   </div>

      //   <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
      //     <ambientLight intensity={0.6} />
      //     <pointLight position={[10, 10, 10]} />
      //     <TicTacToeGrid gameId={gameId} board={board} makeMove={makeMove} isLoading={loading} />
      //     <OrbitControls />
      //   </Canvas>

      // </div>
    );
  }

  return null;
}

export default App;
