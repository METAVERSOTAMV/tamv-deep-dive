import { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  Sparkles,
  MeshReflectorMaterial,
  Text,
  Html,
  Stars,
  Cloud
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Market Stall with holographic display
const MarketStall = ({ 
  position, 
  rotation,
  item,
  onSelect
}: { 
  position: [number, number, number];
  rotation?: [number, number, number];
  item: {
    name: string;
    price: number;
    type: string;
    rarity: string;
  };
  onSelect?: () => void;
}) => {
  const displayRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const rarityColors: Record<string, string> = {
    common: '#888888',
    rare: '#00ffff',
    epic: '#ff00ff',
    legendary: '#ffaa00'
  };
  
  const color = rarityColors[item.rarity] || '#00ffff';
  
  useFrame((state) => {
    if (displayRef.current) {
      displayRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      if (hovered) {
        displayRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
      } else {
        displayRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group 
      position={position} 
      rotation={rotation || [0, 0, 0]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      {/* Stall base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 1.5]} />
        <meshStandardMaterial 
          color="#0a0a15"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>
      
      {/* Display platform */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 16]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Holographic item display */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh ref={displayRef} position={[0, 2, 0]}>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 2 : 1}
            wireframe={item.type === 'dreamspace'}
          />
        </mesh>
      </Float>
      
      {/* Canopy */}
      <mesh position={[0, 3, 0]}>
        <coneGeometry args={[1.5, 1, 4]} />
        <meshStandardMaterial 
          color="#0a0a20"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Info display */}
      {hovered && (
        <Html position={[0, 3.5, 0]} center>
          <div className="bg-black/90 backdrop-blur px-4 py-2 rounded-lg border border-cyan-500/30 whitespace-nowrap">
            <p className="text-cyan-400 font-bold">{item.name}</p>
            <p className="text-yellow-400">{item.price} TAU</p>
            <p className={`text-xs ${color === '#ffaa00' ? 'text-yellow-400' : color === '#ff00ff' ? 'text-purple-400' : 'text-cyan-400'}`}>
              {item.rarity.toUpperCase()}
            </p>
          </div>
        </Html>
      )}
      
      {/* Rarity particles */}
      <Sparkles
        count={10}
        scale={[2, 3, 2]}
        size={2}
        speed={0.5}
        color={color}
      />
    </group>
  );
};

// Auction Podium
const AuctionPodium = ({ 
  position,
  currentBid,
  timeLeft,
  itemName
}: { 
  position: [number, number, number];
  currentBid: number;
  timeLeft: number;
  itemName: string;
}) => {
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const itemRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (itemRef.current) {
      itemRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (spotlightRef.current) {
      spotlightRef.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Podium */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[2, 2.5, 2, 8]} />
        <meshStandardMaterial 
          color="#0a0a15"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* Item on display */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={itemRef} position={[0, 3.5, 0]}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial 
            color="#ffaa00"
            emissive="#ffaa00"
            emissiveIntensity={2}
          />
        </mesh>
      </Float>
      
      {/* Spotlight */}
      <spotLight
        ref={spotlightRef}
        position={[0, 8, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={3}
        color="#ffaa00"
        castShadow
      />
      
      {/* Bid display */}
      <Html position={[0, 5.5, 0]} center>
        <div className="bg-black/90 backdrop-blur-xl px-6 py-4 rounded-xl border border-yellow-500/50 text-center">
          <p className="text-yellow-400 font-bold text-lg">{itemName}</p>
          <p className="text-3xl font-black text-white mt-2">{currentBid} TAU</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-red-400 animate-pulse">⏱</span>
            <span className="text-white">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <button className="mt-3 px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition">
            OFERTAR
          </button>
        </div>
      </Html>
      
      {/* Energy ring */}
      <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.05, 8, 64]} />
        <meshStandardMaterial 
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
};

// Guild Banner
const GuildBanner = ({ 
  position, 
  guildName, 
  color 
}: { 
  position: [number, number, number];
  guildName: string;
  color: string;
}) => {
  const bannerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (bannerRef.current) {
      bannerRef.current.rotation.z = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 8, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      
      {/* Banner */}
      <mesh ref={bannerRef} position={[0.6, 5, 0]}>
        <planeGeometry args={[1.2, 2]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Guild emblem */}
      <Text
        position={[0.6, 5, 0.01]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {guildName.substring(0, 3).toUpperCase()}
      </Text>
    </group>
  );
};

// Main Market Scene
const MercadoScene = () => {
  const marketItems = [
    { name: 'DreamSpace: Nebula Garden', price: 500, type: 'dreamspace', rarity: 'epic' },
    { name: 'Avatar: Cyber Samurai', price: 150, type: 'avatar', rarity: 'rare' },
    { name: 'NFT: Genesis Block', price: 1000, type: 'nft', rarity: 'legendary' },
    { name: 'Asset Pack: Neon City', price: 75, type: 'asset', rarity: 'rare' },
    { name: 'Sticker: Quantum Cat', price: 10, type: 'sticker', rarity: 'common' },
    { name: 'Pet: Digital Phoenix', price: 250, type: 'pet', rarity: 'epic' },
  ];

  const stallPositions: [number, number, number][] = [
    [-8, 0, -5],
    [-4, 0, -8],
    [4, 0, -8],
    [8, 0, -5],
    [-8, 0, 5],
    [8, 0, 5],
  ];

  const guildColors = ['#00ffff', '#ff00ff', '#ffaa00', '#00ff88'];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[0, 10, 0]} intensity={2} color="#ffaa00" />
      
      {/* Sky */}
      <Stars radius={150} depth={80} count={4000} factor={4} fade speed={0.3} />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={30}
          roughness={1}
          depthScale={1.2}
          color="#080810"
          metalness={0.7}
          mirror={0.4}
        />
      </mesh>
      
      {/* Market stalls */}
      {stallPositions.map((pos, i) => (
        <MarketStall
          key={i}
          position={pos}
          rotation={[0, Math.atan2(-pos[0], -pos[2]), 0]}
          item={marketItems[i]}
        />
      ))}
      
      {/* Central auction podium */}
      <AuctionPodium
        position={[0, 0, 0]}
        currentBid={2500}
        timeLeft={185}
        itemName="Bono Fundador #001"
      />
      
      {/* Guild banners */}
      {[
        [-15, 0, -15],
        [15, 0, -15],
        [-15, 0, 15],
        [15, 0, 15],
      ].map((pos, i) => (
        <GuildBanner
          key={i}
          position={pos as [number, number, number]}
          guildName={['DEVS', 'ARTS', 'GOVN', 'MKTG'][i]}
          color={guildColors[i]}
        />
      ))}
      
      {/* Decorative clouds */}
      <Cloud position={[-20, 15, -20]} speed={0.1} opacity={0.2} />
      <Cloud position={[20, 18, 20]} speed={0.15} opacity={0.15} />
      
      {/* Ambient particles */}
      <Sparkles
        count={150}
        scale={[40, 20, 40]}
        size={2}
        speed={0.2}
        color="#ffaa00"
      />
      
      {/* Fog */}
      <fog attach="fog" args={['#080810', 15, 60]} />
      
      <Environment preset="night" />
    </>
  );
};

// Exported Component
const MercadoCeremonial = ({ className = '' }: { className?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className={`w-full h-full ${className}`}
    >
      <Canvas
        shadows
        camera={{ position: [0, 12, 25], fov: 60 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <Suspense fallback={null}>
          <MercadoScene />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default MercadoCeremonial;
