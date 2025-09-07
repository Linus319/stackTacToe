import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import axios from 'axios';
import { useEffect, useState } from 'react';

function TestCube() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}


function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    axios.get('http://192.168.1.141:5050/api/health')
      .then(response => {
        setBackendStatus(`✅ ${response.data.message}`);
      })
      .catch(error => {
        setBackendStatus('❌ Backend not connected');
      });
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background:'white', padding: '10px', borderRadius: '5px' }}>
        <h3>StackTacToe</h3>
        <p>Backend Status: {backendStatus}</p>
      </div>

      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TestCube />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
