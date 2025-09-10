import { useState } from 'react';

function ClickableCube({ position, onClick, color }) {
  const [hovered, setHovered] = useState(false);

  const sideLen = 0.67;

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

export default ClickableCube;