import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SimuladoState } from '@/hooks/useSimuladoState';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  BookMarked, 
  CheckCircle, 
  Circle,
  Timer,
  Target
} from 'lucide-react';

interface SimuladoExecutionProps {
  simuladoState: SimuladoState;
  onNavigateToQuestion: (index: number) => void;
  onToggleForReview: (questionId: string) => void;
  onSubmitAnswer: (questionId: string, userAnswer?: number) => void;
  onFinishSimulado: () => void;
  getQuestionProgress: () => { answered: number; total: number; marked: number; remaining: number };
}

export const SimuladoExecution = ({
  simuladoState,
  onNavigateToQuestion,
  onToggleForReview,
  onSubmitAnswer,
  onFinishSimulado,
  getQuestionProgress
}: SimuladoExecutionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  
  const currentQuestion = simuladoState.questions[simuladoState.currentQuestionIndex];
  const progress = getQuestionProgress();
  const currentAnswer = simuladoState.answers.find(a => a.questionId === currentQuestion?.id);
  
  // Timer formatting
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSubmit = () => {
    if (!currentQuestion) return;
    
    if (currentQuestion.type === 'objective') {
      onSubmitAnswer(currentQuestion.id, selectedAnswer);
    } else {
      // For subjective questions, just mark as answered
      onSubmitAnswer(currentQuestion.id);
    }
    
    setSelectedAnswer(undefined);
  };

  const handleNextQuestion = () => {
    if (simuladoState.currentQuestionIndex < simuladoState.questions.length - 1) {
      onNavigateToQuestion(simuladoState.currentQuestionIndex + 1);
      setSelectedAnswer(currentAnswer?.userAnswer);
    }
  };

  const handlePrevQuestion = () => {
    if (simuladoState.currentQuestionIndex > 0) {
      onNavigateToQuestion(simuladoState.currentQuestionIndex - 1);
      const prevAnswer = simuladoState.answers.find(a => 
        a.questionId === simuladoState.questions[simuladoState.currentQuestionIndex - 1]?.id
      );
      setSelectedAnswer(prevAnswer?.userAnswer);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      {/* Header with Timer and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Timer className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Tempo decorrido</p>
                <p className="text-2xl font-bold text-primary">
                  {formatTime(simuladoState.timeSpent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Progresso</p>
                <Progress 
                  value={(progress.answered / progress.total) * 100} 
                  className="h-2 mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {progress.answered}/{progress.total} questões
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookMarked className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Marcadas</p>
                <p className="text-2xl font-bold">{progress.marked}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Navegação Rápida</h3>
            <Badge variant="outline">
              Questão {simuladoState.currentQuestionIndex + 1} de {simuladoState.questions.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-10 gap-2">
            {simuladoState.questions.map((q, index) => {
              const isAnswered = simuladoState.answers.some(a => a.questionId === q.id);
              const isMarked = simuladoState.markedForReview.has(q.id);
              const isCurrent = index === simuladoState.currentQuestionIndex;
              
              return (
                <Button
                  key={q.id}
                  variant={isCurrent ? "default" : "outline"}
                  size="sm"
                  className={`h-10 relative ${
                    isAnswered ? 'bg-green-100 hover:bg-green-200 border-green-300' : ''
                  }`}
                  onClick={() => onNavigateToQuestion(index)}
                >
                  {index + 1}
                  {isAnswered && (
                    <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />
                  )}
                  {isMarked && (
                    <BookMarked className="absolute -bottom-1 -right-1 h-3 w-3 text-yellow-600" />
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Question */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Questão {simuladoState.currentQuestionIndex + 1}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleForReview(currentQuestion.id)}
              className={currentQuestion.marcada_revisao ? 'bg-yellow-100' : ''}
            >
              <BookMarked className="h-4 w-4" />
              {currentQuestion.marcada_revisao ? 'Marcada' : 'Marcar'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestion.type === 'objective' ? (
            <>
              <p className="text-lg leading-relaxed">{currentQuestion.enunciado}</p>
              
              <RadioGroup 
                value={selectedAnswer?.toString() || currentAnswer?.userAnswer?.toString()} 
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              >
                {currentQuestion.alternativas?.map((alternativa, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
                      {String.fromCharCode(65 + index)}) {alternativa}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Questão:</h4>
                <p className="text-lg">{currentQuestion.front}</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium mb-2 text-green-800 dark:text-green-300">Resposta:</h4>
                <p className="text-green-700 dark:text-green-400">{currentQuestion.back}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={simuladoState.currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-3">
              {!currentQuestion.respondida && (
                <Button onClick={handleAnswerSubmit}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Responder
                </Button>
              )}
              
              {simuladoState.currentQuestionIndex < simuladoState.questions.length - 1 ? (
                <Button variant="outline" onClick={handleNextQuestion}>
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={onFinishSimulado}
                  className="bg-gradient-fire hover:opacity-90"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Finalizar Simulado
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};