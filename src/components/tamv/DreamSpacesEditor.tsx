import { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { 
  Box, Layers, Play, Save, Undo, Redo, Trash2, 
  Move, RotateCcw, Maximize, Palette, Music, 
  Video, Image, Type, Circle, Square, Triangle,
  Sun, Moon, Cloud, TreePine, Mountain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface SceneObject {
  id: string;
  type: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'plane';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

// 3D Scene Component
const Scene3D = ({ objects, selectedId, onSelect }: { 
  objects: SceneObject[], 
  selectedId: string | null,
  onSelect: (id: string) => void 
}) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00ffff" />
      
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
      
      {objects.map((obj) => {
        const isSelected = obj.id === selectedId;
        const Geometry = {
          cube: <boxGeometry args={[1, 1, 1]} />,
          sphere: <sphereGeometry args={[0.5, 32, 32]} />,
          cylinder: <cylinderGeometry args={[0.5, 0.5, 1, 32]} />,
          cone: <coneGeometry args={[0.5, 1, 32]} />,
          plane: <planeGeometry args={[1, 1]} />
        }[obj.type];
        
        return (
          <mesh
            key={obj.id}
            position={obj.position}
            rotation={obj.rotation.map(r => r * Math.PI / 180) as [number, number, number]}
            scale={obj.scale}
            onClick={(e) => { e.stopPropagation(); onSelect(obj.id); }}
          >
            {Geometry}
            <meshStandardMaterial 
              color={obj.color} 
              emissive={isSelected ? obj.color : '#000000'}
              emissiveIntensity={isSelected ? 0.3 : 0}
            />
            {isSelected && (
              <Html distanceFactor={10}>
                <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs whitespace-nowrap">
                  {obj.type}
                </div>
              </Html>
            )}
          </mesh>
        );
      })}
      
      <OrbitControls makeDefault />
      <Environment preset="city" />
    </>
  );
};

// Floating Orb for Hero
const FloatingOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial 
        color="#00ffff" 
        wireframe 
        emissive="#00ffff"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const parcelTemplates = [
  { id: 'minimal', name: 'Minimal', icon: Box, description: 'Espacio limpio y moderno' },
  { id: 'nature', name: 'Naturaleza', icon: TreePine, description: 'Bosque digital' },
  { id: 'cosmic', name: 'Cósmico', icon: Moon, description: 'Ambiente espacial' },
  { id: 'aztec', name: 'Azteca', icon: Mountain, description: 'Templo ancestral' }
];

const DreamSpacesEditor = () => {
  const [objects, setObjects] = useState<SceneObject[]>([
    { id: '1', type: 'cube', position: [0, 0.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#00ffff' }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'move' | 'rotate' | 'scale'>('select');
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [timeline, setTimeline] = useState(0);

  const selectedObject = objects.find(o => o.id === selectedId);

  const addObject = (type: SceneObject['type']) => {
    const newObj: SceneObject = {
      id: crypto.randomUUID(),
      type,
      position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    setObjects([...objects, newObj]);
    setSelectedId(newObj.id);
  };

  const updateObject = (id: string, updates: Partial<SceneObject>) => {
    setObjects(objects.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteSelected = () => {
    if (selectedId) {
      setObjects(objects.filter(o => o.id !== selectedId));
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Layers className="w-10 h-10 text-primary" />
          <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DreamSpaces XR Editor
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Editor completo de mundos XR con plantillas, timeline audiovisual, objetos 3D arrastrables y preview en tiempo real
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Left Panel - Templates & Objects */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4 space-y-4">
            <Tabs defaultValue="templates">
              <TabsList className="w-full">
                <TabsTrigger value="templates" className="flex-1">Plantillas</TabsTrigger>
                <TabsTrigger value="objects" className="flex-1">Objetos</TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="space-y-2 mt-4">
                {parcelTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedTemplate === template.id 
                          ? 'bg-primary/20 border border-primary' 
                          : 'bg-card hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{template.description}</span>
                    </button>
                  );
                })}
              </TabsContent>

              <TabsContent value="objects" className="space-y-2 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'cube' as const, icon: Square, name: 'Cubo' },
                    { type: 'sphere' as const, icon: Circle, name: 'Esfera' },
                    { type: 'cylinder' as const, icon: Box, name: 'Cilindro' },
                    { type: 'cone' as const, icon: Triangle, name: 'Cono' }
                  ].map(({ type, icon: Icon, name }) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="h-16 flex-col gap-1"
                      onClick={() => addObject(type)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{name}</span>
                    </Button>
                  ))}
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <span className="text-xs text-muted-foreground">Media</span>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="h-10 flex-col gap-0.5">
                      <Image className="w-4 h-4" />
                      <span className="text-[10px]">Imagen</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 flex-col gap-0.5">
                      <Video className="w-4 h-4" />
                      <span className="text-[10px]">Video</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 flex-col gap-0.5">
                      <Music className="w-4 h-4" />
                      <span className="text-[10px]">Audio</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Center - 3D Canvas */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[
                  { id: 'select', icon: Box, label: 'Seleccionar' },
                  { id: 'move', icon: Move, label: 'Mover' },
                  { id: 'rotate', icon: RotateCcw, label: 'Rotar' },
                  { id: 'scale', icon: Maximize, label: 'Escalar' }
                ].map(({ id, icon: Icon, label }) => (
                  <Button
                    key={id}
                    size="sm"
                    variant={tool === id ? 'default' : 'outline'}
                    onClick={() => setTool(id as typeof tool)}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Undo className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Redo className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={deleteSelected} disabled={!selectedId}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div className="aspect-video bg-background rounded-lg overflow-hidden">
              <Canvas shadows>
                <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                <Suspense fallback={null}>
                  <Scene3D 
                    objects={objects} 
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                  />
                </Suspense>
              </Canvas>
            </div>

            {/* Timeline */}
            <div className="mt-4 p-3 bg-background rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Button size="sm" variant="outline">
                  <Play className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <Slider 
                    value={[timeline]} 
                    onValueChange={([v]) => setTimeline(v)}
                    max={100}
                    step={1}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12">
                  {(timeline / 10).toFixed(1)}s
                </span>
              </div>
              <div className="flex gap-1 h-8">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded ${i < timeline / 5 ? 'bg-primary/50' : 'bg-muted'}`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Properties */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Propiedades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedObject ? (
              <>
                <div>
                  <label className="text-xs text-muted-foreground">Tipo</label>
                  <Badge variant="outline" className="ml-2">{selectedObject.type}</Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Posición</label>
                  {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis} className="flex items-center gap-2">
                      <span className="text-xs w-4">{axis}</span>
                      <Slider
                        value={[selectedObject.position[i]]}
                        onValueChange={([v]) => {
                          const newPos = [...selectedObject.position] as [number, number, number];
                          newPos[i] = v;
                          updateObject(selectedObject.id, { position: newPos });
                        }}
                        min={-10}
                        max={10}
                        step={0.1}
                      />
                      <span className="text-xs w-8">{selectedObject.position[i].toFixed(1)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Rotación</label>
                  {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis} className="flex items-center gap-2">
                      <span className="text-xs w-4">{axis}</span>
                      <Slider
                        value={[selectedObject.rotation[i]]}
                        onValueChange={([v]) => {
                          const newRot = [...selectedObject.rotation] as [number, number, number];
                          newRot[i] = v;
                          updateObject(selectedObject.id, { rotation: newRot });
                        }}
                        min={0}
                        max={360}
                        step={1}
                      />
                      <span className="text-xs w-8">{selectedObject.rotation[i]}°</span>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Color</label>
                  <input
                    type="color"
                    value={selectedObject.color}
                    onChange={(e) => updateObject(selectedObject.id, { color: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Box className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Selecciona un objeto</p>
              </div>
            )}

            <div className="pt-4 border-t border-border space-y-2">
              <Button className="w-full" variant="default">
                <Save className="w-4 h-4 mr-2" />
                Guardar DreamSpace
              </Button>
              <Button className="w-full" variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Preview VR
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DreamSpacesEditor;
