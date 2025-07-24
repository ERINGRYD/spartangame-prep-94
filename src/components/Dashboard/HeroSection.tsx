import { Shield, Target, Trophy, Clock, Flame, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameState } from '@/hooks/useGameState';
import heroImage from '@/assets/spartan-hero.jpg';
export const HeroSection = () => {
  const {
    gameState
  } = useGameState();
  const {
    guerreiro
  } = gameState;

  // Safety check for guerreiro
  if (!guerreiro) {
    return <div>Carregando...</div>;
  }
  const stats = [{
    icon: Target,
    label: 'Questões Resolvidas',
    value: guerreiro.estatisticas.questoes_resolvidas,
    color: 'text-primary'
  }, {
    icon: Flame,
    label: 'Sequência Atual',
    value: `${guerreiro.sequencia_dias} dias`,
    color: 'text-secondary'
  }, {
    icon: Clock,
    label: 'Tempo de Estudo',
    value: `${guerreiro.estatisticas.tempo_total_estudo}min`,
    color: 'text-accent'
  }];
  return <div className="relative overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
      backgroundImage: `url(${heroImage})`
    }} />
      
      {/* Hero Content */}
      <div className="relative bg-gradient-to-r from-background via-background/95 to-transparent">
        
      </div>
    </div>;
};