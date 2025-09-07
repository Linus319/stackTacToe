import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import axios from 'axios';
import { useEffect, useState } from 'react';

function ClickableCube({ position, onClick, color = "orange" }) {
  const [hovered, setHovered] = useState(false);

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
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial
        color={hovered ? "lightblue" : color}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

function TicTacToeGrid() {
  const [cubeStates, setCubeStates] = useState({});

  const positions = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        positions.push([x * 1.2, y * 1.2, z * 1.2]);
      }
    }
  }

  const clickablePositions = positions.filter(pos => {
    const [x, y, z] = pos;
    return !(x === 0 && y === 0 && z === 0);
  });

  const handleCubeClick = (position) => {
    const key = position.join(',');
    setCubeStates(prev => ({
      ...prev,
      [key]: prev[key] ? (prev[key] === 'red' ? 'blue' : 'red') : 'red'
    }));
  };

  const getCubeColor = (position) => {
    const key = position.join(',');
    return cubeStates[key] || 'orange';
  };

  return (
    <>
      {clickablePositions.map((position, index) => (
        <ClickableCube
          key={index}
          position={position}
          onClick={() => handleCubeClick(position)}
          color={getCubeColor(position)}
        />
      ))}
    </>
  );
}

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    axios.get('http://192.168.1.141:5050/api/health')
      .then(response => response.json())
      .then(data => setBackendStatus(`✅ ${data.message}`))
      .catch(error => setBackendStatus('❌ Backend not connected'));
  }, []);

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
        <p>Backend Status: {backendStatus}</p>
        <p style={{ fontSize: '12px', margin: '5px 0' }}>
          Click cubes to cycle colors: Orange → Red → Blue
        </p>
      </div>

      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        <TicTacToeGrid />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}

export default App;
