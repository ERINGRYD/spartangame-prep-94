import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Zap, Shield, Star, Crown, Sword, Award } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requirement: number;
  current: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'progress' | 'consistency' | 'accuracy' | 'mastery';
}

const getAchievements = (gameState: any): Achievement[] => {
  const { guerreiro, inimigos } = gameState;
  
  const totalTentativas = inimigos.reduce((acc: number, inimigo: any) => acc + inimigo.estatisticas.tentativas, 0);
  const totalAcertos = inimigos.reduce((acc: number, inimigo: any) => acc + inimigo.estatisticas.acertos, 0);
  const taxaAcertoGeral = totalTentativas > 0 ? (totalAcertos / totalTentativas) * 100 : 0;
  
  const inimigosMudadosParaVerde = inimigos.filter((i: any) => i.sala_atual === 'verde').length;

  return [
    // Conquistas de Progresso
    {
      id: 'primeira_batalha',
      name: 'Primeira Batalha',
      description: 'Resolva sua primeira questão',
      icon: <Sword className="h-6 w-6" />,
      requirement: 1,
      current: guerreiro.estatisticas.questoes_resolvidas,
      unlocked: guerreiro.estatisticas.questoes_resolvidas >= 1,
      rarity: 'common',
      category: 'progress'
    },
    {
      id: 'veterano',
      name: 'Veterano',
      description: 'Resolva 1000 questões',
      icon: <Crown className="h-6 w-6" />,
      requirement: 1000,
      current: guerreiro.estatisticas.questoes_resolvidas,
      unlocked: guerreiro.estatisticas.questoes_resolvidas >= 1000,
      rarity: 'legendary',
      category: 'progress'
    },
    {
      id: 'centuriao',
      name: 'Centurião',
      description: 'Resolva 100 questões',
      icon: <Shield className="h-6 w-6" />,
      requirement: 100,
      current: guerreiro.estatisticas.questoes_resolvidas,
      unlocked: guerreiro.estatisticas.questoes_resolvidas >= 100,
      rarity: 'epic',
      category: 'progress'
    },

    // Conquistas de Consistência
    {
      id: 'persistente',
      name: 'Persistente',
      description: 'Estude por 7 dias consecutivos',
      icon: <Zap className="h-6 w-6" />,
      requirement: 7,
      current: guerreiro.sequencia_dias,
      unlocked: guerreiro.sequencia_dias >= 7,
      rarity: 'rare',
      category: 'consistency'
    },
    {
      id: 'inabalavel',
      name: 'Inabalável',
      description: 'Estude por 30 dias consecutivos',
      icon: <Star className="h-6 w-6" />,
      requirement: 30,
      current: guerreiro.sequencia_dias,
      unlocked: guerreiro.sequencia_dias >= 30,
      rarity: 'legendary',
      category: 'consistency'
    },

    // Conquistas de Precisão
    {
      id: 'atirador',
      name: 'Atirador de Elite',
      description: 'Mantenha >90% de acerto em 10 questões seguidas',
      icon: <Target className="h-6 w-6" />,
      requirement: 90,
      current: taxaAcertoGeral,
      unlocked: taxaAcertoGeral >= 90 && totalTentativas >= 10,
      rarity: 'epic',
      category: 'accuracy'
    },
    {
      id: 'perfeccionista',
      name: 'Perfeccionista',
      description: 'Alcance 100% de acerto em uma matéria',
      icon: <Trophy className="h-6 w-6" />,
      requirement: 100,
      current: Math.max(...inimigos.map((i: any) => i.estatisticas.taxa_acerto), 0),
      unlocked: inimigos.some((i: any) => i.estatisticas.taxa_acerto === 100 && i.estatisticas.tentativas >= 5),
      rarity: 'legendary',
      category: 'accuracy'
    },

    // Conquistas de Maestria
    {
      id: 'estrategista',
      name: 'Estrategista',
      description: 'Mova 5 inimigos da Vermelha para Verde',
      icon: <Award className="h-6 w-6" />,
      requirement: 5,
      current: inimigosMudadosParaVerde,
      unlocked: inimigosMudadosParaVerde >= 5,
      rarity: 'epic',
      category: 'mastery'
    },
    {
      id: 'mestre',
      name: 'Mestre Spartan',
      description: 'Alcance o nível 10',
      icon: <Crown className="h-6 w-6" />,
      requirement: 10,
      current: guerreiro.nivel,
      unlocked: guerreiro.nivel >= 10,
      rarity: 'legendary',
      category: 'mastery'
    }
  ];
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'border-gray-500 bg-gray-500/10';
    case 'rare': return 'border-blue-500 bg-blue-500/10';
    case 'epic': return 'border-purple-500 bg-purple-500/10';
    case 'legendary': return 'border-yellow-500 bg-yellow-500/10';
    default: return 'border-gray-500 bg-gray-500/10';
  }
};

const getRarityBadge = (rarity: string) => {
  switch (rarity) {
    case 'common': return { variant: 'secondary' as const, text: 'Comum' };
    case 'rare': return { variant: 'default' as const, text: 'Raro' };
    case 'epic': return { variant: 'secondary' as const, text: 'Épico' };
    case 'legendary': return { variant: 'outline' as const, text: 'Lendário' };
    default: return { variant: 'secondary' as const, text: 'Comum' };
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'progress': return <Sword className="h-4 w-4" />;
    case 'consistency': return <Zap className="h-4 w-4" />;
    case 'accuracy': return <Target className="h-4 w-4" />;
    case 'mastery': return <Crown className="h-4 w-4" />;
    default: return <Award className="h-4 w-4" />;
  }
};

export const AchievementsPanel = () => {
  const { gameState } = useGameState();

  if (!gameState.guerreiro) return null;

  const achievements = getAchievements(gameState);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  // Organizar por categorias
  const categories = {
    progress: achievements.filter(a => a.category === 'progress'),
    consistency: achievements.filter(a => a.category === 'consistency'),
    accuracy: achievements.filter(a => a.category === 'accuracy'),
    mastery: achievements.filter(a => a.category === 'mastery'),
  };

  const categoryNames = {
    progress: 'Progresso',
    consistency: 'Consistência',
    accuracy: 'Precisão',
    mastery: 'Maestria'
  };

  return (
    <div className="space-y-6">
      {/* Resumo de Conquistas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{unlockedAchievements.length}</div>
            <div className="text-sm text-muted-foreground">Conquistadas</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{lockedAchievements.length}</div>
            <div className="text-sm text-muted-foreground">Pendentes</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {unlockedAchievements.filter(a => a.rarity === 'epic' || a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-muted-foreground">Raras</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Completo</div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso para Próximas Conquistas */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Próximas Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lockedAchievements
            .sort((a, b) => (b.current / b.requirement) - (a.current / a.requirement))
            .slice(0, 3)
            .map((achievement) => {
              const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);
              const badge = getRarityBadge(achievement.rarity);
              
              return (
                <div key={achievement.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">{achievement.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{achievement.name}</span>
                          <Badge variant={badge.variant} className="text-xs">
                            {badge.text}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.current} / {achievement.requirement}
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Conquistas por Categoria */}
      {Object.entries(categories).map(([category, categoryAchievements]) => (
        <Card key={category} className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(category)}
              {categoryNames[category as keyof typeof categoryNames]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryAchievements.map((achievement) => {
                const badge = getRarityBadge(achievement.rarity);
                const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);
                
                return (
                  <Card 
                    key={achievement.id} 
                    className={`${getRarityColor(achievement.rarity)} ${
                      achievement.unlocked 
                        ? 'border-solid shadow-lg' 
                        : 'border-dashed opacity-60'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground text-sm">
                              {achievement.name}
                            </span>
                            <Badge variant={badge.variant} className="text-xs">
                              {badge.text}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      
                      {!achievement.unlocked && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="text-foreground">
                              {achievement.current} / {achievement.requirement}
                            </span>
                          </div>
                          <Progress value={progress} className="h-1" />
                        </div>
                      )}
                      
                      {achievement.unlocked && (
                        <div className="flex items-center justify-center mt-2">
                          <Badge variant="default" className="bg-green-500 text-white">
                            <Trophy className="h-3 w-3 mr-1" />
                            Conquistada
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};