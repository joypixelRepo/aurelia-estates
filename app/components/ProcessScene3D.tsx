'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { MutableRefObject, ReactNode, Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

interface ProcessScene3DProps {
  progressRef: MutableRefObject<number>;
}

const GOLD = '#c9a368';
const GOLD_DARK = '#a8854f';
const GOLD_LIGHT = '#d4b483';

// Componente simplificado para pruebas
function SimpleWheel({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current && progressRef.current !== undefined) {
      // Rotación suave basada en el progreso
      groupRef.current.rotation.y = progressRef.current * Math.PI * 2;
      groupRef.current.rotation.x = Math.sin(progressRef.current * Math.PI) * 0.3;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Anillo principal */}
      <mesh>
        <torusGeometry args={[2.5, 0.08, 64, 200]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.1} emissive={GOLD} emissiveIntensity={0.3} />
      </mesh>
      
      {/* Anillo secundario */}
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[2.2, 0.06, 64, 200]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Esfera central */}
      <mesh>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial 
          color={GOLD} 
          metalness={0.95} 
          roughness={0.15}
          emissive={GOLD}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Partículas decorativas */}
      {Array.from({ length: 200 }).map((_, i) => {
        const angle = (i / 200) * Math.PI * 2;
        const radius = 3;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle * 2) * 0.5, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color={GOLD_LIGHT} emissive={GOLD} emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ProcessScene3D({ progressRef }: ProcessScene3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-black" />;
  }

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.5, 7], fov: 45 }}
      gl={{ antialias: true }}
      style={{ position: 'absolute', inset: 0, background: '#000' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[0, 2, 4]} intensity={0.8} color={GOLD} />
        <SimpleWheel progressRef={progressRef} />
        <Environment preset="city" background={false} />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={8} blur={2.5} far={4} color="#000" />
      </Suspense>
    </Canvas>
  );
}