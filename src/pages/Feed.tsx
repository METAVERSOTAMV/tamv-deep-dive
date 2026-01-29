import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, MessageCircle, Share2, Send, Image as ImageIcon, 
  Loader2, RefreshCw, Home, User, Bell, Settings 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: Profile;
  user_liked?: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: Profile;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadFeed();
    setupRealtimeSubscription();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setProfile(profileData);
    }
  };

  const loadFeed = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_user_id_fkey(id, username, full_name, avatar_url)
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('feed-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        // Fetch the new post with author info
        const { data } = await supabase
          .from('posts')
          .select(`*, author:profiles!posts_user_id_fkey(id, username, full_name, avatar_url)`)
          .eq('id', payload.new.id)
          .single();
        if (data) {
          setPosts(prev => [data, ...prev]);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.trim()) return;
    
    setPosting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPost.trim(),
          visibility: 'public'
        });

      if (error) throw error;
      
      setNewPost('');
      toast({ title: 'Publicado', description: 'Tu post ha sido compartido' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      // Check if already liked
      const { data: existing } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existing) {
        await supabase.from('likes').delete().eq('id', existing.id);
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, likes_count: Math.max(0, p.likes_count - 1), user_liked: false } : p
        ));
      } else {
        await supabase.from('likes').insert({ user_id: user.id, post_id: postId });
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, likes_count: p.likes_count + 1, user_liked: true } : p
        ));
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const loadComments = async (postId: string) => {
    setSelectedPost(postId);
    const { data } = await supabase
      .from('comments')
      .select(`*, author:profiles!comments_user_id_fkey(id, username, full_name, avatar_url)`)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments(data || []);
  };

  const handleComment = async () => {
    if (!user || !selectedPost || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: selectedPost,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;
      setNewComment('');
      loadComments(selectedPost);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TAMV Feed
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={loadFeed}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            {user ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            ) : (
              <Link to="/auth">
                <Button size="sm">Iniciar Sesión</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-6">
        {/* Create Post */}
        {user && (
          <Card className="p-4 mb-6 bg-card/50 border-border">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="¿Qué está pasando?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[80px] bg-background/50 border-border resize-none"
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" disabled>
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{newPost.length}/2000</span>
                    <Button 
                      onClick={handleCreatePost} 
                      disabled={posting || !newPost.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      <span className="ml-2">Publicar</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No hay publicaciones aún. ¡Sé el primero!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 bg-card/50 hover:bg-card/70 transition-colors">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={post.author?.avatar_url || ''} />
                        <AvatarFallback>
                          {post.author?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold truncate">
                            {post.author?.full_name || post.author?.username || 'Usuario'}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            @{post.author?.username || 'anon'}
                          </span>
                          <span className="text-muted-foreground text-sm">·</span>
                          <span className="text-muted-foreground text-sm">
                            {formatDistanceToNow(new Date(post.created_at), { locale: es, addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap break-words mb-3">
                          {post.content}
                        </p>
                        {post.media_url && (
                          <div className="mb-3 rounded-xl overflow-hidden">
                            <img 
                              src={post.media_url} 
                              alt="Media" 
                              className="max-h-96 w-auto object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-6">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 text-sm transition-colors ${
                              post.user_liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                            }`}
                          >
                            <Heart className={`h-5 w-5 ${post.user_liked ? 'fill-current' : ''}`} />
                            <span>{post.likes_count}</span>
                          </button>
                          <button 
                            onClick={() => loadComments(post.id)}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <MessageCircle className="h-5 w-5" />
                            <span>{post.comments_count}</span>
                          </button>
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-green-500 transition-colors">
                            <Share2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Comments Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full sm:max-w-lg sm:rounded-xl max-h-[80vh] flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold">Comentarios</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPost(null)}>
                  Cerrar
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No hay comentarios</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author?.avatar_url || ''} />
                          <AvatarFallback>{comment.author?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.author?.username || 'anon'}</span>
                            <span className="text-muted-foreground text-xs">
                              {formatDistanceToNow(new Date(comment.created_at), { locale: es, addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              {user && (
                <div className="p-4 border-t border-border flex gap-2">
                  <Textarea
                    placeholder="Escribe un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[40px] resize-none"
                    rows={1}
                  />
                  <Button onClick={handleComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border sm:hidden">
        <div className="flex justify-around py-3">
          <Link to="/feed" className="flex flex-col items-center text-primary">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Feed</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-muted-foreground">
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Perfil</span>
          </Link>
          <Link to="/notifications" className="flex flex-col items-center text-muted-foreground">
            <Bell className="h-6 w-6" />
            <span className="text-xs mt-1">Alertas</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center text-muted-foreground">
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Config</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
