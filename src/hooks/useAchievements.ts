import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useNotifications } from '@/hooks/useNotifications';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (gameState: any) => boolean;
  xpReward: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'primeira_batalha',
    name: 'Primeira Batalha',
    description: 'Resolva sua primeira questão',
    icon: '⚔️',
    condition: (gameState) => gameState.guerreiro.estatisticas.questoes_resolvidas >= 1,
    xpReward: 25
  },
  {
    id: 'persistente',
    name: 'Persistente',
    description: 'Estude por 7 dias consecutivos',
    icon: '🛡️',
    condition: (gameState) => gameState.guerreiro.sequencia_dias >= 7,
    xpReward: 100
  },
  {
    id: 'atirador',
    name: 'Atirador Élite',
    description: 'Acerte 10 questões consecutivas com mais de 90% de precisão',
    icon: '🎯',
    condition: (gameState) => {
      // This would need more detailed tracking of consecutive correct answers
      return gameState.guerreiro.estatisticas.taxa_acerto_geral > 90 && 
             gameState.guerreiro.estatisticas.questoes_resolvidas >= 10;
    },
    xpReward: 150
  },
  {
    id: 'estrategista',
    name: 'Estrategista',
    description: 'Mova 5 inimigos da Sala Vermelha para Verde',
    icon: '🧠',
    condition: (gameState) => {
      const greenEnemies = gameState.inimigos.filter(i => i.sala_atual === 'verde').length;
      return greenEnemies >= 5;
    },
    xpReward: 200
  },
  {
    id: 'veterano',
    name: 'Veterano',
    description: 'Resolva 100 questões',
    icon: '👑',
    condition: (gameState) => gameState.guerreiro.estatisticas.questoes_resolvidas >= 100,
    xpReward: 300
  },
  {
    id: 'criador',
    name: 'Criador de Inimigos',
    description: 'Crie 10 inimigos diferentes',
    icon: '🏗️',
    condition: (gameState) => gameState.inimigos.length >= 10,
    xpReward: 75
  },
  {
    id: 'estudioso',
    name: 'Estudioso',
    description: 'Acumule 1000 minutos de estudo',
    icon: '📚',
    condition: (gameState) => gameState.guerreiro.estatisticas.tempo_total_estudo >= 1000,
    xpReward: 250
  },
  {
    id: 'gladiador',
    name: 'Gladiador',
    description: 'Complete 5 simulados',
    icon: '🏛️',
    condition: (gameState) => gameState.guerreiro.estatisticas.simulados_completos >= 5,
    xpReward: 400
  },
  {
    id: 'lenda',
    name: 'Lenda Espartana',
    description: 'Alcance o nível 10',
    icon: '⭐',
    condition: (gameState) => gameState.guerreiro.nivel >= 10,
    xpReward: 500
  },
  {
    id: 'perfeccionista',
    name: 'Perfeccionista',
    description: 'Mantenha 95% de taxa de acerto em 50 questões',
    icon: '💎',
    condition: (gameState) => 
      gameState.guerreiro.estatisticas.taxa_acerto_geral >= 95 && 
      gameState.guerreiro.estatisticas.questoes_resolvidas >= 50,
    xpReward: 350
  }
];

export const useAchievements = () => {
  const { gameState, gainXP } = useGameState();
  const { celebrateAchievement } = useNotifications();

  useEffect(() => {
    // Check for new achievements
    ACHIEVEMENTS.forEach(achievement => {
      const alreadyUnlocked = gameState.achievements.includes(achievement.id);
      const conditionMet = achievement.condition(gameState);

      if (!alreadyUnlocked && conditionMet) {
        // Unlock achievement
        const newAchievements = [...gameState.achievements, achievement.id];
        
        // Update achievements in gameState
        // Note: This would require extending useGameState with an addAchievement method
        localStorage.setItem('spartanSystem', JSON.stringify({
          ...gameState,
          achievements: newAchievements
        }));

        // Grant XP reward
        gainXP(achievement.xpReward);

        // Show celebration
        celebrateAchievement(
          achievement.name,
          `${achievement.description} (+${achievement.xpReward} XP)`
        );
      }
    });
  }, [gameState, gainXP, celebrateAchievement]);

  const getUnlockedAchievements = () => {
    return ACHIEVEMENTS.filter(achievement => 
      gameState.achievements.includes(achievement.id)
    );
  };

  const getNextAchievement = () => {
    return ACHIEVEMENTS.find(achievement => 
      !gameState.achievements.includes(achievement.id)
    );
  };

  const getAchievementProgress = (achievementId: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return 0;

    // This would need more sophisticated progress tracking
    // For now, return simple boolean
    return achievement.condition(gameState) ? 100 : 0;
  };

  return {
    achievements: ACHIEVEMENTS,
    unlockedAchievements: getUnlockedAchievements(),
    nextAchievement: getNextAchievement(),
    getAchievementProgress,
  };
};