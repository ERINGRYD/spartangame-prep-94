import { useState, useCallback } from 'react';
import { Inimigo } from './useGameState';

export interface Question {
  id: string;
  type: 'objective' | 'subjective';
  enunciado: string;
  alternativas?: string[];
  resposta_correta?: number;
  front?: string;
  back?: string;
  inimigoId: string;
}

export interface BattleAnswer {
  questionId: string;
  userAnswer?: number;
  confidence?: 'certeza' | 'duvida' | 'chute';
  selfAssessment?: 'facil' | 'dificil' | 'erro';
  errorReason?: 'conteudo' | 'distracao' | 'interpretacao' | 'indefinido';
  isCorrect: boolean;
  xpGained: number;
}

export interface BattleState {
  selectedEnemies: Inimigo[];
  questions: Question[];
  currentQuestionIndex: number;
  answers: BattleAnswer[];
  isActive: boolean;
  isComplete: boolean;
  showResult: boolean;
  showReport: boolean;
}

const INITIAL_BATTLE_STATE: BattleState = {
  selectedEnemies: [],
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  isActive: false,
  isComplete: false,
  showResult: false,
  showReport: false,
};

export const useBattleState = () => {
  const [battleState, setBattleState] = useState<BattleState>(INITIAL_BATTLE_STATE);

  const startBattle = useCallback((enemies: Inimigo[]) => {
    // Generate mock questions for selected enemies
    const questions: Question[] = enemies.flatMap(enemy => [
      {
        id: `${enemy.id}_obj_1`,
        type: 'objective' as const,
        enunciado: `Questão objetiva de ${enemy.materia}: ${enemy.tema}. Qual das alternativas está correta?`,
        alternativas: [
          'Primeira alternativa correta',
          'Segunda alternativa incorreta',
          'Terceira alternativa incorreta',
          'Quarta alternativa incorreta',
          'Quinta alternativa incorreta'
        ],
        resposta_correta: 0,
        inimigoId: enemy.id,
      },
      {
        id: `${enemy.id}_subj_1`,
        type: 'subjective' as const,
        front: `Explique o conceito principal de ${enemy.tema} em ${enemy.materia}`,
        back: `${enemy.tema} é um conceito fundamental em ${enemy.materia} que se caracteriza por suas aplicações práticas e teóricas, sendo essencial para o entendimento completo da matéria.`,
        enunciado: '',
        inimigoId: enemy.id,
      }
    ]);

    setBattleState({
      selectedEnemies: enemies,
      questions: questions.sort(() => Math.random() - 0.5), // Shuffle questions
      currentQuestionIndex: 0,
      answers: [],
      isActive: true,
      isComplete: false,
      showResult: false,
      showReport: false,
    });
  }, []);

  const submitAnswer = useCallback((answer: Omit<BattleAnswer, 'xpGained'>) => {
    const baseXP = 10;
    const correctXP = answer.isCorrect ? 25 : 0;
    const confidenceXP = answer.confidence === 'certeza' ? 15 : answer.confidence === 'duvida' ? 5 : 0;
    const selfAssessmentXP = answer.selfAssessment === 'facil' ? 15 : answer.selfAssessment === 'dificil' ? 5 : 0;
    
    const xpGained = baseXP + correctXP + confidenceXP + selfAssessmentXP;

    setBattleState(prev => ({
      ...prev,
      answers: [...prev.answers, { ...answer, xpGained }],
      showResult: true,
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setBattleState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      const isComplete = nextIndex >= prev.questions.length;
      
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        showResult: false,
        isComplete,
        isActive: !isComplete,
        showReport: isComplete,
      };
    });
  }, []);

  const resetBattle = useCallback(() => {
    setBattleState(INITIAL_BATTLE_STATE);
  }, []);

  const calculateResults = useCallback(() => {
    const totalQuestions = battleState.answers.length;
    const correctAnswers = battleState.answers.filter(a => a.isCorrect).length;
    const totalXP = battleState.answers.reduce((sum, a) => sum + a.xpGained, 0);
    
    return {
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
      totalXP,
    };
  }, [battleState.answers]);

  return {
    battleState,
    startBattle,
    submitAnswer,
    nextQuestion,
    resetBattle,
    calculateResults,
  };
};