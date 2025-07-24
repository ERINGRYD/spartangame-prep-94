import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  Swords, 
  Shield, 
  Trophy, 
  Crown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationItems = [
  { id: 'agora', label: 'Ágora', icon: Users, path: '/' },
  { id: 'academia', label: 'Academia', icon: GraduationCap, path: '/academia' },
  { id: 'batalha', label: 'Campo de Batalha', icon: Swords, path: '/batalha' },
  { id: 'arsenal', label: 'Arsenal', icon: Shield, path: '/arsenal' },
  { id: 'coliseu', label: 'Coliseu', icon: Trophy, path: '/coliseu' },
  { id: 'hall', label: 'Hall da Glória', icon: Crown, path: '/hall' }
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-1 bg-card/50 rounded-lg p-1 border border-border">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.id}
              variant={active ? "epic" : "ghost"}
              size="nav"
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex items-center gap-2 transition-all duration-300",
                active && "shadow-gold border-gold"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden xl:inline">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-64 bg-card border-l border-border shadow-deep">
            <div className="flex flex-col p-4 space-y-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold bg-gradient-fire bg-clip-text text-transparent">
                  Menu
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Button
                    key={item.id}
                    variant={active ? "epic" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      active && "shadow-gold border border-gold"
                    )}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t border-border shadow-deep z-40">
        <div className="flex items-center justify-around p-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Button
                key={item.id}
                variant={active ? "epic" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-3",
                  active && "shadow-gold"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};