import { useState, useRef } from 'react';
import * as THREE from 'three';

function ClickableCube({ position, onClick, color }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const sideLen = 0.67;

  return (
    <group position={position} scale={hovered ? 1.1 : 1}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[sideLen, sideLen, sideLen]} />
        <meshStandardMaterial
          color={hovered ? "lightblue" : color}
          transparent
          opacity={0.8}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(sideLen, sideLen, sideLen)]} />
        <lineBasicMaterial color={color} linewidth={2} />
      </lineSegments>
    </group>
  );
}

export default ClickableCube;