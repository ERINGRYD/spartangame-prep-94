import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Swords, Trophy, ArrowRight } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

interface StatsCardsProps {
  onCardClick?: (cardType: 'accuracy' | 'enemies' | 'nextLevel') => void;
}

export const StatsCards = ({ onCardClick }: StatsCardsProps) => {
  const { gameState } = useGameState();

  if (!gameState.guerreiro) return null;

  const { guerreiro, inimigos } = gameState;

  // Cálculo da taxa de acerto geral
  const totalTentativas = inimigos.reduce((acc, inimigo) => acc + inimigo.estatisticas.tentativas, 0);
  const totalAcertos = inimigos.reduce((acc, inimigo) => acc + inimigo.estatisticas.acertos, 0);
  const taxaAcertoGeral = totalTentativas > 0 ? (totalAcertos / totalTentativas) * 100 : 0;

  // Distribuição por salas
  const inimigosPorSala = {
    vermelha: inimigos.filter(i => i.sala_atual === 'vermelha').length,
    amarela: inimigos.filter(i => i.sala_atual === 'amarela').length,
    verde: inimigos.filter(i => i.sala_atual === 'verde').length,
  };

  // XP faltante para próximo nível
  const xpFaltante = guerreiro.xp_proximo_nivel - guerreiro.xp_atual;
  const progressoProximoNivel = (guerreiro.xp_atual / guerreiro.xp_proximo_nivel) * 100;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Card 1: Taxa de Acerto Geral */}
      <Card 
        className="group bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-warrior"
        onClick={() => onCardClick?.('accuracy')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-fire rounded-lg p-3 shadow-warrior">
              <Target className="h-6 w-6 text-foreground" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Taxa de Acerto Geral</h3>
            <div className="text-3xl font-bold text-foreground">
              {taxaAcertoGeral.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {totalAcertos} acertos em {totalTentativas} tentativas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Inimigos Ativos */}
      <Card 
        className="group bg-card/80 backdrop-blur-sm border-border hover:border-secondary/50 transition-all duration-300 cursor-pointer hover:shadow-bronze"
        onClick={() => onCardClick?.('enemies')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-bronze rounded-lg p-3 shadow-bronze">
              <Swords className="h-6 w-6 text-foreground" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Inimigos Ativos</h3>
            <div className="text-3xl font-bold text-foreground">
              {inimigos.length}
            </div>
            
            {/* Distribuição por salas */}
            <div className="flex gap-2 flex-wrap">
              {inimigosPorSala.vermelha > 0 && (
                <Badge className="bg-gradient-room-red text-foreground border-0">
                  {inimigosPorSala.vermelha} Vermelha
                </Badge>
              )}
              {inimigosPorSala.amarela > 0 && (
                <Badge className="bg-gradient-room-yellow text-foreground border-0">
                  {inimigosPorSala.amarela} Amarela
                </Badge>
              )}
              {inimigosPorSala.verde > 0 && (
                <Badge className="bg-gradient-room-green text-foreground border-0">
                  {inimigosPorSala.verde} Verde
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Próxima Meta */}
      <Card 
        className="group bg-card/80 backdrop-blur-sm border-border hover:border-gold transition-all duration-300 cursor-pointer hover:shadow-gold"
        onClick={() => onCardClick?.('nextLevel')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-gold rounded-lg p-3 shadow-gold">
              <Trophy className="h-6 w-6 text-background" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Próxima Meta</h3>
            <div className="text-2xl font-bold text-foreground">
              {xpFaltante.toLocaleString()} XP
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Para o nível {guerreiro.nivel + 1}
              </p>
              <Progress 
                value={progressoProximoNivel} 
                variant="epic"
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};