import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Trophy, Target, Zap, TrendingUp, Calendar, Sword, Award } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

interface TimelineEvent {
  id: string;
  type: 'battle' | 'level_up' | 'achievement' | 'milestone' | 'streak';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  metadata?: any;
}

const generateMockEvents = (gameState: any): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  const now = new Date();

  // Eventos recentes baseados no estado do jogo
  events.push({
    id: 'recent_battle_1',
    type: 'battle',
    title: 'Batalha Concluída',
    description: 'Direito Constitucional - 85% de acerto',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    icon: <Sword className="h-4 w-4" />,
    metadata: { subject: 'Direito Constitucional', accuracy: 85 }
  });

  if (gameState.guerreiro.nivel > 1) {
    events.push({
      id: 'level_up_recent',
      type: 'level_up',
      title: `Subiu para Nível ${gameState.guerreiro.nivel}`,
      description: `Conquistou ${gameState.guerreiro.xp_atual} XP total`,
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
      icon: <Trophy className="h-4 w-4" />,
      metadata: { level: gameState.guerreiro.nivel }
    });
  }

  events.push({
    id: 'streak_milestone',
    type: 'streak',
    title: 'Sequência de Estudo',
    description: `${gameState.guerreiro.sequencia_dias} dias consecutivos`,
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
    icon: <Zap className="h-4 w-4" />,
    metadata: { days: gameState.guerreiro.sequencia_dias }
  });

  // Marcos fictícios para demonstração
  events.push({
    id: 'achievement_1',
    type: 'achievement',
    title: 'Conquista Desbloqueada',
    description: 'Primeira Batalha - Primeira questão resolvida',
    timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 semana atrás
    icon: <Award className="h-4 w-4" />,
    metadata: { achievement: 'Primeira Batalha' }
  });

  events.push({
    id: 'milestone_questions',
    type: 'milestone',
    title: 'Marco de Questões',
    description: `${gameState.guerreiro.estatisticas.questoes_resolvidas} questões resolvidas`,
    timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias atrás
    icon: <Target className="h-4 w-4" />,
    metadata: { questions: gameState.guerreiro.estatisticas.questoes_resolvidas }
  });

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'battle': return 'border-blue-500 bg-blue-500/10';
    case 'level_up': return 'border-yellow-500 bg-yellow-500/10';
    case 'achievement': return 'border-purple-500 bg-purple-500/10';
    case 'milestone': return 'border-green-500 bg-green-500/10';
    case 'streak': return 'border-orange-500 bg-orange-500/10';
    default: return 'border-gray-500 bg-gray-500/10';
  }
};

const getEventBadge = (type: string) => {
  switch (type) {
    case 'battle': return { variant: 'default' as const, text: 'Batalha' };
    case 'level_up': return { variant: 'secondary' as const, text: 'Level Up' };
    case 'achievement': return { variant: 'outline' as const, text: 'Conquista' };
    case 'milestone': return { variant: 'default' as const, text: 'Marco' };
    case 'streak': return { variant: 'secondary' as const, text: 'Sequência' };
    default: return { variant: 'secondary' as const, text: 'Evento' };
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const eventTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - eventTime.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h atrás`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} dias atrás`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} semanas atrás`;
};

const getStudyPatterns = (gameState: any) => {
  // Análise fictícia de padrões baseada nos dados
  const patterns = [];

  if (gameState.guerreiro.sequencia_dias >= 7) {
    patterns.push({
      type: 'consistency',
      title: 'Estudante Consistente',
      description: 'Você mantém uma rotina regular de estudos',
      icon: <Zap className="h-4 w-4 text-green-500" />
    });
  }

  if (gameState.guerreiro.estatisticas.questoes_resolvidas >= 50) {
    patterns.push({
      type: 'productive',
      title: 'Alta Produtividade',
      description: 'Você resolve questões em bom ritmo',
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />
    });
  }

  patterns.push({
    type: 'recommendation',
    title: 'Melhor Horário',
    description: 'Você costuma ter melhor performance à tarde',
    icon: <Clock className="h-4 w-4 text-yellow-500" />
  });

  return patterns;
};

export const BattleTimeline = () => {
  const { gameState } = useGameState();

  if (!gameState.guerreiro) return null;

  const events = generateMockEvents(gameState);
  const patterns = getStudyPatterns(gameState);

  return (
    <div className="space-y-6">
      {/* Padrões de Estudo Identificados */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Padrões Identificados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {patterns.map((pattern, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                {pattern.icon}
                <div>
                  <div className="font-semibold text-foreground text-sm">{pattern.title}</div>
                  <div className="text-xs text-muted-foreground">{pattern.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline de Atividades */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-secondary" />
            Histórico de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] px-6">
            <div className="relative">
              {/* Linha do tempo */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
              
              <div className="space-y-6 pb-6">
                {events.map((event, index) => {
                  const badge = getEventBadge(event.type);
                  
                  return (
                    <div key={event.id} className="relative flex items-start gap-4">
                      {/* Marcador da timeline */}
                      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${getEventTypeColor(event.type)}`}>
                        {event.icon}
                      </div>
                      
                      {/* Conteúdo do evento */}
                      <div className="flex-1 min-w-0">
                        <Card className={`${getEventTypeColor(event.type)} border-l-4`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{event.title}</h4>
                                <Badge variant={badge.variant} className="text-xs">
                                  {badge.text}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(event.timestamp)}
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {event.description}
                            </p>
                            
                            {/* Metadados específicos do evento */}
                            {event.metadata && (
                              <div className="flex flex-wrap gap-2">
                                {event.type === 'battle' && event.metadata.accuracy && (
                                  <Badge variant="outline" className="text-xs">
                                    {event.metadata.accuracy}% acerto
                                  </Badge>
                                )}
                                {event.type === 'level_up' && (
                                  <Badge variant="outline" className="text-xs">
                                    Nível {event.metadata.level}
                                  </Badge>
                                )}
                                {event.type === 'streak' && (
                                  <Badge variant="outline" className="text-xs">
                                    {event.metadata.days} dias
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Marcos Importantes */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Marcos Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg border border-yellow-500/20">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{gameState.guerreiro.nivel}</div>
              <div className="text-sm text-muted-foreground">Nível Atual</div>
              <div className="text-xs text-muted-foreground mt-1">
                Desde: {formatTimeAgo(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())}
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-500/20">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {gameState.guerreiro.estatisticas.questoes_resolvidas}
              </div>
              <div className="text-sm text-muted-foreground">Questões Resolvidas</div>
              <div className="text-xs text-muted-foreground mt-1">
                Primeira: {formatTimeAgo(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())}
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-lg border border-orange-500/20">
              <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {gameState.guerreiro.sequencia_dias}
              </div>
              <div className="text-sm text-muted-foreground">Recorde de Dias</div>
              <div className="text-xs text-muted-foreground mt-1">
                Atual: {gameState.guerreiro.sequencia_dias} dias
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg border border-green-500/20">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {gameState.inimigos.length}
              </div>
              <div className="text-sm text-muted-foreground">Inimigos Criados</div>
              <div className="text-xs text-muted-foreground mt-1">
                Primeiro: {formatTimeAgo(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};