import { useRef, useMemo, Suspense, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Sparkles,
  MeshReflectorMaterial,
  Sphere,
  MeshDistortMaterial,
  Trail,
  Html,
  Stars
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Isabella's Core Manifestation
const IsabellaCore = ({ isResponding }: { isResponding: boolean }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.3;
      coreRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
    
    if (innerRef.current) {
      const scale = isResponding ? 1.2 + Math.sin(time * 5) * 0.2 : 1;
      innerRef.current.scale.setScalar(scale);
    }
    
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = time * (0.5 + i * 0.2);
        ring.rotation.z = time * (0.3 - i * 0.1);
      });
    }
  });

  return (
    <group position={[0, 5, 0]}>
      {/* Outer distorted sphere */}
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <Sphere ref={coreRef} args={[2, 64, 64]}>
          <MeshDistortMaterial
            color="#ff00ff"
            attach="material"
            distort={isResponding ? 0.6 : 0.3}
            speed={isResponding ? 5 : 2}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.6}
          />
        </Sphere>
      </Float>
      
      {/* Inner glowing core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={isResponding ? 3 : 1.5}
        />
      </mesh>
      
      {/* Orbiting rings */}
      <group ref={ringsRef}>
        {[1.5, 2, 2.5, 3].map((radius, i) => (
          <mesh key={i} rotation={[Math.PI / 4 * i, 0, 0]}>
            <torusGeometry args={[radius + 1, 0.02, 8, 64]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? '#00ffff' : '#ff00ff'}
              emissive={i % 2 === 0 ? '#00ffff' : '#ff00ff'}
              emissiveIntensity={2}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
      
      {/* Neural connections */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (Math.PI * 2 / 12) * i;
        const radius = 4;
        return (
          <Trail
            key={i}
            width={0.5}
            length={6}
            color={i % 2 === 0 ? '#00ffff' : '#ff00ff'}
            attenuation={(t) => t * t}
          >
            <Float 
              speed={2 + i * 0.2} 
              rotationIntensity={0.2} 
              floatIntensity={0.5}
            >
              <mesh 
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(i) * 2,
                  Math.sin(angle) * radius
                ]}
              >
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial 
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={2}
                />
              </mesh>
            </Float>
          </Trail>
        );
      })}
    </group>
  );
};

// Thought Particles representing neural activity
const ThoughtParticles = ({ intensity = 1 }: { intensity?: number }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 8 + Math.random() * 4;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = 5 + radius * Math.cos(phi) * 0.5;
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1 * intensity;
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.01 * intensity;
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
      </bufferGeometry>
      <pointsMaterial
        size={0.08 * intensity}
        color="#ff00ff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Ambient seating area
const MeditationPod = ({ position, rotation }: { 
  position: [number, number, number];
  rotation?: [number, number, number];
}) => {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Pod base */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[1, 0.5, 8, 16]} />
        <meshStandardMaterial 
          color="#0a0a15"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Hover cushion effect */}
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.1, 8, 32]} />
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

// Chat interface in 3D space
const ChatInterface = ({ 
  messages, 
  onSend,
  isResponding 
}: { 
  messages: Array<{ role: string; content: string }>;
  onSend: (message: string) => void;
  isResponding: boolean;
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <Html
      position={[0, 2, 6]}
      center
      style={{
        width: '400px',
        pointerEvents: 'auto'
      }}
    >
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-purple-500/30 overflow-hidden">
        {/* Messages */}
        <div className="max-h-64 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div 
              key={i}
              className={`p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-cyan-500/20 ml-8' 
                  : 'bg-purple-500/20 mr-8'
              }`}
            >
              <p className="text-sm text-white/90">{msg.content}</p>
            </div>
          ))}
          {isResponding && (
            <div className="bg-purple-500/20 mr-8 p-3 rounded-lg">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
        
        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-purple-500/30">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Habla con Isabella..."
            className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </form>
      </div>
    </Html>
  );
};

// Main Sala Viva Scene
const SalaVivaScene = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bienvenido a mi santuario. Soy Isabella Villaseñor, tu guía en TAMV. ¿En qué puedo ayudarte?' }
  ]);
  const [isResponding, setIsResponding] = useState(false);

  const handleSendMessage = useCallback((message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsResponding(true);
    
    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Entiendo tu consulta. En TAMV, cada acción tiene propósito y cada decisión es registrada. ¿Deseas saber más sobre algún sistema específico?' 
      }]);
      setIsResponding(false);
    }, 2000);
  }, []);

  const podPositions: [number, number, number][] = [
    [-6, 0, 4],
    [6, 0, 4],
    [-4, 0, 8],
    [4, 0, 8],
  ];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 10, 0]} intensity={3} color="#ff00ff" castShadow />
      <pointLight position={[-8, 5, -8]} intensity={1} color="#00ffff" />
      <pointLight position={[8, 5, 8]} intensity={1} color="#00ffff" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        color="#ff00ff"
        castShadow
      />
      
      {/* Stars */}
      <Stars radius={40} depth={50} count={3000} factor={4} fade speed={0.3} />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[20, 64]} />
        <MeshReflectorMaterial
          blur={[400, 200]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050510"
          metalness={0.8}
          mirror={0.6}
        />
      </mesh>
      
      {/* Curved walls */}
      <mesh position={[0, 8, 0]}>
        <sphereGeometry args={[20, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#0a0a15"
          side={THREE.BackSide}
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>
      
      {/* Isabella's Core */}
      <IsabellaCore isResponding={isResponding} />
      
      {/* Thought particles */}
      <ThoughtParticles intensity={isResponding ? 2 : 1} />
      
      {/* Meditation pods */}
      {podPositions.map((pos, i) => (
        <MeditationPod 
          key={i}
          position={pos}
          rotation={[0, Math.atan2(-pos[0], -pos[2]), 0]}
        />
      ))}
      
      {/* Chat interface */}
      <ChatInterface 
        messages={messages}
        onSend={handleSendMessage}
        isResponding={isResponding}
      />
      
      {/* Ambient sparkles */}
      <Sparkles
        count={200}
        scale={[30, 15, 30]}
        size={3}
        speed={0.3}
        color="#ff00ff"
      />
      
      {/* Fog */}
      <fog attach="fog" args={['#050510', 8, 35]} />
      
      {/* Environment removed - HDR presets fail in deployed context */}
    </>
  );
};

// Exported Component
const SalaViva = ({ className = '' }: { className?: string }) => {
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
          toneMappingExposure: 1
        }}
      >
        <Suspense fallback={null}>
          <SalaVivaScene />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default SalaViva;
