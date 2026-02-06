import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Camera, Save, Shield, Wallet, Award, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AchievementsPanel from '@/components/tamv/AchievementsPanel';
import MediaGallery from '@/components/tamv/MediaGallery';
import TutorialsSection from '@/components/tamv/TutorialsSection';
import NavigationSidebar from '@/components/tamv/NavigationSidebar';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    setUser(user);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setFormData({
        username: profileData.username || '',
        full_name: profileData.full_name || '',
        bio: profileData.bio || ''
      });
    }

    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({ title: 'Avatar actualizado' });
    } catch (error) {
      toast({ title: 'Error al subir avatar', variant: 'destructive' });
    }

    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      toast({ title: 'Error al guardar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Perfil actualizado' });
      setProfile({ ...profile, ...formData });
    }

    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <NavigationSidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
              <CardContent className="py-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-primary">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                      />
                      {uploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                      ) : (
                        <Camera className="w-6 h-6" />
                      )}
                    </label>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold">{profile?.username || 'Usuario TAMV'}</h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                      <Badge variant="outline">
                        <Shield className="w-3 h-3 mr-1" />
                        Nivel {profile?.verification_level || 0}
                      </Badge>
                      <Badge variant="outline" className="text-primary border-primary">
                        <Wallet className="w-3 h-3 mr-1" />
                        {profile?.tamv_credits || 0} TC
                      </Badge>
                      <Badge variant="outline">
                        <Award className="w-3 h-3 mr-1" />
                        {profile?.reputation_score || 0} rep
                      </Badge>
                    </div>
                  </div>

                  <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Award className="w-4 h-4 mr-2" />
                Logros
              </TabsTrigger>
              <TabsTrigger value="media">
                <Camera className="w-4 h-4 mr-2" />
                Medios
              </TabsTrigger>
              <TabsTrigger value="tutorials">
                <Settings className="w-4 h-4 mr-2" />
                Academia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nombre de usuario</label>
                    <Input
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      placeholder="tu_usuario"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nombre completo</label>
                    <Input
                      value={formData.full_name}
                      onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Biografía</label>
                    <Textarea
                      value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Cuéntanos sobre ti..."
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Guardar cambios
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <AchievementsPanel />
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <MediaGallery />
            </TabsContent>

            <TabsContent value="tutorials" className="mt-6">
              <TutorialsSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
