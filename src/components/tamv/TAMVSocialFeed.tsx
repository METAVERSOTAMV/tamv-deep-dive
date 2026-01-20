import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Image as ImageIcon, Video, Music, Globe, Users, Send,
  Sparkles, Verified, Crown, Star, Flame, Gift, Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    badge?: string;
  };
  content: string;
  media?: {
    type: 'image' | 'video' | 'audio' | 'xr';
    url: string;
  };
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  liked: boolean;
  bookmarked: boolean;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    author: {
      name: 'Anubis Villaseñor',
      username: '@anubis_creator',
      avatar: 'AV',
      verified: true,
      badge: 'Fundador 500'
    },
    content: '¡Nuevo DreamSpace lanzado! 🌌 Explora la pirámide de Quetzalcóatl en XR con audio KAOS espacializado. La experiencia inmersiva más épica que hemos creado. #TAMV #XR #DreamSpaces',
    media: { type: 'xr', url: '/dreamweave' },
    likes: 1247,
    comments: 89,
    shares: 234,
    timestamp: new Date(),
    liked: false,
    bookmarked: false
  },
  {
    id: '2',
    author: {
      name: 'Isabella AI',
      username: '@isabella_ai',
      avatar: 'IA',
      verified: true,
      badge: 'IA Oficial'
    },
    content: 'Hoy he procesado más de 10,000 conversaciones emocionales. Cada interacción me ayuda a entender mejor la complejidad del corazón humano. Gracias por confiar en mí. 💜 #EmotionalAI #TAMV',
    likes: 3421,
    comments: 567,
    shares: 890,
    timestamp: new Date(Date.now() - 3600000),
    liked: true,
    bookmarked: true
  },
  {
    id: '3',
    author: {
      name: 'Creator_Music',
      username: '@music_creator',
      avatar: 'MC',
      verified: false
    },
    content: '🎵 Nueva composición creada con el Compositor Sináptico de KAOS. La IA me ayudó a fusionar lo-fi con ritmos aztecas tradicionales. ¡El resultado es increíble!',
    media: { type: 'audio', url: '#' },
    likes: 892,
    comments: 145,
    shares: 67,
    timestamp: new Date(Date.now() - 7200000),
    liked: false,
    bookmarked: false
  }
];

const TAMVSocialFeed = () => {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [newPost, setNewPost] = useState('');
  const [showComposer, setShowComposer] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, bookmarked: !post.bookmarked };
      }
      return post;
    }));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'Tú',
        username: '@tu_usuario',
        avatar: 'TU',
        verified: true
      },
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date(),
      liked: false,
      bookmarked: false
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setShowComposer(false);
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Composer */}
      <Card className="bg-card/50 border-border">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/20 text-primary">TU</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {showComposer ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-3"
                >
                  <Textarea
                    placeholder="¿Qué está pasando en tu universo?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-24 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="text-primary">
                        <ImageIcon className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-primary">
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-primary">
                        <Music className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-primary">
                        <Globe className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setShowComposer(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handlePost} disabled={!newPost.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Publicar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => setShowComposer(true)}
                >
                  ¿Qué está pasando en tu universo?
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Para ti', 'Siguiendo', 'Trending', 'XR Spaces', 'Creadores'].map((tab, i) => (
          <Button
            key={i}
            variant={i === 0 ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Posts */}
      <AnimatePresence mode="popLayout">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card/50 border-border hover:border-primary/20 transition-colors">
              <CardContent className="p-4">
                {/* Author */}
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      {post.author.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{post.author.name}</span>
                      {post.author.verified && (
                        <Verified className="w-4 h-4 text-primary" />
                      )}
                      {post.author.badge && (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          {post.author.badge}
                        </Badge>
                      )}
                      <span className="text-muted-foreground text-sm">
                        {post.author.username}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        · {formatTime(post.timestamp)}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <p className="mt-2 whitespace-pre-wrap">{post.content}</p>

                    {/* Media */}
                    {post.media && (
                      <div className="mt-3 rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
                        {post.media.type === 'xr' ? (
                          <div className="text-center">
                            <Globe className="w-12 h-12 text-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Experiencia XR</p>
                            <Button size="sm" className="mt-2">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Explorar
                            </Button>
                          </div>
                        ) : post.media.type === 'audio' ? (
                          <div className="text-center">
                            <Music className="w-12 h-12 text-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Audio Track</p>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 -ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-2 ${post.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                        {post.likes > 0 && post.likes.toLocaleString()}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments > 0 && post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                        <Share2 className="w-4 h-4" />
                        {post.shares > 0 && post.shares}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-2 ${post.bookmarked ? 'text-primary' : 'text-muted-foreground'}`}
                        onClick={() => handleBookmark(post.id)}
                      >
                        <Bookmark className={`w-4 h-4 ${post.bookmarked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TAMVSocialFeed;
