import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Shield, Cloud, Brain, Palette, Scale, ChevronRight } from "lucide-react";
import { getCodexMexa } from "@/lib/codex/codex-mexa";

const folioIcons = {
  "FOLIO-I": Shield,
  "FOLIO-II": Cloud,
  "FOLIO-III": Brain,
  "FOLIO-IV": Brain,
  "FOLIO-V": Palette,
  "FOLIO-VI": Scale,
};

export default function CodexExplorer() {
  const [selectedFolio, setSelectedFolio] = useState<string | null>(null);
  const codex = getCodexMexa();
  const folios = codex.getAllFolios();
  const metadata = codex.getMetadata();

  const handleFolioClick = async (folioId: string) => {
    setSelectedFolio(folioId);
    await codex.logFolioAccess(folioId, "current-user", "VIEW");
  };

  const selectedFolioData = selectedFolio ? codex.getFolio(selectedFolio) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {metadata.title}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">{metadata.branding}</p>
          <p className="text-sm text-muted-foreground">
            Autor: {metadata.author} · Versión {metadata.version}
          </p>
          <div className="flex gap-2 justify-center mt-4">
            {metadata.compliance.map((standard) => (
              <Badge key={standard} variant="outline" className="text-xs">
                {standard}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Folios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {folios.map((folio, index) => {
            const Icon = folioIcons[folio.id as keyof typeof folioIcons] || Book;
            return (
              <motion.div
                key={folio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all hover:shadow-xl hover:border-primary/40 ${
                    selectedFolio === folio.id ? "border-primary shadow-lg shadow-primary/20" : ""
                  }`}
                  onClick={() => handleFolioClick(folio.id)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{folio.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {folio.id}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {folio.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {folio.modules.slice(0, 3).map((module) => (
                      <Badge key={module} variant="outline" className="text-xs">
                        {module}
                      </Badge>
                    ))}
                    {folio.modules.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{folio.modules.length - 3} más
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{folio.editable ? "✏️ Editable" : "🔒 Solo lectura"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Folio Details */}
        <AnimatePresence mode="wait">
          {selectedFolioData && (
            <motion.div
              key={selectedFolioData.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="p-8 border-primary/20 bg-card/95 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedFolioData.title}</h2>
                    <p className="text-muted-foreground">{selectedFolioData.summary}</p>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedFolio(null)}>
                    Cerrar
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                      Módulos Integrados
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFolioData.modules.map((module) => (
                        <Badge key={module} variant="secondary">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                      Estándares de Compliance
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFolioData.complianceStandards.map((standard) => (
                        <Badge key={standard} variant="outline" className="border-green-500/50">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Propietario:</span>
                      <p className="font-medium">{selectedFolioData.owner}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Última Actualización:</span>
                      <p className="font-medium">
                        {selectedFolioData.lastUpdate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Estado:</span>
                      <p className="font-medium">
                        {selectedFolioData.editable ? "✏️ Editable" : "🔒 Solo lectura"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    <strong>Filosofía del CODEX MEXA:</strong> Este folio representa parte del
                    conocimiento civilizatorio digital, auditable y protegido bajo estándares
                    internacionales. Cada acceso queda registrado en el BookPI con firma
                    criptográfica para trazabilidad legal y ética.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            CODEX MEXA ISABELLA REX · Guardián de la memoria civilizatoria digital ·
            Protegido por {metadata.compliance.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
