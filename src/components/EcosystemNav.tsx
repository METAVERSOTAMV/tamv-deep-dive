import { motion } from 'framer-motion';
import { Brain, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface EcosystemNavProps {
  onIsabellaClick: () => void;
}

const EcosystemNav = ({ onIsabellaClick }: EcosystemNavProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Inicio', href: '#' },
    { name: 'Ecosistema', href: '#ecosystem' },
    { name: 'Dreamweave', href: '#metaverse' },
    { name: 'ID-ENVIDA™', href: '#identity' },
    { name: 'Créditos TC', href: '#economy' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-2xl font-black text-primary-foreground">T</span>
            </div>
            <div>
              <div className="font-black text-xl text-anubis">TAMV</div>
              <div className="text-xs text-muted-foreground -mt-1">DM-X4™</div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground/70 hover:text-foreground transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Isabella AI Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={onIsabellaClick}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground group"
            >
              <Brain className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
              Isabella AI
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border/30"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-3 text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default EcosystemNav;
