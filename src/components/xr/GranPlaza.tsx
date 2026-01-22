import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  Sparkles,
  MeshReflectorMaterial,
  Stars,
  Cloud,
  Sky
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import TorreAnubis from './TorreAnubis';

// Central Fountain with energy streams
const EnergyFountain = () => {
  const streamRef = useRef<THREE.Points>(null);
  const particleCount = 500;
  
  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = Math.random() * 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return [positions, velocities];
  }, []);

  useFrame((state) => {
    if (streamRef.current) {
      const positions = streamRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Reset particles that go too high
        if (positions[i * 3 + 1] > 15) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 2;
          positions[i * 3] = Math.cos(angle) * radius;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
      }
      
      streamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Fountain base */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[4, 5, 1, 16]} />
        <meshStandardMaterial color="#0a0a15" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Inner pool */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[3.5, 3.5, 0.3, 16]} />
        <meshStandardMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.3}
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Energy particles rising */}
      <points ref={streamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#00ffff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Central column of light */}
      <mesh position={[0, 8, 0]}>
        <cylinderGeometry args={[0.1, 1, 15, 8, 1, true]} />
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// District Portal
const DistrictPortal = ({ 
  position, 
  rotation, 
  label, 
  color,
  onClick 
}: { 
  position: [number, number, number];
  rotation?: [number, number, number];
  label: string;
  color: string;
  onClick?: () => void;
}) => {
  const portalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
    if (portalRef.current) {
      portalRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation || [0, 0, 0]} onClick={onClick}>
      {/* Portal frame */}
      <mesh>
        <torusGeometry args={[2.5, 0.2, 16, 48]} />
        <meshStandardMaterial 
          color="#0a0a15"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* Energy ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.3, 0.05, 8, 48]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Portal surface */}
      <mesh ref={portalRef}>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Runes around portal */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (Math.PI * 2 / 8) * i;
        return (
          <Float key={i} speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <mesh 
              position={[
                Math.cos(angle) * 2.8,
                Math.sin(angle) * 2.8,
                0.1
              ]}
            >
              <boxGeometry args={[0.2, 0.4, 0.05]} />
              <meshStandardMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={1.5}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
};

// Pathway with glowing tiles
const GlowingPathway = ({ 
  from, 
  to, 
  color = '#00ffff' 
}: { 
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
}) => {
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  const segments = Math.floor(length / 2);
  
  return (
    <group 
      position={[(from[0] + to[0]) / 2, 0.02, (from[2] + to[2]) / 2]}
      rotation={[0, -angle + Math.PI / 2, 0]}
    >
      {Array.from({ length: segments }).map((_, i) => (
        <mesh 
          key={i} 
          position={[0, 0, (i - segments / 2) * 2]}
          receiveShadow
        >
          <boxGeometry args={[2, 0.05, 1.5]} />
          <meshStandardMaterial 
            color="#0a0a15"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
      
      {/* Glowing lines */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.02, length]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
};

// Monument/Statue base
const MonumentBase = ({ 
  position, 
  label 
}: { 
  position: [number, number, number];
  label: string;
}) => {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Pedestal */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#0a0a15" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Holographic placeholder */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, 4, 0]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1}
            wireframe
          />
        </mesh>
      </Float>
    </group>
  );
};

// Main Plaza Scene
const GranPlazaScene = ({ threatLevel = 'safe' }: { threatLevel?: string }) => {
  const portalConfigs = [
    { position: [20, 3, 0] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number], label: 'ISABELLA', color: '#ff00ff' },
    { position: [-20, 3, 0] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], label: 'MERCADO', color: '#ffaa00' },
    { position: [0, 3, 20] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number], label: 'GOBERNANZA', color: '#00ff88' },
    { position: [0, 3, -20] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], label: 'BOOKPI', color: '#00ffff' },
  ];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[20, 30, 10]} 
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[0, 15, 0]} intensity={2} color="#00ffff" />
      
      {/* Sky */}
      <Sky 
        distance={450000}
        sunPosition={[0, 0.1, -1]}
        inclination={0}
        azimuth={0.25}
      />
      
      {/* Stars */}
      <Stars radius={200} depth={100} count={5000} factor={4} fade speed={0.5} />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#050508"
          metalness={0.6}
          roughness={0.4}
          mirror={0.5}
        />
      </mesh>
      
      {/* Central Fountain */}
      <EnergyFountain />
      
      {/* Torre Anubis in distance */}
      <TorreAnubis 
        position={[35, 0, -35]}
        threatLevel={threatLevel as 'safe' | 'warning' | 'danger'}
        incidentCount={3}
      />
      
      {/* District Portals */}
      {portalConfigs.map((config, i) => (
        <DistrictPortal 
          key={i}
          position={config.position}
          rotation={config.rotation}
          label={config.label}
          color={config.color}
        />
      ))}
      
      {/* Pathways to portals */}
      {portalConfigs.map((config, i) => (
        <GlowingPathway
          key={i}
          from={[0, 0, 0]}
          to={config.position}
          color={config.color}
        />
      ))}
      
      {/* Corner monuments */}
      <MonumentBase position={[12, 0, 12]} label="SABIDURÍA" />
      <MonumentBase position={[-12, 0, 12]} label="COMUNIDAD" />
      <MonumentBase position={[12, 0, -12]} label="CREACIÓN" />
      <MonumentBase position={[-12, 0, -12]} label="JUSTICIA" />
      
      {/* Ambient particles */}
      <Sparkles
        count={300}
        scale={[60, 30, 60]}
        size={3}
        speed={0.2}
        color="#00ffff"
      />
      
      {/* Clouds */}
      <Cloud
        position={[20, 40, -20]}
        speed={0.2}
        opacity={0.3}
        color="#1a1a2e"
      />
      <Cloud
        position={[-30, 45, 10]}
        speed={0.15}
        opacity={0.25}
        color="#1a1a2e"
      />
      
      {/* Fog */}
      <fog attach="fog" args={['#050510', 20, 100]} />
      
      {/* Environment */}
      <Environment preset="night" />
    </>
  );
};

// Exported Component
const GranPlaza = ({ 
  className = '',
  threatLevel = 'safe'
}: { 
  className?: string;
  threatLevel?: string;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className={`w-full h-full ${className}`}
    >
      <Canvas
        shadows
        camera={{ position: [0, 20, 40], fov: 60 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <Suspense fallback={null}>
          <GranPlazaScene threatLevel={threatLevel} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default GranPlaza;
