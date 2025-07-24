import { useState, useEffect } from 'react';

export interface Guerreiro {
  nome: string;
  nivel: number;
  xp_atual: number;
  xp_proximo_nivel: number;
  energia: number;
  sequencia_dias: number;
  estatisticas: {
    questoes_resolvidas: number;
    taxa_acerto_geral: number;
    tempo_total_estudo: number;
    simulados_completos: number;
  };
}

export interface Questao {
  id: string;
  tipo: 'objetiva' | 'subjetiva';
  enunciado: string;
  alternativas?: string[];
  gabarito?: string;
  frente?: string;
  verso?: string;
}

export interface Inimigo {
  id: string;
  materia: string;
  tema: string;
  subtema?: string;
  tipo: 'objetiva' | 'subjetiva';
  sala_atual: 'vermelha' | 'amarela' | 'verde';
  questoes: Questao[];
  estatisticas: {
    acertos: number;
    tentativas: number;
    taxa_acerto: number;
    ultima_batalha: string | null;
  };
  data_criacao: string;
}

export interface GameState {
  guerreiro: Guerreiro;
  inimigos: Inimigo[];
  achievements: string[];
  dailyQuests: string[];
  lastLogin: string;
  dataProva?: string;
}

const INITIAL_GAME_STATE: GameState = {
  guerreiro: {
    nome: "Guerreiro",
    nivel: 1,
    xp_atual: 0,
    xp_proximo_nivel: 1000,
    energia: 100,
    sequencia_dias: 1,
    estatisticas: {
      questoes_resolvidas: 0,
      taxa_acerto_geral: 0,
      tempo_total_estudo: 0,
      simulados_completos: 0
    }
  },
  inimigos: [
    {
      id: "direito_constitucional",
      materia: "Direito Constitucional",
      tema: "Direitos Fundamentais",
      tipo: "objetiva",
      sala_atual: "vermelha",
      questoes: [],
      estatisticas: {
        acertos: 0,
        tentativas: 0,
        taxa_acerto: 0,
        ultima_batalha: null
      },
      data_criacao: new Date().toISOString()
    },
    {
      id: "portugues",
      materia: "Português",
      tema: "Interpretação de Texto",
      tipo: "objetiva",
      sala_atual: "amarela",
      questoes: [],
      estatisticas: {
        acertos: 0,
        tentativas: 0,
        taxa_acerto: 0,
        ultima_batalha: null
      },
      data_criacao: new Date().toISOString()
    },
    {
      id: "matematica",
      materia: "Matemática",
      tema: "Raciocínio Lógico",
      tipo: "objetiva",
      sala_atual: "verde",
      questoes: [],
      estatisticas: {
        acertos: 0,
        tentativas: 0,
        taxa_acerto: 0,
        ultima_batalha: null
      },
      data_criacao: new Date().toISOString()
    }
  ],
  achievements: [],
  dailyQuests: [],
  lastLogin: new Date().toISOString(),
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('spartanSystem');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Migrate old data structure if needed
        if (parsedState.user && !parsedState.guerreiro) {
          return {
            ...INITIAL_GAME_STATE,
            guerreiro: {
              ...INITIAL_GAME_STATE.guerreiro,
              nivel: parsedState.user.level || 1,
              xp_atual: parsedState.user.xp || 0,
              xp_proximo_nivel: parsedState.user.xpToNext || 1000,
              energia: parsedState.user.energy || 100,
              sequencia_dias: parsedState.user.streak || 1,
              estatisticas: {
                questoes_resolvidas: parsedState.user.completedQuests || 0,
                taxa_acerto_geral: 0,
                tempo_total_estudo: parsedState.user.totalStudyTime || 0,
                simulados_completos: 0
              }
            }
          };
        }
        return parsedState;
      } catch (e) {
        console.error('Error parsing saved game state:', e);
        return INITIAL_GAME_STATE;
      }
    }
    return INITIAL_GAME_STATE;
  });

  useEffect(() => {
    localStorage.setItem('spartanSystem', JSON.stringify(gameState));
  }, [gameState]);

  const gainXP = (amount: number) => {
    setGameState(prev => {
      const newXP = prev.guerreiro.xp_atual + amount;
      let newLevel = prev.guerreiro.nivel;
      let newXPToNext = prev.guerreiro.xp_proximo_nivel;

      // Level up logic
      while (newXP >= newXPToNext) {
        newLevel++;
        newXPToNext = newLevel * 1000; // XP necessário aumenta com o nível
      }

      return {
        ...prev,
        guerreiro: {
          ...prev.guerreiro,
          xp_atual: newXP,
          nivel: newLevel,
          xp_proximo_nivel: newXPToNext,
        },
      };
    });
  };

  const spendEnergy = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      guerreiro: {
        ...prev.guerreiro,
        energia: Math.max(0, prev.guerreiro.energia - amount),
      },
    }));
  };

  const restoreEnergy = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      guerreiro: {
        ...prev.guerreiro,
        energia: Math.min(100, prev.guerreiro.energia + amount),
      },
    }));
  };

  const updateInimigoStats = (inimigoId: string, acerto: boolean) => {
    setGameState(prev => ({
      ...prev,
      inimigos: prev.inimigos.map(inimigo =>
        inimigo.id === inimigoId
          ? { 
              ...inimigo, 
              estatisticas: {
                ...inimigo.estatisticas,
                tentativas: inimigo.estatisticas.tentativas + 1,
                acertos: acerto ? inimigo.estatisticas.acertos + 1 : inimigo.estatisticas.acertos,
                taxa_acerto: ((acerto ? inimigo.estatisticas.acertos + 1 : inimigo.estatisticas.acertos) / (inimigo.estatisticas.tentativas + 1)) * 100,
                ultima_batalha: new Date().toISOString()
              }
            }
          : inimigo
      ),
    }));
  };

  const addQuestaoResolvida = () => {
    setGameState(prev => ({
      ...prev,
      guerreiro: {
        ...prev.guerreiro,
        estatisticas: {
          ...prev.guerreiro.estatisticas,
          questoes_resolvidas: prev.guerreiro.estatisticas.questoes_resolvidas + 1,
        },
      },
    }));
  };

  const addStudyTime = (minutes: number) => {
    setGameState(prev => ({
      ...prev,
      guerreiro: {
        ...prev.guerreiro,
        estatisticas: {
          ...prev.guerreiro.estatisticas,
          tempo_total_estudo: prev.guerreiro.estatisticas.tempo_total_estudo + minutes,
        },
      },
    }));
  };

  const updateWarriorName = (newName: string) => {
    setGameState(prev => ({
      ...prev,
      guerreiro: {
        ...prev.guerreiro,
        nome: newName
      }
    }));
  };

  const setDataProva = (data: string) => {
    setGameState(prev => ({
      ...prev,
      dataProva: data
    }));
  };

  const addInimigo = (inimigo: Omit<Inimigo, 'id' | 'data_criacao' | 'estatisticas'>) => {
    const newInimigo: Inimigo = {
      ...inimigo,
      id: `${inimigo.materia}_${inimigo.tema}_${Date.now()}`.toLowerCase().replace(/\s+/g, '_'),
      data_criacao: new Date().toISOString(),
      estatisticas: {
        acertos: 0,
        tentativas: 0,
        taxa_acerto: 0,
        ultima_batalha: null
      }
    };

    setGameState(prev => ({
      ...prev,
      inimigos: [...prev.inimigos, newInimigo]
    }));

    // Ganha 15 XP por criar inimigo
    gainXP(15);
  };

  const updateInimigo = (inimigoId: string, updates: Partial<Inimigo>) => {
    setGameState(prev => ({
      ...prev,
      inimigos: prev.inimigos.map(inimigo =>
        inimigo.id === inimigoId ? { ...inimigo, ...updates } : inimigo
      )
    }));
  };

  const deleteInimigo = (inimigoId: string) => {
    setGameState(prev => ({
      ...prev,
      inimigos: prev.inimigos.filter(inimigo => inimigo.id !== inimigoId)
    }));
  };

  const addQuestaoToInimigo = (inimigoId: string, questao: Omit<Questao, 'id'>) => {
    const newQuestao: Questao = {
      ...questao,
      id: `questao_${Date.now()}`
    };

    setGameState(prev => ({
      ...prev,
      inimigos: prev.inimigos.map(inimigo =>
        inimigo.id === inimigoId
          ? { ...inimigo, questoes: [...inimigo.questoes, newQuestao] }
          : inimigo
      )
    }));
  };

  return {
    gameState,
    gainXP,
    spendEnergy,
    restoreEnergy,
    updateInimigoStats,
    addQuestaoResolvida,
    addStudyTime,
    updateWarriorName,
    setDataProva,
    addInimigo,
    updateInimigo,
    deleteInimigo,
    addQuestaoToInimigo,
  };
};