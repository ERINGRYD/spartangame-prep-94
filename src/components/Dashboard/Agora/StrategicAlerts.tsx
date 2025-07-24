import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, Trophy, ArrowRight } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

interface StrategicAlertsProps {
  onAlertAction?: (action: 'focus-red' | 'restore-energy' | 'celebrate') => void;
}

export const StrategicAlerts = ({ onAlertAction }: StrategicAlertsProps) => {
  const { gameState, restoreEnergy } = useGameState();

  if (!gameState.guerreiro) return null;

  const { guerreiro, inimigos } = gameState;

  // Verificar condições para alertas
  const inimigosVermelhos = inimigos.filter(i => i.sala_atual === 'vermelha').length;
  const alertaCritico = inimigosVermelhos > 3;
  const alertaEnergia = guerreiro.energia < 70;
  const celebracao = guerreiro.sequencia_dias > 7;

  // Se não há alertas, não mostra nada
  if (!alertaCritico && !alertaEnergia && !celebracao) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Situação Estratégica</h3>
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground">
              <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tudo sob controle, guerreiro!</p>
              <p className="text-xs">Continue com o excelente trabalho.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Alertas Estratégicos</h3>
      
      <div className="space-y-3">
        {/* Alerta Crítico: >3 inimigos na Sala Vermelha */}
        {alertaCritico && (
          <Card className="bg-card/80 backdrop-blur-sm border-room-red/50 shadow-[0_4px_20px_-4px_hsl(var(--room-red)/0.3)]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-room-red rounded-lg p-2 animate-pulse">
                  <AlertTriangle className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Situação Crítica!</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {inimigosVermelhos} inimigos na Sala Vermelha precisam de atenção urgente.
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-gradient-room-red hover:bg-room-red/90 text-foreground"
                    onClick={() => onAlertAction?.('focus-red')}
                  >
                    Foco Vermelho
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerta Energia: <70% */}
        {alertaEnergia && (
          <Card className="bg-card/80 backdrop-blur-sm border-room-yellow/50 shadow-[0_4px_20px_-4px_hsl(var(--room-yellow)/0.3)]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-room-yellow rounded-lg p-2">
                  <Zap className="h-5 w-5 text-background" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Energia Baixa</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sua energia está em {guerreiro.energia}%. Considere restaurar para melhor performance.
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-gradient-room-yellow hover:bg-room-yellow/90 text-background"
                    onClick={() => {
                      restoreEnergy(30);
                      onAlertAction?.('restore-energy');
                    }}
                  >
                    Restaurar Energia
                    <Zap className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Celebração: >7 dias */}
        {celebracao && (
          <Card className="bg-card/80 backdrop-blur-sm border-gold shadow-gold">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-gold rounded-lg p-2 animate-pulse">
                  <Trophy className="h-5 w-5 text-background" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">🎉 Conquista Épica!</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {guerreiro.sequencia_dias} dias consecutivos de dedicação! Você é imparável.
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-gradient-gold hover:bg-yellow-500/90 text-background"
                    onClick={() => onAlertAction?.('celebrate')}
                  >
                    Ver Conquistas
                    <Trophy className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};