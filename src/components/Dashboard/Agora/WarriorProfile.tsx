import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sword, Zap, Edit3, Check, X, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useGameState } from '@/hooks/useGameState';

export const WarriorProfile = () => {
  const { gameState, updateWarriorName } = useGameState();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(gameState.guerreiro.nome);

  if (!gameState.guerreiro) return null;

  const { guerreiro } = gameState;
  const xpProgress = (guerreiro.xp_atual / guerreiro.xp_proximo_nivel) * 100;
  
  // Cores dinâmicas da energia
  const getEnergyColor = (energy: number) => {
    if (energy > 80) return 'bg-gradient-room-green';
    if (energy >= 50) return 'bg-gradient-room-yellow';
    return 'bg-gradient-room-red';
  };

  const getEnergyVariant = (energy: number) => {
    if (energy > 80) return 'default';
    if (energy >= 50) return 'energy';
    return 'energy';
  };

  const handleSaveName = () => {
    updateWarriorName(tempName);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setTempName(guerreiro.nome);
    setIsEditingName(false);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-epic">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          {/* Avatar Épico */}
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-gold shadow-gold">
              <AvatarFallback className="bg-gradient-bronze text-2xl text-foreground">
                ⚔️
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-gradient-gold rounded-full p-1">
              <Sword className="h-4 w-4 text-background" />
            </div>
          </div>

          {/* Informações do Guerreiro */}
          <div className="flex-1 space-y-3">
            {/* Nome editável */}
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-background border border-border rounded px-2 py-1 text-lg font-bold text-foreground flex-1"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveName}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h2 className="text-2xl font-bold text-foreground">{guerreiro.nome}</h2>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsEditingName(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Badge variant="secondary" className="bg-gradient-bronze">
                Nível {guerreiro.nivel}
              </Badge>
            </div>

            {/* Progresso XP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Sword className="h-4 w-4" />
                  Experiência
                </span>
                <span className="text-foreground font-semibold">
                  {guerreiro.xp_atual.toLocaleString()} / {guerreiro.xp_proximo_nivel.toLocaleString()} XP
                </span>
              </div>
              <Progress 
                value={xpProgress} 
                variant="xp"
                className="h-3" 
              />
            </div>

            {/* Energia */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  Energia
                </span>
                <span className="text-foreground font-semibold">
                  {guerreiro.energia}/100
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={guerreiro.energia} 
                  variant={getEnergyVariant(guerreiro.energia)}
                  className="h-3" 
                />
                <div 
                  className={`absolute inset-0 ${getEnergyColor(guerreiro.energia)} opacity-20 rounded-full`}
                />
              </div>
            </div>
          </div>

          {/* Métricas importantes */}
          <div className="flex flex-col gap-3">
            {/* Sequência de Dias */}
            <div className="text-center">
              <div className="bg-gradient-gold rounded-lg p-4 shadow-gold">
                <div className="text-2xl font-bold text-background">
                  {guerreiro.sequencia_dias}
                </div>
                <div className="text-xs text-background/80 font-medium">
                  DIAS DE FOCO
                </div>
              </div>
            </div>

            {/* Contagem regressiva da prova */}
            {gameState.dataProva && (
              <div className="text-center">
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-4">
                  <div className="text-xl font-bold text-primary">
                    {(() => {
                      const diasRestantes = differenceInDays(new Date(gameState.dataProva), new Date());
                      return diasRestantes > 0 ? diasRestantes : 0;
                    })()}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {(() => {
                      const diasRestantes = differenceInDays(new Date(gameState.dataProva), new Date());
                      if (diasRestantes > 0) return 'DIAS P/ PROVA';
                      if (diasRestantes === 0) return 'PROVA HOJE!';
                      return 'PROVA PASSOU';
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};