import { Shield, Sword, Coins, Zap, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGameState } from '@/hooks/useGameState';
import { Navigation } from './Navigation';
import { SettingsModal } from '@/components/Settings/SettingsModal';
import { useState } from 'react';

export const Header = () => {
  const { gameState, restoreEnergy } = useGameState();
  const { guerreiro } = gameState;
  const [showSettings, setShowSettings] = useState(false);

  // Safety check
  if (!guerreiro) {
    return null;
  }

  const handleRestoreEnergy = () => {
    if (guerreiro.energia < 100) {
      restoreEnergy(25);
    }
  };

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border shadow-deep sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚔️</span>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-fire bg-clip-text text-transparent">
                SISTEMA ESPARTANO
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex justify-center mx-8">
            <Navigation />
          </div>

          {/* User Stats - Perfil do usuário */}
          <div className="flex items-center space-x-4">
            {/* Level */}
            <div className="hidden sm:flex items-center space-x-2">
              <Star className="h-4 w-4 text-secondary" />
              <span className="font-semibold text-foreground text-sm">Nível {guerreiro.nivel}</span>
            </div>

            {/* XP Progress */}
            <div className="hidden md:flex items-center space-x-2 min-w-[100px]">
              <Sword className="h-4 w-4 text-accent" />
              <div className="flex-1">
                <Progress 
                  value={(guerreiro.xp_atual / guerreiro.xp_proximo_nivel) * 100} 
                  variant="xp"
                  className="h-2 w-20"
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {guerreiro.xp_atual}/{guerreiro.xp_proximo_nivel}
              </span>
            </div>

            {/* Energy */}
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-primary" />
              <div className="flex items-center space-x-1">
                <Progress 
                  value={guerreiro.energia} 
                  variant="energy"
                  className="h-2 w-16 lg:w-20"
                />
                <span className="text-xs font-medium text-foreground">
                  {guerreiro.energia}/100
                </span>
              </div>
              {guerreiro.energia < 100 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRestoreEnergy}
                  className="text-xs h-6 px-2"
                >
                  +25
                </Button>
              )}
            </div>

            {/* Sequência */}
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-secondary" />
              <span className="font-semibold text-secondary text-sm">{guerreiro.sequencia_dias}</span>
            </div>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </header>
  );
};