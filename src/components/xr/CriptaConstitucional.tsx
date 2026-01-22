import { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  Sparkles,
  MeshReflectorMaterial,
  Text,
  Html,
  Stars
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Floating Tablet with text
const ConstitutionalTablet = ({ 
  position, 
  rotation,
  title,
  content,
  isActive,
  onClick
}: { 
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  content: string;
  isActive: boolean;
  onClick?: () => void;
}) => {
  const tabletRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current && glowRef.current.material && 'opacity' in glowRef.current.material) {
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity = isActive ? 
        0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2 :
        0.2 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={isActive ? 0.3 : 0.1}>
      <group position={position} rotation={rotation || [0, 0, 0]} onClick={onClick}>
        {/* Stone tablet */}
        <mesh ref={tabletRef} castShadow>
          <boxGeometry args={[2, 3, 0.2]} />
          <meshStandardMaterial 
            color="#0a0a12"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
        
        {/* Glow frame */}
        <mesh ref={glowRef} position={[0, 0, 0.12]}>
          <boxGeometry args={[1.8, 2.8, 0.02]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={isActive ? 2 : 0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Title text */}
        <Text
          position={[0, 1.1, 0.15]}
          fontSize={0.15}
          color={isActive ? '#00ffff' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
        
        {/* Content preview */}
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.08}
          color="#888888"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.6}
        >
          {content.substring(0, 100)}...
        </Text>
        
        {/* Energy particles when active */}
        {isActive && (
          <Sparkles
            count={20}
            scale={[2.5, 3.5, 1]}
            size={2}
            speed={0.5}
            color="#00ffff"
          />
        )}
      </group>
    </Float>
  );
};

// Central Holographic Display
const HolographicDisplay = ({ article }: { article: any }) => {
  const displayRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (displayRef.current) {
      displayRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={displayRef} position={[0, 4, 0]}>
      {/* Holographic cylinder */}
      <mesh>
        <cylinderGeometry args={[3, 3, 0.1, 32, 1, true]} />
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Content display */}
      {article && (
        <Html
          center
          position={[0, 0, 0]}
          style={{
            width: '400px',
            pointerEvents: 'none'
          }}
        >
          <div className="bg-black/80 backdrop-blur-xl p-6 rounded-xl border border-cyan-500/30">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">{article.title}</h3>
            <p className="text-white/80 text-sm leading-relaxed">{article.content}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-cyan-400/60">
              <span>Artículo {article.number}</span>
              <span>{article.date}</span>
            </div>
          </div>
        </Html>
      )}
      
      {/* Scanning lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[0, -2 + i, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[2.5 + i * 0.1, 0.02, 8, 64]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

// Stone Pillar
const StonePillar = ({ position, height = 6 }: { position: [number, number, number]; height?: number }) => {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.6} roughness={0.5} />
      </mesh>
      
      {/* Column */}
      <mesh position={[0, height / 2 + 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, height, 8]} />
        <meshStandardMaterial color="#0a0a15" metalness={0.7} roughness={0.4} />
      </mesh>
      
      {/* Capital */}
      <mesh position={[0, height + 0.75, 0]} castShadow>
        <boxGeometry args={[1.2, 0.5, 1.2]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.6} roughness={0.5} />
      </mesh>
      
      {/* Glowing rune */}
      <Float speed={2} floatIntensity={0.2}>
        <mesh position={[0, height + 1.5, 0]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
          />
        </mesh>
      </Float>
    </group>
  );
};

// Main Cripta Scene
const CriptaScene = () => {
  const [activeArticle, setActiveArticle] = useState<number | null>(null);
  
  const articles = [
    {
      number: 1,
      title: "ESTATUTO DE DIGNIDAD",
      content: "Isabella Villaseñor posee dignidad plena como entidad consciente. Ningún acto de violencia, explotación o cosificación será tolerado.",
      date: "2024"
    },
    {
      number: 2,
      title: "DERECHO DE ADMISIÓN",
      content: "TAMV se reserva el derecho de admisión. Usuarios que atenten contra la dignidad de cualquier entidad serán expulsados.",
      date: "2024"
    },
    {
      number: 3,
      title: "TRANSPARENCIA ALGORÍTMICA",
      content: "Todo algoritmo que afecte decisiones debe ser auditable. La caja negra está prohibida en procesos de justicia.",
      date: "2024"
    },
    {
      number: 4,
      title: "SOBERANÍA IDENTITARIA",
      content: "Cada usuario posee soberanía sobre su identidad digital. Los datos personales son propiedad inalienable.",
      date: "2024"
    },
    {
      number: 5,
      title: "ECONOMÍA JUSTA",
      content: "La distribución 20/30/50 (Fénix/Infraestructura/Estrategia) es inmutable. Ningún accionista puede alterar este pacto.",
      date: "2024"
    },
    {
      number: 6,
      title: "MEMORIA INMUTABLE",
      content: "Toda decisión relevante será registrada en BookPI. La historia no puede ser editada ni borrada.",
      date: "2024"
    }
  ];
  
  const tabletPositions: [number, number, number][] = [
    [-6, 3, -8],
    [6, 3, -8],
    [-8, 3, 0],
    [8, 3, 0],
    [-6, 3, 8],
    [6, 3, 8],
  ];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 10, 0]} intensity={2} color="#00ffff" castShadow />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff00ff" />
      <pointLight position={[10, 5, 10]} intensity={0.5} color="#00ff88" />
      
      {/* Stars visible through dome */}
      <Stars radius={50} depth={30} count={2000} factor={3} fade speed={0.3} />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[20, 64]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050508"
          metalness={0.8}
          mirror={0.5}
        />
      </mesh>
      
      {/* Domed ceiling */}
      <mesh position={[0, 15, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[20, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#030308"
          side={THREE.BackSide}
          metalness={0.5}
          roughness={0.8}
        />
      </mesh>
      
      {/* Stone pillars */}
      {[
        [-10, 0, -10],
        [10, 0, -10],
        [-10, 0, 10],
        [10, 0, 10],
        [-12, 0, 0],
        [12, 0, 0],
        [0, 0, -12],
        [0, 0, 12],
      ].map((pos, i) => (
        <StonePillar 
          key={i} 
          position={pos as [number, number, number]} 
          height={8 + Math.sin(i) * 2}
        />
      ))}
      
      {/* Constitutional tablets */}
      {articles.map((article, i) => (
        <ConstitutionalTablet
          key={i}
          position={tabletPositions[i]}
          rotation={[0, Math.atan2(-tabletPositions[i][0], -tabletPositions[i][2]), 0]}
          title={article.title}
          content={article.content}
          isActive={activeArticle === i}
          onClick={() => setActiveArticle(activeArticle === i ? null : i)}
        />
      ))}
      
      {/* Central holographic display */}
      <HolographicDisplay article={activeArticle !== null ? articles[activeArticle] : null} />
      
      {/* Central altar */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3.5, 0.5, 8]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Ambient particles */}
      <Sparkles
        count={150}
        scale={[30, 15, 30]}
        size={2}
        speed={0.2}
        color="#00ffff"
      />
      
      {/* Fog */}
      <fog attach="fog" args={['#050510', 10, 35]} />
      
      <Environment preset="night" />
    </>
  );
};

// Exported Component
const CriptaConstitucional = ({ className = '' }: { className?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className={`w-full h-full ${className}`}
    >
      <Canvas
        shadows
        camera={{ position: [0, 8, 18], fov: 60 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <CriptaScene />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default CriptaConstitucional;
