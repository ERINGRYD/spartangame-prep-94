import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGameState } from '@/hooks/useGameState';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, Target, Trophy, BookOpen, Zap, Calendar, Timer, TrendingUp } from 'lucide-react';

export const HistoricoEstudos = () => {
  const { gameState } = useGameState();

  const formatTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`;
  };

  const diasRestantes = gameState.dataProva 
    ? Math.ceil((new Date(gameState.dataProva).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Mock data for study sessions - In a real app, this would come from gameState
  const sessoesPomodoroHoje = 3;
  const tempoEstudoHoje = 75; // minutes
  const historicoSessoes = [
    {
      data: new Date().toISOString(),
      sessoes: 3,
      tempoTotal: 75,
      materias: ['Direito Constitucional', 'Português']
    },
    {
      data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      sessoes: 2,
      tempoTotal: 50,
      materias: ['Matemática']
    },
    {
      data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      sessoes: 4,
      tempoTotal: 100,
      materias: ['Direito Constitucional', 'Português', 'Matemática']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header com contagem regressiva */}
      {gameState.dataProva && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-4">
              <Calendar className="h-8 w-8 text-primary" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {diasRestantes !== null && diasRestantes > 0 ? `${diasRestantes} dias` : 'Prova hoje!'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {diasRestantes !== null && diasRestantes > 0 
                    ? 'para sua prova' 
                    : diasRestantes === 0 
                    ? 'Boa sorte, guerreiro!' 
                    : 'Prova passou'
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(gameState.dataProva), "PPP", { locale: ptBR })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Timer className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Pomodoros Hoje</p>
                <p className="text-2xl font-bold">{sessoesPomodoroHoje}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Tempo Hoje</p>
                <p className="text-2xl font-bold">{formatTempo(tempoEstudoHoje)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Sequência</p>
                <p className="text-2xl font-bold">{gameState.guerreiro.sequencia_dias} dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Sessões de Estudo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Timer className="h-5 w-5" />
            <span>Histórico de Sessões Pomodoro</span>
          </CardTitle>
          <CardDescription>
            Acompanhe seu progresso diário de estudos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historicoSessoes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Timer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma sessão de estudo registrada</p>
                <p className="text-sm">Use o Timer Pomodoro para começar a estudar!</p>
              </div>
            ) : (
              historicoSessoes.map((sessao, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Timer className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">
                            {format(new Date(sessao.data), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {sessao.materias.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {sessao.sessoes} pomodoros
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTempo(sessao.tempoTotal)}
                        </p>
                      </div>
                      
                      <Badge variant={
                        sessao.sessoes >= 4 ? "default" :
                        sessao.sessoes >= 2 ? "secondary" :
                        "outline"
                      }>
                        {sessao.sessoes >= 4 ? 'Excelente' : 
                         sessao.sessoes >= 2 ? 'Bom' : 'Pode melhorar'}
                      </Badge>
                    </div>
                  </div>
                  {index < historicoSessoes.length - 1 && <Separator className="mt-4" />}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Estatísticas Gerais</span>
          </CardTitle>
          <CardDescription>
            Resumo geral do seu progresso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-card/50">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{gameState.guerreiro.estatisticas.questoes_resolvidas}</p>
              <p className="text-sm text-muted-foreground">Questões Resolvidas</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-card/50">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{formatTempo(gameState.guerreiro.estatisticas.tempo_total_estudo)}</p>
              <p className="text-sm text-muted-foreground">Tempo Total</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-card/50">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{gameState.guerreiro.estatisticas.simulados_completos}</p>
              <p className="text-sm text-muted-foreground">Simulados</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-card/50">
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{gameState.guerreiro.nivel}</p>
              <p className="text-sm text-muted-foreground">Nível</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};