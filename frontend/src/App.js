import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import axios from 'axios';
import { useEffect, useState } from 'react';

function ClickableCube({ position, onClick, color }) {
  const [hovered, setHovered] = useState(false);

  const sideLen = 0.9;

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[sideLen, sideLen, sideLen]} />
      <meshStandardMaterial
        color={hovered ? "lightblue" : color}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function TicTacToeGrid({ gameId, board, makeMove }) {

  const positions = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        if (!(x === 1 && y === 1 && z === 1)) { // skip center
          positions.push([x, y, z]);
        }
      }
    }
  }

  const getCubeColor = (x, y, z) => {
    const cell = board?.[x]?.[y]?.[z];
    if (cell === 'X') return 'red';
    if (cell === 'O') return 'blue';
    return 'orange';
  };

  return (
    <>
      {positions.map((pos, index) => {
        const [x, y, z] = pos;
        const renderPos = [(x - 1) * 1.2, (y - 1) * 1.2, (z - 1) * 1.2]
        return (
          <ClickableCube
            key={index}
            position={renderPos}
            onClick={() => makeMove(x, y, z)}
            color={getCubeColor(x, y, z)}
          />
        );
      })}
    </>
  );
}

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  const API_BASE = 'http://192.168.1.141:5050/api';

  useEffect(() => {
    axios.get(`${API_BASE}/health`)
      .then(response => setBackendStatus(`✅ ${response.data.message}`))
      .catch(() => setBackendStatus('❌ Backend not connected'));

    axios.post(`${API_BASE}/game/new`)
      .then(res => {
        setGameId(res.data.gameId);
        fetchGameState(res.data.gameId);
      })
      .catch(() => setBackendStatus('❌ Could not start game'))
  }, []);

  const fetchGameState = async (id) => {
    const res = await axios.get(`${API_BASE}/game/${id}/state`);
    setBoard(res.data.board);
    setCurrentPlayer(res.data.current_player);
    setWinner(res.data.winner);
  };

  const makeMove = async (x, y, z) => {
    if (!gameId || winner) return;
    try {
      await axios.post(`${API_BASE}/game/${gameId}/move`, { x, y, z });
      await fetchGameState(gameId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        background: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>StackTacToe</h3>
        <p>Backend: {backendStatus}</p>
        {winner ? <p>🎉 Winner: {winner}</p> : <p>Current Player: {currentPlayer}</p>}
      </div>

      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <TicTacToeGrid gameId={gameId} board={board} makeMove={makeMove} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
