import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Text3D, Center, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Save, Eye } from "lucide-react";

interface DreamSpace {
  id: string;
  name: string;
  description: string;
  scene_data: any;
  visit_count: number;
  is_public: boolean;
  created_at: string;
}

function DreamScene({ sceneData }: { sceneData: any }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        color={sceneData.lightColor || "#8b5cf6"}
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

      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={1}
          height={0.2}
          curveSegments={12}
        >
          {sceneData.title || "DREAMWEAVE"}
          <meshStandardMaterial
            color={sceneData.textColor || "#a78bfa"}
            emissive={sceneData.textColor || "#a78bfa"}
            emissiveIntensity={0.5}
          />
        </Text3D>
      </Center>

      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color={sceneData.floorColor || "#1e1b4b"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={sceneData.autoRotate !== false}
        autoRotateSpeed={0.5}
      />
      
      <Environment preset={sceneData.environment || "night"} />
    </>
  );
}

export default function DreamweaveSpaces() {
  const [spaces, setSpaces] = useState<DreamSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<DreamSpace | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Autenticación requerida",
          description: "Inicia sesión para ver tus espacios Dreamweave",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('dreamweave_spaces')
        .select('*')
        .or(`user_id.eq.${user.id},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSpaces(data || []);
    } catch (error: any) {
      console.error('Error loading spaces:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los espacios",
        variant: "destructive",
      });
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

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const sceneData = {
        title: name,
        lightColor: "#8b5cf6",
        textColor: "#a78bfa",
        floorColor: "#1e1b4b",
        environment: "night",
        autoRotate: true
      };

      const { data, error } = await supabase
        .from('dreamweave_spaces')
        .insert({
          name,
          description,
          scene_data: sceneData,
          is_public: false
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
        description: "Tu espacio Dreamweave ha sido creado exitosamente",
      });
    } catch (error: any) {
      console.error('Error creating space:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el espacio",
        variant: "destructive",
      });
    }
  };

  const viewSpace = async (space: DreamSpace) => {
    try {
      // Incrementar contador de visitas
      await supabase
        .from('dreamweave_spaces')
        .update({ visit_count: (space.visit_count || 0) + 1 })
        .eq('id', space.id);

      setSelectedSpace(space);
    } catch (error) {
      console.error('Error viewing space:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {selectedSpace ? (
        <div className="h-screen flex flex-col">
          <div className="p-4 bg-card/80 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{selectedSpace.name}</h1>
                <p className="text-muted-foreground">{selectedSpace.description}</p>
              </div>
              <Button onClick={() => setSelectedSpace(null)}>
                Volver a la Galería
              </Button>
            </div>
          </div>
          
          <div className="flex-1">
            <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
              <DreamScene sceneData={selectedSpace.scene_data} />
            </Canvas>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Dreamweave Spaces
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Espacios 3D Inmersivos del Ecosistema TAMV
            </p>
            <p className="text-sm text-muted-foreground">
              Crea y explora mundos multidimensionales conscientes
            </p>
          </motion.div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Tus Espacios</h2>
            <Button
              onClick={() => setIsCreating(true)}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Crear Espacio
            </Button>
          </div>

          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="p-6 mb-8 border-primary/20">
                <h3 className="text-xl font-semibold mb-4">Nuevo Espacio Dreamweave</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre del Espacio</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Mi Espacio de Sueños"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe tu espacio dimensional..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createSpace} className="gap-2">
                      <Save className="w-4 h-4" />
                      Crear Espacio
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setName("");
                        setDescription("");
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space, index) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/20 cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-primary opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{space.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {space.description || "Espacio Dreamweave 3D"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{space.visit_count || 0} visitas</span>
                    <span>{space.is_public ? "Público" : "Privado"}</span>
                  </div>
                  <Button
                    onClick={() => viewSpace(space)}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4" />
                    Explorar Espacio
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {spaces.length === 0 && !isCreating && (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">
                No tienes espacios Dreamweave aún
              </p>
              <Button onClick={() => setIsCreating(true)} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Crear tu Primer Espacio
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
