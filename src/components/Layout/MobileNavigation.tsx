import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Swords, 
  Shield, 
  Trophy, 
  Target,
  Zap,
  User
} from 'lucide-react';

interface MobileNavigationProps {}

const navItems = [
  { id: 'agora', icon: Home, label: 'Ágora', path: '/' },
  { id: 'academia', icon: BookOpen, label: 'Academia', path: '/academia' },
  { id: 'batalha', icon: Swords, label: 'Batalha', path: '/batalha' },
  { id: 'arsenal', icon: Shield, label: 'Arsenal', path: '/arsenal' },
  { id: 'coliseu', icon: Target, label: 'Coliseu', path: '/coliseu' },
  { id: 'gloria', icon: Trophy, label: 'Glória', path: '/hall' },
];

export const MobileNavigation = ({}: MobileNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border",
        "transform transition-transform duration-300 md:hidden",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="grid grid-cols-6 gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = isActive(item.path);
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center space-y-1 h-auto p-2 text-xs",
                isItemActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isItemActive && "text-primary")} />
              <span className={cn("text-[10px]", isItemActive && "font-semibold")}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};