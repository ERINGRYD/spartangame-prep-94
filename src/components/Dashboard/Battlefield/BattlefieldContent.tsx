import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnemySelection } from './EnemySelection';
import { BattleArena } from './BattleArena';
import { BattleReport } from './BattleReport';
import { BattleHistory } from './BattleHistory';
import { useBattleState } from '@/hooks/useBattleState';
import { useGameState } from '@/hooks/useGameState';
import { ArrowLeft, Swords, History } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BattlefieldContentProps {
  onNavigate?: (tab: string) => void;
}

export const BattlefieldContent = ({ onNavigate }: BattlefieldContentProps) => {
  const { gameState, gainXP, updateInimigoStats, addQuestaoResolvida } = useGameState();
  const {
    battleState,
    startBattle,
    submitAnswer,
    nextQuestion,
    resetBattle,
    calculateResults
  } = useBattleState();
  
  const [activeTab, setActiveTab] = useState('battle');

  const handleStartBattle = (selectedEnemies: any[]) => {
    if (selectedEnemies.length === 0) {
      toast({
        title: "Nenhum inimigo selecionado",
        description: "Selecione pelo menos um inimigo para iniciar a batalha.",
        variant: "destructive",
      });
      return;
    }

    startBattle(selectedEnemies);
    toast({
      title: "Batalha Iniciada!",
      description: `Enfrentando ${selectedEnemies.length} inimigo(s) em combate épico!`,
    });
  };

  const handleSubmitAnswer = (answer: any) => {
    submitAnswer(answer);
    
    // Gain XP
    gainXP(answer.xpGained || 0);
    
    // Update enemy stats
    const question = battleState.questions[battleState.currentQuestionIndex];
    updateInimigoStats(question.inimigoId, answer.isCorrect);
    
    // Track question completed
    addQuestaoResolvida();

    // Show result toast
    toast({
      title: answer.isCorrect ? "Vitória!" : "Derrota!",
      description: `${answer.isCorrect ? 'Acertou' : 'Errou'} a questão. +${answer.xpGained || 0} XP ganho!`,
      variant: answer.isCorrect ? "default" : "destructive",
    });
  };

  const handleBattleComplete = () => {
    const results = calculateResults();
    toast({
      title: "Batalha Concluída!",
      description: `${results.correctAnswers}/${results.totalQuestions} questões corretas. +${results.totalXP} XP total!`,
    });
  };

  useEffect(() => {
    if (battleState.isComplete) {
      handleBattleComplete();
    }
  }, [battleState.isComplete]);

  const currentQuestion = battleState.questions[battleState.currentQuestionIndex];
  const lastAnswer = battleState.answers[battleState.answers.length - 1];

  // Battle Report View
  if (battleState.showReport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={resetBattle}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à Seleção
          </Button>
        </div>
        
        <BattleReport
          results={calculateResults()}
          answers={battleState.answers}
          onRestart={resetBattle}
        />
      </div>
    );
  }

  // Battle Arena View
  if (battleState.isActive && currentQuestion) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={resetBattle}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Abandonar Batalha
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Inimigos: {battleState.selectedEnemies.map(e => e.materia).join(', ')}
          </div>
        </div>

        <BattleArena
          question={currentQuestion}
          questionIndex={battleState.currentQuestionIndex}
          totalQuestions={battleState.questions.length}
          onSubmitAnswer={handleSubmitAnswer}
          showResult={battleState.showResult}
          lastAnswer={lastAnswer}
          onNextQuestion={nextQuestion}
        />
      </div>
    );
  }

  // Main Battlefield View with Tabs (Default)
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="battle" className="flex items-center gap-2">
            <Swords className="h-4 w-4" />
            Campo de Batalha
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="battle" className="mt-6">
          <EnemySelection
            enemies={gameState.inimigos}
            onStartBattle={handleStartBattle}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <BattleHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};