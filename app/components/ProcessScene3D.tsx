'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { MutableRefObject, ReactNode, Suspense, useRef } from 'react';
import * as THREE from 'three';

interface ProcessScene3DProps {
  progressRef: MutableRefObject<number>;
}

const GOLD = '#c9a368';
const GOLD_DARK = '#a8854f';
const GOLD_LIGHT = '#d4b483';
const PAPER = '#efe6d4';
const PAPER_DARK = '#cdbfa3';
const LEATHER = '#1c1812';

/* -------------------- 3D OBJECTS -------------------- */

function Compass() {
  const needle = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!needle.current) return;
    needle.current.rotation.y =
      state.clock.elapsedTime * 0.5 + Math.sin(state.clock.elapsedTime * 0.4) * 0.55;
  });
  return (
    <group rotation={[-0.4, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 0.13, 64]} />
        <meshPhysicalMaterial
          color={GOLD}
          metalness={0.98}
          roughness={0.22}
          clearcoat={1}
          clearcoatRoughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.064, 0]}>
        <torusGeometry args={[0.55, 0.018, 12, 64]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <sphereGeometry args={[0.5, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
        <meshPhysicalMaterial
          color="#f3ede2"
          metalness={0.1}
          roughness={0.04}
          transmission={0.9}
          ior={1.5}
          thickness={0.4}
          transparent
          opacity={0.35}
        />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.5, 0.04, 16, 64]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.066, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.005, 48]} />
        <meshStandardMaterial color="#0e0d10" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.068, 0]}>
        <torusGeometry args={[0.38, 0.005, 8, 48]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.25} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const major = i % 3 === 0;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.4, 0.071, Math.cos(a) * 0.4]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[major ? 0.018 : 0.01, 0.002, major ? 0.07 : 0.04]} />
            <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.25} />
          </mesh>
        );
      })}
      <group ref={needle} position={[0, 0.08, 0]}>
        <mesh>
          <boxGeometry args={[0.035, 0.008, 0.62]} />
          <meshStandardMaterial
            color={GOLD_LIGHT}
            metalness={1}
            roughness={0.15}
            emissive={GOLD}
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[0, 0, 0.28]}>
          <coneGeometry args={[0.035, 0.1, 16]} />
          <meshStandardMaterial
            color={GOLD_LIGHT}
            metalness={1}
            roughness={0.15}
            emissive={GOLD}
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, 0, -0.28]}>
          <coneGeometry args={[0.025, 0.06, 16]} />
          <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.3} />
        </mesh>
      </group>
      <mesh position={[0, 0.085, 0]}>
        <cylinderGeometry args={[0.028, 0.032, 0.03, 16]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.02, 0.55]}>
        <boxGeometry args={[0.16, 0.08, 0.06]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Folio() {
  return (
    <group rotation={[-0.35, 0.5, 0]}>
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[1.05, 0.16, 0.78]} />
        <meshPhysicalMaterial
          color={LEATHER}
          roughness={0.72}
          clearcoat={0.4}
          clearcoatRoughness={0.6}
        />
      </mesh>
      <mesh position={[0, 0.045, 0]}>
        <boxGeometry args={[1.02, 0.005, 0.755]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.04, 0.395]}>
        <boxGeometry args={[1.0, 0.14, 0.012]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0.53, -0.04, 0]}>
        <boxGeometry args={[0.012, 0.14, 0.78]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.052, 0]}>
        <boxGeometry args={[0.28, 0.008, 0.18]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.058, 0]}>
        <boxGeometry args={[0.22, 0.004, 0.12]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[-0.53, -0.04, 0]}>
        <boxGeometry args={[0.014, 0.18, 0.78]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.32} />
      </mesh>
      <mesh position={[0.53, 0.05, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.18, 12]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Pin() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.4, 48, 32, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
        <meshPhysicalMaterial
          color={GOLD}
          metalness={0.98}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.2}
        />
      </mesh>
      <mesh position={[0, -0.34, 0]}>
        <coneGeometry args={[0.32, 0.6, 48]} />
        <meshPhysicalMaterial
          color={GOLD}
          metalness={0.98}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.2}
        />
      </mesh>
      <mesh position={[0, -0.62, 0]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.2, 0.36]}>
        <circleGeometry args={[0.13, 32]} />
        <meshStandardMaterial color="#0c0b0e" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.2, 0.361]}>
        <ringGeometry args={[0.13, 0.155, 32]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <torusGeometry args={[0.34, 0.008, 8, 32]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Pen() {
  return (
    <group rotation={[0.2, 0, -Math.PI / 3.6]}>
      <mesh>
        <cylinderGeometry args={[0.08, 0.09, 1.2, 48]} />
        <meshPhysicalMaterial
          color="#0c0a0e"
          metalness={0.45}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.092, 0.092, 0.32, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.98} roughness={0.17} />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <sphereGeometry args={[0.092, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={GOLD} metalness={0.98} roughness={0.17} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[0.092, 0.008, 12, 48]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <torusGeometry args={[0.092, 0.005, 12, 48]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.35} />
      </mesh>
      <mesh position={[0.1, 0.6, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.025, 0.5, 0.06]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[0.105, 0.4, 0]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <torusGeometry args={[0.087, 0.006, 12, 48]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.085, 0.07, 0.15, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.98} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.78, 0]}>
        <coneGeometry args={[0.07, 0.22, 32]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[0, -0.78, 0.001]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.004, 0.18, 0.001]} />
        <meshStandardMaterial color="#0a0a0c" />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Deed() {
  return (
    <group rotation={[0.3, 0.35, -0.1]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.34, 1.3, 64]} />
        <meshStandardMaterial color={PAPER} roughness={0.88} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 1.32, 48]} />
        <meshStandardMaterial color={PAPER_DARK} roughness={0.85} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 1.34, 48]} />
        <meshStandardMaterial color={PAPER} roughness={0.85} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.66, 0, 0]}>
        <cylinderGeometry args={[0.355, 0.355, 0.04, 48]} />
        <meshStandardMaterial color={PAPER_DARK} roughness={0.7} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.66, 0, 0]}>
        <cylinderGeometry args={[0.355, 0.355, 0.04, 48]} />
        <meshStandardMaterial color={PAPER_DARK} roughness={0.7} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.36, 0.04, 16, 48]} />
        <meshPhysicalMaterial
          color={GOLD}
          metalness={1}
          roughness={0.2}
          clearcoat={0.8}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[0.36, 0.008, 8, 48]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.05, 32]} />
        <meshPhysicalMaterial color="#7d1818" roughness={0.55} clearcoat={0.5} />
      </mesh>
      <mesh position={[0.12, 0.32, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshPhysicalMaterial color="#7d1818" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.005, 24]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Key() {
  return (
    <group rotation={[0, 0, -Math.PI / 7]}>
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[0.34, 0.07, 24, 64]} />
        <meshPhysicalMaterial
          color={GOLD}
          metalness={0.98}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[0.21, 0.022, 16, 48]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.34, 0.55 + Math.cos(a) * 0.0, Math.cos(a) * 0.04]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.2} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.105, 0.08, 0.12, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.98} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <torusGeometry args={[0.083, 0.008, 12, 32]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.85, 24]} />
        <meshPhysicalMaterial
          color={GOLD}
          metalness={0.98}
          roughness={0.18}
          clearcoat={1}
        />
      </mesh>
      <mesh position={[0, -0.28, 0.055]}>
        <boxGeometry args={[0.012, 0.7, 0.005]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.4} />
      </mesh>
      <mesh position={[0.13, -0.55, 0]}>
        <boxGeometry args={[0.16, 0.11, 0.05]} />
        <meshStandardMaterial color={GOLD} metalness={0.98} roughness={0.2} />
      </mesh>
      <mesh position={[0.16, -0.7, 0]}>
        <boxGeometry args={[0.22, 0.1, 0.05]} />
        <meshStandardMaterial color={GOLD} metalness={0.98} roughness={0.2} />
      </mesh>
      <mesh position={[0.05, -0.73, 0]}>
        <boxGeometry args={[0.04, 0.06, 0.05]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* -------------------- WHEEL -------------------- */

const ITEMS = [Compass, Folio, Pin, Pen, Deed, Key] as const;

function WheelItem({
  index,
  total,
  radius,
  rotationRef,
  Item,
}: {
  index: number;
  total: number;
  radius: number;
  rotationRef: MutableRefObject<number>;
  Item: () => ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const baseAngle = (index / total) * Math.PI * 2;
  const tmpScale = useRef(0.45);

  useFrame((state) => {
    if (!ref.current || !innerRef.current) return;
    const a = baseAngle + rotationRef.current;

    ref.current.position.x = Math.sin(a) * radius;
    ref.current.position.z = Math.cos(a) * radius;
    ref.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.06 - 0.05;

    const front = Math.max(0, Math.cos(a));
    const target = 0.42 + front * 0.45;
    tmpScale.current = THREE.MathUtils.lerp(tmpScale.current, target, 0.1);
    ref.current.scale.setScalar(tmpScale.current);

    innerRef.current.rotation.y = state.clock.elapsedTime * 0.25 + index * 0.7;
  });

  return (
    <group ref={ref}>
      <group ref={innerRef}>
        <Item />
      </group>
    </group>
  );
}

function Wheel({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const rotationRef = useRef(0);
  const radius = 2.7;

  useFrame(() => {
    const target = -progressRef.current * Math.PI * 2 * ((ITEMS.length - 1) / ITEMS.length);
    rotationRef.current += (target - rotationRef.current) * 0.08;
  });

  return (
    <>
      {ITEMS.map((Item, i) => (
        <WheelItem
          key={i}
          index={i}
          total={ITEMS.length}
          radius={radius}
          rotationRef={rotationRef}
          Item={Item}
        />
      ))}
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#f3ede2" />
      <directionalLight position={[-5, 3, -2]} intensity={0.35} color={GOLD} />
      <pointLight position={[0, 1.0, 5]} intensity={3.2} color={GOLD_LIGHT} distance={10} />
      <spotLight
        position={[0, 5, 3]}
        angle={0.55}
        penumbra={0.8}
        intensity={3.5}
        color="#e6dcc8"
      />
    </>
  );
}

export default function ProcessScene3D({ progressRef }: ProcessScene3DProps) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.6, 7.2], fov: 32 }}
      gl={{ antialias: true, alpha: false }}
      style={{ position: 'absolute', inset: 0, background: '#000' }}
      onCreated={({ gl }) => gl.setClearColor('#000000', 1)}
    >
      <Suspense fallback={null}>
        <Environment preset="apartment" />
        <Lights />
        <Wheel progressRef={progressRef} />
        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.4}
          scale={8}
          blur={2.8}
          far={3}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}