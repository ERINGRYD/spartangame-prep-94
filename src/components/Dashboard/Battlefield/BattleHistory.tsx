import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGameState } from '@/hooks/useGameState';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Target, Trophy, BookOpen, Swords } from 'lucide-react';

export const BattleHistory = () => {
  const { gameState } = useGameState();

  return (
    <div className="space-y-6">
      {/* Histórico de Inimigos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Swords className="h-5 w-5" />
            <span>Histórico de Batalhas</span>
          </CardTitle>
          <CardDescription>
            Acompanhe seu progresso contra cada inimigo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gameState.inimigos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum inimigo criado ainda</p>
                <p className="text-sm">Visite o Arsenal para criar seu primeiro inimigo!</p>
              </div>
            ) : (
              gameState.inimigos.map((inimigo, index) => (
                <div key={inimigo.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          inimigo.sala_atual === 'vermelha' ? 'bg-red-500' :
                          inimigo.sala_atual === 'amarela' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <div>
                          <h4 className="font-semibold">{inimigo.materia}</h4>
                          <p className="text-sm text-muted-foreground">{inimigo.tema}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {inimigo.estatisticas.acertos}/{inimigo.estatisticas.tentativas}
                        </p>
                        <p className="text-xs text-muted-foreground">acertos</p>
                      </div>
                      
                      <Badge variant={
                        inimigo.estatisticas.taxa_acerto >= 80 ? "default" :
                        inimigo.estatisticas.taxa_acerto >= 60 ? "secondary" :
                        "destructive"
                      }>
                        {inimigo.estatisticas.taxa_acerto.toFixed(0)}%
                      </Badge>
                      
                      <div className="text-right min-w-[80px]">
                        {inimigo.estatisticas.ultima_batalha ? (
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(inimigo.estatisticas.ultima_batalha), "dd/MM", { locale: ptBR })}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Nunca</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < gameState.inimigos.length - 1 && <Separator className="mt-4" />}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Conquistas Desbloqueadas</span>
          </CardTitle>
          <CardDescription>
            Marcos importantes da sua jornada espartana
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gameState.achievements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma conquista desbloqueada ainda</p>
              <p className="text-sm">Continue estudando para desbloquear suas primeiras conquistas!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameState.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-card/50">
                  <Trophy className="h-6 w-6 text-primary" />
                  <span className="font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};