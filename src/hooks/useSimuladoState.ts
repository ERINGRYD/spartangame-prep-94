import { useState, useCallback, useEffect } from 'react';
import { Question } from './useBattleState';
import { Inimigo } from './useGameState';

export interface SimuladoConfig {
  tipo: 'escaramuca' | 'guerra_total' | 'operacao_resgate';
  materias?: string[];
  quantidade_questoes?: number;
  tempo_limite?: number; // em minutos
}

export interface SimuladoQuestion extends Question {
  marcada_revisao: boolean;
  tempo_resposta?: number;
  respondida: boolean;
}

export interface SimuladoAnswer {
  questionId: string;
  userAnswer?: number;
  isCorrect: boolean;
  tempo_resposta: number;
  marcada_revisao: boolean;
}

export interface SimuladoResults {
  tipo: SimuladoConfig['tipo'];
  questoes_totais: number;
  questoes_corretas: number;
  taxa_acerto: number;
  tempo_total: number;
  tempo_previsto: number;
  xp_ganho: number;
  performance_por_materia: Record<string, { corretas: number; totais: number; taxa: number }>;
  questoes_marcadas: string[];
  data_conclusao: string;
}

export interface SimuladoState {
  config: SimuladoConfig | null;
  questions: SimuladoQuestion[];
  currentQuestionIndex: number;
  answers: SimuladoAnswer[];
  markedForReview: Set<string>;
  isActive: boolean;
  isComplete: boolean;
  showReport: boolean;
  startTime: number | null;
  timeSpent: number;
  results: SimuladoResults | null;
}

const INITIAL_SIMULADO_STATE: SimuladoState = {
  config: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  markedForReview: new Set(),
  isActive: false,
  isComplete: false,
  showReport: false,
  startTime: null,
  timeSpent: 0,
  results: null,
};

export const useSimuladoState = () => {
  const [simuladoState, setSimuladoState] = useState<SimuladoState>(INITIAL_SIMULADO_STATE);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (simuladoState.isActive && simuladoState.startTime) {
      interval = setInterval(() => {
        setSimuladoState(prev => ({
          ...prev,
          timeSpent: Math.floor((Date.now() - prev.startTime!) / 1000)
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simuladoState.isActive, simuladoState.startTime]);

  const generateQuestions = useCallback((config: SimuladoConfig, enemies: Inimigo[]): SimuladoQuestion[] => {
    let filteredEnemies = enemies;
    
    // Filter by room for Operação Resgate
    if (config.tipo === 'operacao_resgate') {
      filteredEnemies = enemies.filter(enemy => enemy.sala_atual === 'vermelha');
    }
    
    // Filter by subjects if specified
    if (config.materias && config.materias.length > 0) {
      filteredEnemies = filteredEnemies.filter(enemy => config.materias!.includes(enemy.materia));
    }

    // Generate questions from enemies
    const allQuestions: SimuladoQuestion[] = filteredEnemies.flatMap(enemy => [
      {
        id: `${enemy.id}_obj_sim_${Date.now()}_1`,
        type: 'objective' as const,
        enunciado: `Questão de ${enemy.materia}: ${enemy.tema}. Qual das alternativas está correta?`,
        alternativas: [
          'Primeira alternativa correta',
          'Segunda alternativa incorreta',
          'Terceira alternativa incorreta',
          'Quarta alternativa incorreta',
          'Quinta alternativa incorreta'
        ],
        resposta_correta: 0,
        inimigoId: enemy.id,
        marcada_revisao: false,
        respondida: false,
      },
      {
        id: `${enemy.id}_subj_sim_${Date.now()}_2`,
        type: 'subjective' as const,
        front: `Explique o conceito de ${enemy.tema} em ${enemy.materia}`,
        back: `${enemy.tema} é um conceito fundamental que requer compreensão profunda.`,
        enunciado: '',
        inimigoId: enemy.id,
        marcada_revisao: false,
        respondida: false,
      }
    ]);

    // Shuffle and limit questions based on config
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    
    let questionCount: number;
    switch (config.tipo) {
      case 'escaramuca':
        questionCount = Math.min(shuffled.length, config.quantidade_questoes || Math.floor(Math.random() * 11) + 10);
        break;
      case 'guerra_total':
        questionCount = Math.min(shuffled.length, config.quantidade_questoes || Math.floor(Math.random() * 51) + 50);
        break;
      case 'operacao_resgate':
        questionCount = config.quantidade_questoes || shuffled.length;
        break;
      default:
        questionCount = 20;
    }

    return shuffled.slice(0, questionCount);
  }, []);

  const startSimulado = useCallback((config: SimuladoConfig, enemies: Inimigo[]) => {
    const questions = generateQuestions(config, enemies);
    
    setSimuladoState({
      config,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      markedForReview: new Set(),
      isActive: true,
      isComplete: false,
      showReport: false,
      startTime: Date.now(),
      timeSpent: 0,
      results: null,
    });
  }, [generateQuestions]);

  const navigateToQuestion = useCallback((index: number) => {
    setSimuladoState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, Math.min(index, prev.questions.length - 1))
    }));
  }, []);

  const toggleQuestionForReview = useCallback((questionId: string) => {
    setSimuladoState(prev => {
      const newMarked = new Set(prev.markedForReview);
      if (newMarked.has(questionId)) {
        newMarked.delete(questionId);
      } else {
        newMarked.add(questionId);
      }
      
      return {
        ...prev,
        markedForReview: newMarked,
        questions: prev.questions.map(q => 
          q.id === questionId 
            ? { ...q, marcada_revisao: !q.marcada_revisao }
            : q
        )
      };
    });
  }, []);

  const submitAnswer = useCallback((questionId: string, userAnswer?: number) => {
    const questionStartTime = Date.now();
    
    setSimuladoState(prev => {
      const question = prev.questions.find(q => q.id === questionId);
      if (!question) return prev;

      const isCorrect = question.type === 'objective' 
        ? userAnswer === question.resposta_correta
        : true; // For subjective, we'll assume correct for now

      const tempo_resposta = Math.floor((questionStartTime - prev.startTime!) / 1000) - prev.timeSpent;

      const newAnswer: SimuladoAnswer = {
        questionId,
        userAnswer,
        isCorrect,
        tempo_resposta,
        marcada_revisao: prev.markedForReview.has(questionId)
      };

      return {
        ...prev,
        answers: [...prev.answers.filter(a => a.questionId !== questionId), newAnswer],
        questions: prev.questions.map(q => 
          q.id === questionId 
            ? { ...q, respondida: true, tempo_resposta }
            : q
        )
      };
    });
  }, []);

  const finishSimulado = useCallback(() => {
    setSimuladoState(prev => {
      if (!prev.config) return prev;

      const questoes_corretas = prev.answers.filter(a => a.isCorrect).length;
      const questoes_totais = prev.questions.length;
      const taxa_acerto = questoes_totais > 0 ? (questoes_corretas / questoes_totais) * 100 : 0;

      // Calculate XP based on performance and type
      let baseXP = 0;
      switch (prev.config.tipo) {
        case 'escaramuca':
          baseXP = 100 + Math.floor(taxa_acerto * 0.5);
          break;
        case 'guerra_total':
          baseXP = 200 + Math.floor(taxa_acerto * 1.0);
          break;
        case 'operacao_resgate':
          baseXP = questoes_corretas * 50;
          break;
      }

      // Performance by subject
      const performance_por_materia: Record<string, { corretas: number; totais: number; taxa: number }> = {};
      prev.questions.forEach(question => {
        const answer = prev.answers.find(a => a.questionId === question.id);
        const materia = question.inimigoId; // This should be improved to get actual subject
        
        if (!performance_por_materia[materia]) {
          performance_por_materia[materia] = { corretas: 0, totais: 0, taxa: 0 };
        }
        
        performance_por_materia[materia].totais++;
        if (answer?.isCorrect) {
          performance_por_materia[materia].corretas++;
        }
        
        performance_por_materia[materia].taxa = 
          (performance_por_materia[materia].corretas / performance_por_materia[materia].totais) * 100;
      });

      const results: SimuladoResults = {
        tipo: prev.config.tipo,
        questoes_totais,
        questoes_corretas,
        taxa_acerto,
        tempo_total: prev.timeSpent,
        tempo_previsto: prev.config.tempo_limite ? prev.config.tempo_limite * 60 : 0,
        xp_ganho: baseXP,
        performance_por_materia,
        questoes_marcadas: Array.from(prev.markedForReview),
        data_conclusao: new Date().toISOString()
      };

      return {
        ...prev,
        isActive: false,
        isComplete: true,
        showReport: true,
        results
      };
    });
  }, []);

  const resetSimulado = useCallback(() => {
    setSimuladoState(INITIAL_SIMULADO_STATE);
  }, []);

  const getQuestionProgress = useCallback(() => {
    const answered = simuladoState.answers.length;
    const total = simuladoState.questions.length;
    const marked = simuladoState.markedForReview.size;
    
    return { answered, total, marked, remaining: total - answered };
  }, [simuladoState.answers.length, simuladoState.questions.length, simuladoState.markedForReview.size]);

  return {
    simuladoState,
    startSimulado,
    navigateToQuestion,
    toggleQuestionForReview,
    submitAnswer,
    finishSimulado,
    resetSimulado,
    getQuestionProgress,
  };
};