import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  Sparkles,
  MeshReflectorMaterial,
  Text3D,
  Center,
  useTexture,
  Sphere,
  Html,
  Stars
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { 
  obsidianVertexShader, 
  obsidianFragmentShader,
  energyCircuitFragmentShader,
  energyCircuitVertexShader,
  glyphFragmentShader,
  glyphVertexShader
} from './shaders/CeremonialShaders';

// Obsidian Column with energy circuits
const ObsidianColumn = ({ position, height = 8, glyphSymbol = '◆' }: { 
  position: [number, number, number]; 
  height?: number;
  glyphSymbol?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glyphRef = useRef<THREE.Mesh>(null);
  
  const obsidianMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: obsidianVertexShader,
    fragmentShader: obsidianFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#0a0a0f') },
      uRoughness: { value: 0.1 },
      uMetalness: { value: 0.9 },
      uEnergyColor: { value: new THREE.Color('#00ffff') },
      uEnergyIntensity: { value: 1.5 }
    },
    transparent: true,
  }), []);

  const circuitMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: energyCircuitVertexShader,
    fragmentShader: energyCircuitFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#00ffff') },
      uColor2: { value: new THREE.Color('#ff00ff') },
      uIntensity: { value: 2.0 },
      uSpeed: { value: 3.0 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  }), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    obsidianMaterial.uniforms.uTime.value = time;
    circuitMaterial.uniforms.uTime.value = time;
    
    if (glyphRef.current && glyphRef.current.material && 'opacity' in glyphRef.current.material) {
      (glyphRef.current.material as THREE.MeshStandardMaterial).opacity = 0.5 + Math.sin(time * 2) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Main column body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, height, 8, 1]} />
        <primitive object={obsidianMaterial} attach="material" />
      </mesh>
      
      {/* Energy circuits wrapping */}
      <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.65, 0.85, height * 0.9, 8, 32, true]} />
        <primitive object={circuitMaterial} attach="material" />
      </mesh>
      
      {/* Glyph at top */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={glyphRef} position={[0, height / 2 + 0.5, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
      
      {/* Base */}
      <mesh position={[0, -height / 2, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 8]} />
        <meshStandardMaterial color="#050508" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Ceremonial Altar
const CeremonialAltar = ({ onActivate }: { onActivate?: () => void }) => {
  const altarRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={altarRef} position={[0, 0, 0]}>
      {/* Main altar platform */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[4, 1, 3]} />
        <meshStandardMaterial 
          color="#0a0a12" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Stepped base */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[5, 0.2, 4]} />
        <meshStandardMaterial color="#080810" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Central activation orb */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh 
          ref={glowRef} 
          position={[0, 1.8, 0]}
          onClick={onActivate}
        >
          <icosahedronGeometry args={[0.4, 4]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={3}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>
      
      {/* Energy ring around orb */}
      <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.02, 16, 64]} />
        <meshStandardMaterial 
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Inscriptions on altar sides */}
      {[-1.8, 1.8].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]} rotation={[0, i * Math.PI, 0]}>
          <planeGeometry args={[0.1, 0.8]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};

// Ceremonial Chamber
const CeremonialChamber = () => {
  const floorRef = useRef<THREE.Mesh>(null);
  
  return (
    <group>
      {/* Floor with reflections */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050508"
          metalness={0.8}
          mirror={0.5}
        />
      </mesh>
      
      {/* Walls - circular chamber */}
      <mesh position={[0, 10, 0]}>
        <cylinderGeometry args={[25, 25, 25, 32, 1, true]} />
        <meshStandardMaterial 
          color="#0a0a12" 
          side={THREE.BackSide}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Ceiling dome */}
      <mesh position={[0, 22, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#050510"
          side={THREE.BackSide}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

// Floating Particles with ritual energy
const RitualParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 2000;
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 20 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Cyan to magenta gradient
      const t = Math.random();
      colors[i * 3] = t;
      colors[i * 3 + 1] = 1 - t * 0.5;
      colors[i * 3 + 2] = 1;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

// Dedication Text Display
const DedicationDisplay = ({ text, isVisible }: { text: string; isVisible: boolean }) => {
  return (
    <Html
      center
      position={[0, 3, -8]}
      style={{
        width: '600px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
        pointerEvents: 'none'
      }}
    >
      <div className="bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/30">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
          DEDICATORIA FUNDACIONAL
        </h2>
        <p className="text-white/90 leading-relaxed text-sm whitespace-pre-line">
          {text}
        </p>
        <div className="mt-4 text-center">
          <span className="text-xs text-cyan-400/60">
            — Edwin Oswaldo Castillo Trejo
          </span>
        </div>
      </div>
    </Html>
  );
};

// Main Scene Component
const SalaDeOrigenScene = ({ 
  onRitualComplete,
  showDedication = false 
}: { 
  onRitualComplete?: () => void;
  showDedication?: boolean;
}) => {
  const columnPositions: [number, number, number][] = [
    [-8, 4, -5],
    [8, 4, -5],
    [-8, 4, 5],
    [8, 4, 5],
    [-5, 4, -8],
    [5, 4, -8],
    [-5, 4, 8],
    [5, 4, 8],
  ];

  const glyphSymbols = ['◆', '◇', '○', '△', '□', '☆', '✦', '⬡'];

  const dedicationText = `Este proyecto nace de cinco años de violencia digital extrema: 
acoso sistemático, humillación pública, robo de identidad, 
extorsión y ataques coordinados.

Su fundador sobrevivió al umbral, transformándose de víctima 
en fuerza consciente.

Dedico este ecosistema a REINA TREJO SERRANO.
Mujer de hierro.

A ti que renunciaste a todo por mí.
A ti que educaste con ejemplo y no con palabras vacías.

Este es mi legado.
El cierre de más de veinte mil horas de trabajo en soledad.

Valió la pena.`;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 15, 0]} intensity={2} color="#00ffff" castShadow />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff00ff" />
      <pointLight position={[10, 5, 10]} intensity={0.5} color="#00ff88" />
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        color="#00ffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Stars in dome */}
      <Stars 
        radius={30} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5} 
      />
      
      {/* Chamber structure */}
      <CeremonialChamber />
      
      {/* Columns */}
      {columnPositions.map((pos, i) => (
        <ObsidianColumn 
          key={i} 
          position={pos} 
          height={8 + Math.sin(i) * 2}
          glyphSymbol={glyphSymbols[i]}
        />
      ))}
      
      {/* Central Altar */}
      <CeremonialAltar onActivate={onRitualComplete} />
      
      {/* Ritual particles */}
      <RitualParticles />
      
      {/* Additional sparkles */}
      <Sparkles 
        count={200} 
        scale={30} 
        size={3} 
        speed={0.3} 
        color="#00ffff"
      />
      
      {/* Dedication display */}
      <DedicationDisplay text={dedicationText} isVisible={showDedication} />
      
      {/* Environment */}
      <Environment preset="night" />
      <fog attach="fog" args={['#050510', 5, 40]} />
    </>
  );
};

// Exported Component
const SalaDeOrigen = ({ 
  onComplete,
  className = ''
}: { 
  onComplete?: () => void;
  className?: string;
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
        camera={{ position: [0, 5, 15], fov: 60 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <SalaDeOrigenScene 
            onRitualComplete={onComplete}
            showDedication={true}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default SalaDeOrigen;
