import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Book, Code, Shield, Scale, Rocket, Package, 
  Cloud, BookOpen, FileText, ChevronRight, ExternalLink,
  Terminal, Database, Cpu, Globe, Zap, Users, ArrowLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TAMV_DOCUMENTATION, 
  DOC_CATEGORIES, 
  getDocsByCategory, 
  searchDocs,
  type DocSection,
  type DocCategory 
} from "@/lib/docs/tamv-documentation";
import { Link } from "react-router-dom";

const CATEGORY_ICONS: Record<DocCategory, React.ReactNode> = {
  architecture: <Cpu className="w-5 h-5" />,
  api: <Code className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
  governance: <Scale className="w-5 h-5" />,
  legal: <FileText className="w-5 h-5" />,
  onboarding: <Rocket className="w-5 h-5" />,
  modules: <Package className="w-5 h-5" />,
  deployment: <Cloud className="w-5 h-5" />,
  guides: <Book className="w-5 h-5" />,
  glossary: <BookOpen className="w-5 h-5" />
};

const QuickLinks = [
  { icon: <Terminal className="w-4 h-4" />, label: "API Reference", href: "#api-overview" },
  { icon: <Database className="w-4 h-4" />, label: "Isabella AI", href: "#module-isabella" },
  { icon: <Globe className="w-4 h-4" />, label: "Dreamweave", href: "#module-dreamweave" },
  { icon: <Shield className="w-4 h-4" />, label: "Seguridad", href: "#security-dekateotl" },
  { icon: <Zap className="w-4 h-4" />, label: "KAOS Audio", href: "#module-kaos" },
  { icon: <Users className="w-4 h-4" />, label: "Gobernanza", href: "#governance-dekateotl" }
];

export default function DevHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DocCategory | "all">("all");
  const [selectedDoc, setSelectedDoc] = useState<DocSection | null>(null);

  const filteredDocs = useMemo(() => {
    let docs = TAMV_DOCUMENTATION;
    
    if (searchQuery) {
      docs = searchDocs(searchQuery);
    }
    
    if (selectedCategory !== "all") {
      docs = docs.filter(doc => doc.category === selectedCategory);
    }
    
    return docs;
  }, [searchQuery, selectedCategory]);

  const categories = Object.entries(DOC_CATEGORIES) as [DocCategory, typeof DOC_CATEGORIES[DocCategory]][];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TAMV DevHub
                </h1>
                <p className="text-sm text-slate-400">Documentación Federada del Ecosistema</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar documentación..."
                  className="pl-10 bg-slate-900/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>
              <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                v1.0.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Quick Links */}
              <div className="bg-slate-900/50 rounded-xl border border-purple-500/20 p-4">
                <h3 className="text-sm font-semibold text-purple-300 mb-3">Acceso Rápido</h3>
                <div className="space-y-1">
                  {QuickLinks.map((link, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const docId = link.href.replace("#", "");
                        const doc = TAMV_DOCUMENTATION.find(d => d.id === docId);
                        if (doc) setSelectedDoc(doc);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
                    >
                      {link.icon}
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-slate-900/50 rounded-xl border border-purple-500/20 p-4">
                <h3 className="text-sm font-semibold text-purple-300 mb-3">Categorías</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedDoc(null);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === "all" 
                        ? "bg-purple-500/20 text-purple-300" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Todos
                    <span className="ml-auto text-xs opacity-60">{TAMV_DOCUMENTATION.length}</span>
                  </button>
                  
                  {categories.map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedCategory(key);
                        setSelectedDoc(null);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedCategory === key 
                          ? "bg-purple-500/20 text-purple-300" 
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }`}
                    >
                      {CATEGORY_ICONS[key]}
                      {value.label}
                      <span className="ml-auto text-xs opacity-60">
                        {getDocsByCategory(key).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Status */}
              <div className="bg-slate-900/50 rounded-xl border border-green-500/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-400">Sistema Operativo</span>
                </div>
                <p className="text-xs text-slate-400">
                  Todos los servicios funcionando correctamente
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {selectedDoc ? (
                <motion.div
                  key={selectedDoc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-slate-900/50 rounded-xl border border-purple-500/20 overflow-hidden"
                >
                  {/* Doc Header */}
                  <div className={`p-6 bg-gradient-to-r ${DOC_CATEGORIES[selectedDoc.category].color} bg-opacity-10`}>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-4 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Volver a la lista
                    </button>
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`bg-gradient-to-r ${DOC_CATEGORIES[selectedDoc.category].color}`}>
                            {DOC_CATEGORIES[selectedDoc.category].icon} {DOC_CATEGORIES[selectedDoc.category].label}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600">
                            {selectedDoc.metadata.status}
                          </Badge>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{selectedDoc.title}</h1>
                        <p className="text-slate-300">{selectedDoc.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
                      <span>v{selectedDoc.metadata.version}</span>
                      <span>•</span>
                      <span>Actualizado: {selectedDoc.metadata.lastUpdated}</span>
                      <span>•</span>
                      <span>Por: {selectedDoc.metadata.author}</span>
                    </div>
                  </div>

                  {/* Doc Content */}
                  <div className="p-6">
                    {selectedDoc.subsections && selectedDoc.subsections.length > 0 ? (
                      <Tabs defaultValue="main" className="w-full">
                        <TabsList className="mb-6 bg-slate-800/50">
                          <TabsTrigger value="main">Contenido Principal</TabsTrigger>
                          {selectedDoc.subsections.map(sub => (
                            <TabsTrigger key={sub.id} value={sub.id}>
                              {sub.title}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        <TabsContent value="main">
                          <div className="prose prose-invert prose-purple max-w-none">
                            <pre className="bg-slate-800/50 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                              {selectedDoc.content}
                            </pre>
                          </div>
                        </TabsContent>
                        
                        {selectedDoc.subsections.map(sub => (
                          <TabsContent key={sub.id} value={sub.id}>
                            <div className="prose prose-invert prose-purple max-w-none">
                              <pre className="bg-slate-800/50 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                                {sub.content}
                              </pre>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : (
                      <div className="prose prose-invert prose-purple max-w-none">
                        <pre className="bg-slate-800/50 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                          {selectedDoc.content}
                        </pre>
                      </div>
                    )}
                    
                    {/* Tags */}
                    <div className="mt-8 pt-6 border-t border-slate-700">
                      <h4 className="text-sm font-medium text-slate-400 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDoc.metadata.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Hero Section */}
                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20 p-8 mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Bienvenido al TAMV DevHub
                    </h2>
                    <p className="text-slate-300 mb-6 max-w-2xl">
                      Documentación completa y federada del ecosistema TAMV DM-X4™. 
                      Explora la arquitectura, APIs, módulos y guías de implementación 
                      para la primera civilización digital quantum de Latinoamérica.
                    </p>
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => {
                          const doc = TAMV_DOCUMENTATION.find(d => d.id === 'tamv-overview');
                          if (doc) setSelectedDoc(doc);
                        }}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Comenzar
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          const doc = TAMV_DOCUMENTATION.find(d => d.id === 'api-overview');
                          if (doc) setSelectedDoc(doc);
                        }}
                        className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                      >
                        <Code className="w-4 h-4 mr-2" />
                        API Reference
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Documentos', value: TAMV_DOCUMENTATION.length, icon: <FileText /> },
                      { label: 'Categorías', value: Object.keys(DOC_CATEGORIES).length, icon: <Package /> },
                      { label: 'Endpoints API', value: '50+', icon: <Code /> },
                      { label: 'Módulos', value: '12', icon: <Cpu /> }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-slate-900/50 rounded-xl border border-slate-700 p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            {stat.icon}
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Doc List */}
                  <div className="grid gap-4">
                    {filteredDocs.map((doc) => (
                      <motion.button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="w-full text-left bg-slate-900/50 rounded-xl border border-slate-700 p-5 hover:border-purple-500/50 transition-all group"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${DOC_CATEGORIES[doc.category].color} bg-opacity-20`}>
                              {CATEGORY_ICONS[doc.category]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                                  {doc.title}
                                </h3>
                                <Badge variant="outline" className="border-slate-600 text-xs">
                                  {DOC_CATEGORIES[doc.category].label}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-400 mb-2">{doc.description}</p>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span>v{doc.metadata.version}</span>
                                <span>•</span>
                                <span>{doc.metadata.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {filteredDocs.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-slate-400">No se encontraron documentos</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
