import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Video, Music, FileText, Upload, X, Trash2, Download, Eye, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail_url: string | null;
  filename: string;
  file_size: number | null;
  created_at: string;
}

const typeIcons = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
};

export default function MediaGallery() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMedia(data as MediaItem[]);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Error', description: 'Debes iniciar sesión', variant: 'destructive' });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      let type: MediaItem['type'] = 'document';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';

      const bucket = type === 'image' ? 'avatars' : 'assets';
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const { data: mediaRecord, error: insertError } = await supabase
        .from('media_library')
        .insert({
          user_id: user.id,
          type,
          url: publicUrl,
          filename: file.name,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setMedia(prev => [mediaRecord as MediaItem, ...prev]);
      toast({ title: 'Archivo subido', description: file.name });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Error al subir', variant: 'destructive' });
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('¿Eliminar este archivo?')) return;

    await supabase.from('media_library').delete().eq('id', item.id);
    setMedia(prev => prev.filter(m => m.id !== item.id));
    toast({ title: 'Archivo eliminado' });
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredMedia = selectedType === 'all' 
    ? media 
    : media.filter(m => m.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Galería de Medios</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
          <label>
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            />
            <Button asChild disabled={uploading}>
              <span>
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Subir
              </span>
            </Button>
          </label>
        </div>
      </div>

      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList>
          <TabsTrigger value="all">Todos ({media.length})</TabsTrigger>
          <TabsTrigger value="image">
            <Image className="w-4 h-4 mr-1" />
            Imágenes
          </TabsTrigger>
          <TabsTrigger value="video">
            <Video className="w-4 h-4 mr-1" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="audio">
            <Music className="w-4 h-4 mr-1" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="document">
            <FileText className="w-4 h-4 mr-1" />
            Docs
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay archivos</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const Icon = typeIcons[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative"
              >
                <Card className="aspect-square overflow-hidden bg-muted/30 hover:border-primary/50 transition-colors">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setPreviewItem(item)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <a href={item.url} download target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
                <p className="text-xs text-muted-foreground truncate mt-1">{item.filename}</p>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMedia.map((item) => {
            const Icon = typeIcons[item.type];
            return (
              <Card key={item.id} className="p-3 flex items-center gap-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded bg-muted/50 flex items-center justify-center">
                  {item.type === 'image' ? (
                    <img src={item.url} alt="" className="w-full h-full object-cover rounded" />
                  ) : (
                    <Icon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(item.file_size)} • {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setPreviewItem(item)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <a href={item.url} download target="_blank" rel="noopener noreferrer">
                    <Button size="icon" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewItem(null)}
          >
            <Button
              className="absolute top-4 right-4"
              variant="ghost"
              size="icon"
              onClick={() => setPreviewItem(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="max-w-4xl max-h-[80vh]" onClick={e => e.stopPropagation()}>
              {previewItem.type === 'image' && (
                <img src={previewItem.url} alt={previewItem.filename} className="max-w-full max-h-[80vh] object-contain" />
              )}
              {previewItem.type === 'video' && (
                <video src={previewItem.url} controls className="max-w-full max-h-[80vh]" />
              )}
              {previewItem.type === 'audio' && (
                <audio src={previewItem.url} controls className="w-full" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
