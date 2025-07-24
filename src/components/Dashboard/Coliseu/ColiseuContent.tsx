import { SimuladoSelection } from './SimuladoSelection';
import { SimuladoExecution } from './SimuladoExecution';
import { SimuladoReport } from './SimuladoReport';
import { useSimuladoState } from '@/hooks/useSimuladoState';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ColiseuContentProps {
  onNavigate?: (tab: string) => void;
}

export const ColiseuContent = ({ onNavigate }: ColiseuContentProps) => {
  const { gameState, gainXP, updateInimigoStats } = useGameState();
  const {
    simuladoState,
    startSimulado,
    navigateToQuestion,
    toggleQuestionForReview,
    submitAnswer,
    finishSimulado,
    resetSimulado,
    getQuestionProgress
  } = useSimuladoState();

  const handleStartSimulado = (config: any) => {
    const availableEnemies = gameState.inimigos.filter(enemy => {
      if (config.tipo === 'operacao_resgate') {
        return enemy.sala_atual === 'vermelha';
      }
      if (config.materias && config.materias.length > 0) {
        return config.materias.includes(enemy.materia);
      }
      return true;
    });

    if (availableEnemies.length === 0) {
      toast({
        title: "Nenhum inimigo disponível",
        description: "Não há inimigos disponíveis para este tipo de simulado.",
        variant: "destructive",
      });
      return;
    }

    startSimulado(config, gameState.inimigos);
    
    const tipoNames = {
      escaramuca: 'Escaramuça',
      guerra_total: 'Guerra Total',
      operacao_resgate: 'Operação Resgate'
    };
    
    toast({
      title: `${tipoNames[config.tipo]} Iniciada!`,
      description: "Entre no campo de batalha e prove seu valor no Coliseu!",
    });
  };

  const handleSubmitAnswer = (questionId: string, userAnswer?: number) => {
    submitAnswer(questionId, userAnswer);
  };

  const handleFinishSimulado = () => {
    finishSimulado();
    
    if (simuladoState.results) {
      gainXP(simuladoState.results.xp_ganho);
      
      // Update enemy stats for Operação Resgate
      if (simuladoState.config?.tipo === 'operacao_resgate') {
        simuladoState.answers.forEach(answer => {
          const question = simuladoState.questions.find(q => q.id === answer.questionId);
          if (question && answer.isCorrect) {
            updateInimigoStats(question.inimigoId, true);
          }
        });
      }
      
      toast({
        title: "Simulado Concluído!",
        description: `Performance: ${simuladoState.results.taxa_acerto.toFixed(1)}% - +${simuladoState.results.xp_ganho} XP ganho!`,
      });
    }
  };

  // Show Report
  if (simuladoState.showReport && simuladoState.results) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={resetSimulado}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Coliseu
          </Button>
        </div>
        
        <SimuladoReport
          results={simuladoState.results}
          answers={simuladoState.answers}
          questions={simuladoState.questions}
          onRestart={resetSimulado}
        />
      </div>
    );
  }

  // Show Execution
  if (simuladoState.isActive) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={resetSimulado}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Abandonar Simulado
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Tipo: {simuladoState.config?.tipo.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        <SimuladoExecution
          simuladoState={simuladoState}
          onNavigateToQuestion={navigateToQuestion}
          onToggleForReview={toggleQuestionForReview}
          onSubmitAnswer={handleSubmitAnswer}
          onFinishSimulado={handleFinishSimulado}
          getQuestionProgress={getQuestionProgress}
        />
      </div>
    );
  }

  // Show Selection (Default)
  return (
    <div className="space-y-6">
      {onNavigate && (
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onNavigate('agora')}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à Ágora
          </Button>
        </div>
      )}
      
      <SimuladoSelection
        enemies={gameState.inimigos}
        onStartSimulado={handleStartSimulado}
      />
    </div>
  );
};