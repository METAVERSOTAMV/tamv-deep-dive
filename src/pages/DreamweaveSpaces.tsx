import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Environment, Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Save, Eye, ArrowLeft, Plus, Globe, Users, Lock, Loader2 } from "lucide-react";

interface DreamSpace {
  id: string;
  name: string;
  description: string;
  scene_data: any;
  visit_count: number;
  is_public: boolean;
  created_at: string;
}

function FloatingOrb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[0.5 * scale, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function DreamScene({ sceneData }: { sceneData: any }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        color={sceneData?.lightColor || "#8b5cf6"}
      />
      
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Floating orbs */}
      <FloatingOrb position={[-3, 2, -2]} color="#8b5cf6" scale={1.2} />
      <FloatingOrb position={[3, -1, -3]} color="#3b82f6" scale={0.8} />
      <FloatingOrb position={[0, 3, -4]} color="#ec4899" scale={1} />
      <FloatingOrb position={[-2, -2, -2]} color="#06b6d4" scale={0.6} />
      <FloatingOrb position={[4, 1, -5]} color="#f59e0b" scale={0.7} />

      {/* Ground plane */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color={sceneData?.floorColor || "#0f172a"}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={sceneData?.autoRotate !== false}
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={20}
      />
      
      <Environment preset="night" />
      <fog attach="fog" args={['#0f172a', 10, 50]} />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
}

export default function DreamweaveSpaces() {
  const [spaces, setSpaces] = useState<DreamSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<DreamSpace | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('dreamweave_spaces')
        .select('*')
        .order('created_at', { ascending: false });

      if (user) {
        query = query.or(`user_id.eq.${user.id},is_public.eq.true`);
      } else {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSpaces(data || []);
    } catch (error: any) {
      console.error('Error loading spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSpace = async () => {
    if (!name.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa un nombre para tu espacio",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Autenticación requerida",
          description: "Inicia sesión para crear espacios",
          variant: "destructive",
        });
        return;
      }

      const sceneData = {
        title: name,
        lightColor: "#8b5cf6",
        textColor: "#a78bfa",
        floorColor: "#0f172a",
        environment: "night",
        autoRotate: true
      };

      const { data, error } = await supabase
        .from('dreamweave_spaces')
        .insert({
          name,
          description,
          scene_data: sceneData,
          is_public: false,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setSpaces(prev => [data, ...prev]);
      setIsCreating(false);
      setName("");
      setDescription("");
      
      toast({
        title: "¡Espacio creado!",
        description: "Tu DreamSpace ha sido creado exitosamente",
      });
    } catch (error: any) {
      console.error('Error creating space:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el espacio",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const viewSpace = async (space: DreamSpace) => {
    try {
      await supabase
        .from('dreamweave_spaces')
        .update({ visit_count: (space.visit_count || 0) + 1 })
        .eq('id', space.id);

      setSelectedSpace({ ...space, visit_count: (space.visit_count || 0) + 1 });
    } catch (error) {
      console.error('Error viewing space:', error);
      setSelectedSpace(space);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando DreamSpaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AnimatePresence mode="wait">
        {selectedSpace ? (
          <motion.div
            key="viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col"
          >
            <div className="p-4 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedSpace(null)}
                    className="text-slate-400 hover:text-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                  </Button>
                  <div>
                    <h1 className="text-xl font-bold text-slate-100">{selectedSpace.name}</h1>
                    <p className="text-sm text-slate-400">{selectedSpace.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="border-slate-600 text-slate-400">
                    <Eye className="w-3 h-3 mr-1" />
                    {selectedSpace.visit_count} visitas
                  </Badge>
                  <Badge variant={selectedSpace.is_public ? "default" : "secondary"}>
                    {selectedSpace.is_public ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                    {selectedSpace.is_public ? "Público" : "Privado"}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
                <Suspense fallback={<LoadingFallback />}>
                  <DreamScene sceneData={selectedSpace.scene_data} />
                </Suspense>
              </Canvas>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
              <div className="container mx-auto px-4 py-4 max-w-7xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Link to="/">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-100">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Inicio
                      </Button>
                    </Link>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                        Dreamweave Spaces
                      </h1>
                      <p className="text-xs text-slate-500">Espacios 3D Inmersivos TAMV</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Espacio
                  </Button>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-7xl">
              {/* Hero */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <Badge className="mb-4 bg-violet-500/20 text-violet-300 border-violet-500/30">
                  🌌 Distrito de Creación XR
                </Badge>
                <h2 className="text-4xl font-bold text-slate-100 mb-4">
                  Mundos Multidimensionales Conscientes
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Crea, explora y comparte espacios 3D inmersivos. Cada DreamSpace es un universo 
                  único registrado en BookPI con trazabilidad completa.
                </p>
              </motion.div>

              {/* Create Form */}
              <AnimatePresence>
                {isCreating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                  >
                    <Card className="bg-slate-800/50 border-slate-700/50 p-6">
                      <h3 className="text-xl font-semibold text-slate-100 mb-4">Nuevo DreamSpace</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name" className="text-slate-300">Nombre del Espacio</Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Mi Universo de Sueños"
                              className="bg-slate-700/50 border-slate-600 text-slate-100"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description" className="text-slate-300">Descripción</Label>
                            <Textarea
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Describe tu espacio dimensional..."
                              rows={3}
                              className="bg-slate-700/50 border-slate-600 text-slate-100"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={createSpace} 
                              disabled={creating}
                              className="bg-gradient-to-r from-violet-600 to-blue-600"
                            >
                              {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                              {creating ? 'Creando...' : 'Crear Espacio'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => { setIsCreating(false); setName(""); setDescription(""); }}
                              className="border-slate-600"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl overflow-hidden h-48">
                          <Canvas camera={{ position: [0, 1, 5], fov: 60 }}>
                            <Suspense fallback={<LoadingFallback />}>
                              <ambientLight intensity={0.3} />
                              <pointLight position={[5, 5, 5]} color="#8b5cf6" />
                              <Stars radius={50} count={1000} fade />
                              <FloatingOrb position={[0, 0, 0]} color="#8b5cf6" />
                              <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} />
                            </Suspense>
                          </Canvas>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spaces Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space, index) => (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden hover:border-violet-500/30 transition-all group cursor-pointer"
                      onClick={() => viewSpace(space)}
                    >
                      <div className="aspect-video bg-gradient-to-br from-violet-900/30 to-blue-900/30 relative overflow-hidden">
                        <div className="absolute inset-0">
                          <Canvas camera={{ position: [0, 1, 4], fov: 60 }}>
                            <Suspense fallback={null}>
                              <ambientLight intensity={0.2} />
                              <pointLight position={[3, 3, 3]} color="#8b5cf6" intensity={0.5} />
                              <Stars radius={30} count={500} fade />
                              <FloatingOrb position={[0, 0, 0]} color="#8b5cf6" scale={0.5} />
                              <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} enableRotate={false} />
                            </Suspense>
                          </Canvas>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant={space.is_public ? "default" : "secondary"} className="text-xs">
                            {space.is_public ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                            {space.is_public ? "Público" : "Privado"}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-violet-400 transition-colors">
                          {space.name}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                          {space.description || "Espacio Dreamweave 3D"}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {space.visit_count || 0} visitas
                          </span>
                          <span>{new Date(space.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {spaces.length === 0 && !isCreating && (
                <div className="text-center py-16">
                  <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">No hay espacios aún</h3>
                  <p className="text-slate-500 mb-6">Sé el primero en crear un DreamSpace</p>
                  <Button 
                    onClick={() => setIsCreating(true)}
                    className="bg-gradient-to-r from-violet-600 to-blue-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear tu Primer Espacio
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
