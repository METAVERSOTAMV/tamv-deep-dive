import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, MessageSquare, Users, Shield, Code, Compass, 
  Settings, Bell, LogOut, Menu, X, User, Wallet,
  BookOpen, Image, Trophy, Globe, Sparkles, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import NotificationsPanel from './NotificationsPanel';

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
  badge?: number;
}

const mainNav: NavItem[] = [
  { icon: Home, label: 'Inicio', href: '/' },
  { icon: MessageSquare, label: 'Feed', href: '/feed' },
  { icon: Globe, label: 'Omniverso', href: '/omniverso' },
  { icon: Compass, label: 'Explorar', href: '/dreamweave' },
];

const secondaryNav: NavItem[] = [
  { icon: Shield, label: 'Guardián', href: '/guardian' },
  { icon: Code, label: 'DevHub', href: '/devhub' },
  { icon: Settings, label: 'Estado', href: '/status' },
];

export default function NavigationSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    subscribeToAuth();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      setUnreadCount(count || 0);
    }
  };

  const subscribeToAuth = () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUser();
      } else {
        setProfile(null);
        setUnreadCount(0);
      }
    });

    return () => subscription.unsubscribe();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 md:translate-x-0 md:static flex flex-col"
      >
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">TAMV</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge className="ml-auto">{item.badge}</Badge>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-sidebar-border">
            <p className="px-3 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Herramientas
            </p>
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setShowNotifications(true)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {profile?.username || 'Usuario'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.tamv_credits || 0} TC
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            <Link to="/auth" onClick={() => setIsOpen(false)}>
              <Button className="w-full">
                <User className="w-4 h-4 mr-2" />
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </motion.aside>

      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
}
