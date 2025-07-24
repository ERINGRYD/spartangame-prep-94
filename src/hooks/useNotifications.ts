import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useApp } from '@/contexts/AppContext';

export const useNotifications = () => {
  const { gameState } = useGameState();
  const { showToast, settings } = useApp();
  const { guerreiro, inimigos } = gameState;

  // Check for low energy
  useEffect(() => {
    if (guerreiro.energia <= 20 && guerreiro.energia > 0) {
      showToast(
        `⚡ Energia baixa! Você tem apenas ${guerreiro.energia} de energia restante.`,
        'warning'
      );
    }
  }, [guerreiro.energia, showToast]);

  // Check for critical enemies (high failure rate)
  useEffect(() => {
    const criticalEnemies = inimigos.filter(
      inimigo => 
        inimigo.estatisticas.tentativas >= 5 && 
        inimigo.estatisticas.taxa_acerto < 30
    );

    if (criticalEnemies.length > 0) {
      const enemy = criticalEnemies[0];
      showToast(
        `🔥 Inimigo crítico: ${enemy.materia} precisa de atenção! Taxa de acerto: ${enemy.estatisticas.taxa_acerto.toFixed(1)}%`,
        'warning'
      );
    }
  }, [inimigos, showToast]);

  // Level up celebration
  useEffect(() => {
    const savedLevel = localStorage.getItem('lastKnownLevel');
    const currentLevel = guerreiro.nivel;

    if (savedLevel && parseInt(savedLevel) < currentLevel) {
      showToast(
        `🎉 LEVEL UP! Você alcançou o nível ${currentLevel}! Continue sua jornada épica!`,
        'success'
      );
      
      // Play sound if enabled
      if (settings.soundEnabled) {
        // Could implement sound effects here
        console.log('🔊 Level up sound!');
      }
    }

    localStorage.setItem('lastKnownLevel', currentLevel.toString());
  }, [guerreiro.nivel, showToast, settings.soundEnabled]);

  // Daily streak reminder
  useEffect(() => {
    const lastLogin = new Date(gameState.lastLogin);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
      showToast(
        `🛡️ Mantenha sua sequência! Já se passaram ${diffDays} dia(s) desde sua última sessão.`,
        'info'
      );
    }
  }, [gameState.lastLogin, showToast]);

  // Achievement unlock notifications
  const celebrateAchievement = (achievementName: string, description: string) => {
    showToast(
      `🏆 CONQUISTA DESBLOQUEADA: ${achievementName}! ${description}`,
      'success'
    );

    if (settings.soundEnabled) {
      console.log('🔊 Achievement unlocked sound!');
    }
  };

  // Study session reminders
  const remindStudySession = () => {
    if (guerreiro.energia >= 20) {
      showToast(
        `📚 Hora de estudar! Você tem ${guerreiro.energia} de energia disponível.`,
        'info'
      );
    }
  };

  // Enemy completion celebration
  const celebrateEnemyDefeat = (enemyName: string) => {
    showToast(
      `⚔️ INIMIGO DERROTADO! ${enemyName} foi conquistado! Sua força cresce!`,
      'success'
    );

    if (settings.soundEnabled) {
      console.log('🔊 Enemy defeated sound!');
    }
  };

  return {
    celebrateAchievement,
    remindStudySession,
    celebrateEnemyDefeat,
  };
};