import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Target, TrendingUp, AlertTriangle, CheckCircle, Clock, Zap, Brain } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

interface Recommendation {
  id: string;
  type: 'focus' | 'strategy' | 'goal' | 'warning';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionPlan: string[];
  expectedBenefit: string;
  timeframe: string;
  icon: React.ReactNode;
}

const generateRecommendations = (gameState: any): Recommendation[] => {
  const { guerreiro, inimigos } = gameState;
  const recommendations: Recommendation[] = [];

  // Calcular estatísticas gerais
  const totalTentativas = inimigos.reduce((acc: number, inimigo: any) => acc + inimigo.estatisticas.tentativas, 0);
  const totalAcertos = inimigos.reduce((acc: number, inimigo: any) => acc + inimigo.estatisticas.acertos, 0);
  const taxaAcertoGeral = totalTentativas > 0 ? (totalAcertos / totalTentativas) * 100 : 0;
  
  // Identificar matérias com baixo desempenho
  const materiasBaixoDesempenho = inimigos
    .filter((inimigo: any) => inimigo.estatisticas.taxa_acerto < 60 && inimigo.estatisticas.tentativas >= 3)
    .map((inimigo: any) => inimigo.materia);

  // Identificar inimigos na sala vermelha há muito tempo
  const inimigosVermelhaAntigos = inimigos.filter((inimigo: any) => 
    inimigo.sala_atual === 'vermelha' && 
    inimigo.estatisticas.tentativas >= 5
  );

  // Recomendações baseadas no desempenho
  if (materiasBaixoDesempenho.length > 0) {
    recommendations.push({
      id: 'focus_weak_subjects',
      type: 'focus',
      priority: 'high',
      title: 'Foque nas Matérias com Baixo Desempenho',
      description: `Identificamos ${materiasBaixoDesempenho.length} matéria(s) que precisam de atenção especial.`,
      actionPlan: [
        'Dedique 60% do seu tempo às matérias com taxa de acerto < 60%',
        'Revise a teoria antes de resolver questões',
        'Faça anotações dos erros mais frequentes',
        'Busque questões similares para praticar'
      ],
      expectedBenefit: 'Aumento de 15-20% na taxa de acerto em 2 semanas',
      timeframe: '2-3 semanas',
      icon: <Target className="h-5 w-5" />
    });
  }

  if (inimigosVermelhaAntigos.length > 0) {
    recommendations.push({
      id: 'move_red_enemies',
      type: 'strategy',
      priority: 'high',
      title: 'Promova Inimigos da Sala Vermelha',
      description: `Você tem ${inimigosVermelhaAntigos.length} inimigo(s) há muito tempo na sala vermelha.`,
      actionPlan: [
        'Concentre esforços para melhorar a taxa de acerto destes inimigos',
        'Estude a teoria específica antes das batalhas',
        'Use técnicas de memorização para conceitos difíceis',
        'Pratique diariamente até conseguir 70% de acerto'
      ],
      expectedBenefit: 'Movimentação para sala amarela e ganho de 50 XP por inimigo',
      timeframe: '1-2 semanas',
      icon: <TrendingUp className="h-5 w-5" />
    });
  }

  // Recomendações baseadas na consistência
  if (guerreiro.sequencia_dias < 7) {
    recommendations.push({
      id: 'improve_consistency',
      type: 'goal',
      priority: 'medium',
      title: 'Desenvolva uma Rotina Consistente',
      description: 'Estabeleça o hábito de estudar todos os dias para maximizar seu progresso.',
      actionPlan: [
        'Defina um horário fixo para estudar (ex: 19h às 20h)',
        'Comece com sessões de 30 minutos por dia',
        'Use lembretes no celular para não esquecer',
        'Recompense-se após completar uma semana de estudos'
      ],
      expectedBenefit: 'Desbloqueio da conquista "Persistente" e 100 XP de bônus',
      timeframe: '1 semana',
      icon: <Clock className="h-5 w-5" />
    });
  }

  // Recomendações de estratégia avançada
  if (taxaAcertoGeral > 70) {
    recommendations.push({
      id: 'advanced_strategy',
      type: 'strategy',
      priority: 'medium',
      title: 'Estratégia Avançada: Método Sparta',
      description: 'Sua performance está boa! Hora de implementar técnicas avançadas.',
      actionPlan: [
        'Foque em questões mais difíceis (nível concurso)',
        'Implemente revisão espaçada: revise erros após 1, 3 e 7 dias',
        'Crie mapas mentais das matérias principais',
        'Faça simulados cronometrados para melhorar velocidade'
      ],
      expectedBenefit: 'Preparação para concursos de alto nível e taxa de acerto > 85%',
      timeframe: '3-4 semanas',
      icon: <Brain className="h-5 w-5" />
    });
  }

  // Alerta de energia baixa
  if (guerreiro.energia < 30) {
    recommendations.push({
      id: 'energy_warning',
      type: 'warning',
      priority: 'high',
      title: 'Energia Baixa - Faça uma Pausa',
      description: 'Sua energia está baixa. É importante descansar para manter a qualidade dos estudos.',
      actionPlan: [
        'Faça uma pausa de 2-4 horas',
        'Pratique exercícios leves ou meditation',
        'Hidrate-se bem e faça um lanche saudável',
        'Volte aos estudos quando se sentir revigorado'
      ],
      expectedBenefit: 'Restauração da energia e melhora na concentração',
      timeframe: 'Imediato',
      icon: <Zap className="h-5 w-5" />
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'border-red-500 bg-red-500/10';
    case 'medium': return 'border-yellow-500 bg-yellow-500/10';
    case 'low': return 'border-green-500 bg-green-500/10';
    default: return 'border-gray-500 bg-gray-500/10';
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high': return { variant: 'destructive' as const, text: 'Alta Prioridade' };
    case 'medium': return { variant: 'secondary' as const, text: 'Média Prioridade' };
    case 'low': return { variant: 'outline' as const, text: 'Baixa Prioridade' };
    default: return { variant: 'secondary' as const, text: 'Prioridade' };
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'focus': return <Target className="h-4 w-4" />;
    case 'strategy': return <Brain className="h-4 w-4" />;
    case 'goal': return <CheckCircle className="h-4 w-4" />;
    case 'warning': return <AlertTriangle className="h-4 w-4" />;
    default: return <Lightbulb className="h-4 w-4" />;
  }
};

export const StrategicRecommendations = () => {
  const { gameState } = useGameState();

  if (!gameState.guerreiro) return null;

  const recommendations = generateRecommendations(gameState);
  const { guerreiro, inimigos } = gameState;

  // Análise da semana atual vs anterior (mockado)
  const weeklyComparison = {
    questoesEstaSeamana: 45,
    questoesSemanaPassada: 38,
    taxaAcertoEstaSeamana: 78,
    taxaAcertoSemanaPassada: 72,
    xpEstaSeamana: 1250,
    xpSemanaPassada: 980
  };

  const progressoQuestoes = ((weeklyComparison.questoesEstaSeamana - weeklyComparison.questoesSemanaPassada) / weeklyComparison.questoesSemanaPassada) * 100;
  const progressoTaxa = weeklyComparison.taxaAcertoEstaSeamana - weeklyComparison.taxaAcertoSemanaPassada;
  const progressoXP = ((weeklyComparison.xpEstaSeamana - weeklyComparison.xpSemanaPassada) / weeklyComparison.xpSemanaPassada) * 100;

  return (
    <div className="space-y-6">
      {/* Análise Comparativa Semanal */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Análise Semanal Comparativa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {weeklyComparison.questoesEstaSeamana}
                </div>
                <div className="text-sm text-muted-foreground mb-2">Questões Esta Semana</div>
                <div className={`text-xs font-semibold ${progressoQuestoes > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {progressoQuestoes > 0 ? '+' : ''}{progressoQuestoes.toFixed(1)}% vs semana anterior
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {weeklyComparison.taxaAcertoEstaSeamana}%
                </div>
                <div className="text-sm text-muted-foreground mb-2">Taxa de Acerto</div>
                <div className={`text-xs font-semibold ${progressoTaxa > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {progressoTaxa > 0 ? '+' : ''}{progressoTaxa.toFixed(1)}% vs semana anterior
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {weeklyComparison.xpEstaSeamana}
                </div>
                <div className="text-sm text-muted-foreground mb-2">XP Ganho</div>
                <div className={`text-xs font-semibold ${progressoXP > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {progressoXP > 0 ? '+' : ''}{progressoXP.toFixed(1)}% vs semana anterior
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Sugerida para Próxima Semana */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Meta da Próxima Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Meta Inteligente:</strong> Baseada no seu progresso atual, sugerimos resolver <strong>50 questões</strong> 
                com foco nas matérias de baixo desempenho. Isso deve resultar em um ganho de <strong>1400-1600 XP</strong> 
                e melhoria de <strong>5-8%</strong> na sua taxa de acerto geral.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Objetivos Específicos:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Resolver 50 questões (7 por dia)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Melhorar taxa de acerto para 80%+
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Mover 2 inimigos para sala amarela/verde
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Manter sequência de 7 dias
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Progresso Esperado:</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Para Nível {guerreiro.nivel + 1}</span>
                      <span>{Math.min(85, ((guerreiro.xp_atual + 1500) / guerreiro.xp_proximo_nivel) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={Math.min(85, ((guerreiro.xp_atual + 1500) / guerreiro.xp_proximo_nivel) * 100)} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Com 1500 XP estimados, você ficará {Math.max(0, guerreiro.xp_proximo_nivel - guerreiro.xp_atual - 1500).toLocaleString()} XP 
                    do próximo nível
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendações Estratégicas */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-secondary" />
          Plano de Ação Estratégico
        </h3>

        {recommendations.map((recommendation) => {
          const badge = getPriorityBadge(recommendation.priority);
          
          return (
            <Card key={recommendation.id} className={`${getPriorityColor(recommendation.priority)} border-l-4`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {recommendation.icon}
                    {recommendation.title}
                  </CardTitle>
                  <Badge variant={badge.variant}>
                    {badge.text}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{recommendation.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      {getTypeIcon(recommendation.type)}
                      Plano de Ação
                    </h4>
                    <ul className="space-y-1">
                      {recommendation.actionPlan.map((action, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary font-bold">{index + 1}.</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-background/50 rounded-lg p-3">
                      <h5 className="font-semibold text-foreground text-sm mb-1">Benefício Esperado</h5>
                      <p className="text-sm text-muted-foreground">{recommendation.expectedBenefit}</p>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-3">
                      <h5 className="font-semibold text-foreground text-sm mb-1">Prazo</h5>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recommendation.timeframe}
                      </p>
                    </div>
                  </div>
                </div>

                {recommendation.priority === 'high' && (
                  <Button className="w-full" size="sm">
                    Implementar Estratégia
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};