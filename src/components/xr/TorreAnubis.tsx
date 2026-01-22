import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float, 
  Sphere,
  MeshDistortMaterial,
  Trail,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';

interface TorreAnubisProps {
  position?: [number, number, number];
  threatLevel?: 'safe' | 'warning' | 'danger';
  incidentCount?: number;
  isActive?: boolean;
}

// Eye of Anubis - Sentinel orb at top
const EyeOfAnubis = ({ threatLevel }: { threatLevel: string }) => {
  const eyeRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);
  
  const colors = {
    safe: '#00ff88',
    warning: '#ffaa00',
    danger: '#ff0044'
  };
  
  const color = colors[threatLevel as keyof typeof colors] || colors.safe;
  
  useFrame((state) => {
    if (eyeRef.current) {
      eyeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
      eyeRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.2;
    }
    if (pupilRef.current) {
      // Pulse based on threat
      const pulseSpeed = threatLevel === 'danger' ? 4 : threatLevel === 'warning' ? 2 : 1;
      pupilRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.1);
    }
  });

  return (
    <group ref={eyeRef}>
      {/* Outer eye structure */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color="#0a0a0f"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Inner eye glow */}
      <mesh ref={pupilRef} position={[0, 0, 0.8]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={3}
        />
      </mesh>
      
      {/* Scanning beams */}
      <group rotation={[0, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh 
            key={i} 
            position={[0, 0, 1]} 
            rotation={[0, 0, (Math.PI / 2) * i]}
          >
            <coneGeometry args={[0.1, 3, 8]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={2}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Tower segment with hieroglyphic patterns
const TowerSegment = ({ 
  position, 
  height, 
  radiusTop, 
  radiusBottom,
  isGlowing 
}: { 
  position: [number, number, number];
  height: number;
  radiusTop: number;
  radiusBottom: number;
  isGlowing?: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const patternRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (patternRef.current && isGlowing) {
      patternRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Main segment */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[radiusTop, radiusBottom, height, 8, 4]} />
        <meshStandardMaterial 
          color="#0a0a12"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Hieroglyphic pattern overlay */}
      <mesh ref={patternRef}>
        <cylinderGeometry args={[radiusTop + 0.01, radiusBottom + 0.01, height * 0.9, 8, 1, true]} />
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
      
      {/* Energy ring at segment joint */}
      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radiusTop + 0.1, 0.05, 8, 32]} />
        <meshStandardMaterial 
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
};

// Orbiting sentinel drones
const SentinelDrone = ({ 
  orbitRadius, 
  speed, 
  offset,
  threatLevel 
}: { 
  orbitRadius: number;
  speed: number;
  offset: number;
  threatLevel: string;
}) => {
  const droneRef = useRef<THREE.Group>(null);
  
  const color = threatLevel === 'danger' ? '#ff0044' : 
                threatLevel === 'warning' ? '#ffaa00' : '#00ffff';
  
  useFrame((state) => {
    if (droneRef.current) {
      const angle = state.clock.elapsedTime * speed + offset;
      droneRef.current.position.x = Math.cos(angle) * orbitRadius;
      droneRef.current.position.z = Math.sin(angle) * orbitRadius;
      droneRef.current.rotation.y = -angle;
    }
  });

  return (
    <group ref={droneRef}>
      <Trail
        width={1}
        length={8}
        color={color}
        attenuation={(t) => t * t}
      >
        <Float speed={4} rotationIntensity={0.5} floatIntensity={0.3}>
          <mesh>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={2}
            />
          </mesh>
        </Float>
      </Trail>
    </group>
  );
};

// Shield barrier
const ShieldBarrier = ({ 
  radius, 
  height, 
  isActive,
  threatLevel 
}: { 
  radius: number;
  height: number;
  isActive: boolean;
  threatLevel: string;
}) => {
  const shieldRef = useRef<THREE.Mesh>(null);
  
  const color = threatLevel === 'danger' ? '#ff0044' : 
                threatLevel === 'warning' ? '#ffaa00' : '#00ffff';
  
  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      shieldRef.current.scale.setScalar((isActive ? 1 : 0.8) + Math.sin(state.clock.elapsedTime * 2) * 0.02);
    }
  });

  return (
    <mesh ref={shieldRef}>
      <cylinderGeometry args={[radius, radius, height, 6, 1, true]} />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={isActive ? 1 : 0.3}
        transparent
        opacity={isActive ? 0.2 : 0.05}
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
};

// Main Torre Anubis Component
const TorreAnubis = ({ 
  position = [0, 0, 0],
  threatLevel = 'safe',
  incidentCount = 0,
  isActive = true
}: TorreAnubisProps) => {
  // Tower segments configuration
  const segments = [
    { height: 8, radiusTop: 3, radiusBottom: 4 },
    { height: 6, radiusTop: 2.5, radiusBottom: 3 },
    { height: 5, radiusTop: 2, radiusBottom: 2.5 },
    { height: 4, radiusTop: 1.5, radiusBottom: 2 },
    { height: 3, radiusTop: 1, radiusBottom: 1.5 },
  ];
  
  let currentHeight = 0;
  
  return (
    <group position={position}>
      {/* Base platform */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[6, 7, 1, 8]} />
        <meshStandardMaterial 
          color="#050508"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* Tower segments */}
      {segments.map((seg, i) => {
        const segPosition: [number, number, number] = [0, currentHeight + seg.height / 2 + 1, 0];
        currentHeight += seg.height;
        return (
          <TowerSegment
            key={i}
            position={segPosition}
            height={seg.height}
            radiusTop={seg.radiusTop}
            radiusBottom={seg.radiusBottom}
            isGlowing={threatLevel !== 'safe'}
          />
        );
      })}
      
      {/* Eye of Anubis at top */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[0, currentHeight + 3, 0]}>
          <EyeOfAnubis threatLevel={threatLevel} />
        </group>
      </Float>
      
      {/* Sentinel drones */}
      <group position={[0, currentHeight / 2, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <SentinelDrone
            key={i}
            orbitRadius={8 + i * 2}
            speed={0.5 - i * 0.1}
            offset={(Math.PI / 2) * i}
            threatLevel={threatLevel}
          />
        ))}
      </group>
      
      {/* Shield barrier */}
      <ShieldBarrier
        radius={10}
        height={currentHeight + 5}
        isActive={isActive}
        threatLevel={threatLevel}
      />
      
      {/* Energy field sparkles */}
      <Sparkles
        count={100}
        scale={[20, currentHeight + 10, 20]}
        size={2}
        speed={threatLevel === 'danger' ? 2 : 0.5}
        color={threatLevel === 'danger' ? '#ff0044' : '#00ffff'}
      />
      
      {/* Incident counter ring */}
      {incidentCount > 0 && (
        <group position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          {Array.from({ length: Math.min(incidentCount, 12) }).map((_, i) => (
            <mesh 
              key={i}
              position={[
                Math.cos((Math.PI * 2 / 12) * i) * 7,
                Math.sin((Math.PI * 2 / 12) * i) * 7,
                0
              ]}
            >
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial 
                color="#ff0044"
                emissive="#ff0044"
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Lighting */}
      <pointLight 
        position={[0, currentHeight + 5, 0]} 
        intensity={3} 
        color={threatLevel === 'danger' ? '#ff0044' : threatLevel === 'warning' ? '#ffaa00' : '#00ffff'} 
        distance={30}
      />
    </group>
  );
};

export default TorreAnubis;
