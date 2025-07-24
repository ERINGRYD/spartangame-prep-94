import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Question, BattleAnswer } from '@/hooks/useBattleState';
import { Check, X, Eye, EyeOff, Zap, Star, Target, AlertTriangle, Brain, Focus, BookOpen, HelpCircle } from 'lucide-react';

interface BattleArenaProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onSubmitAnswer: (answer: Omit<BattleAnswer, 'xpGained'>) => void;
  showResult: boolean;
  lastAnswer?: BattleAnswer;
  onNextQuestion: () => void;
}

export const BattleArena = ({
  question,
  questionIndex,
  totalQuestions,
  onSubmitAnswer,
  showResult,
  lastAnswer,
  onNextQuestion
}: BattleArenaProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<'certeza' | 'duvida' | 'chute' | null>(null);
  const [selfAssessment, setSelfAssessment] = useState<'facil' | 'dificil' | 'erro' | null>(null);
  const [errorReason, setErrorReason] = useState<'conteudo' | 'distracao' | 'interpretacao' | 'indefinido' | null>(null);
  const [showBack, setShowBack] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  const handleObjectiveAnswer = () => {
    if (selectedAnswer === null || confidence === null) return;

    const isCorrect = selectedAnswer === question.resposta_correta;
    
    if (!isCorrect) {
      setShowErrorDialog(true);
      return;
    }

    const answer: Omit<BattleAnswer, 'xpGained'> = {
      questionId: question.id,
      userAnswer: selectedAnswer,
      confidence,
      isCorrect,
    };

    onSubmitAnswer(answer);
    setHasAnswered(true);
  };

  const handleSubmitWithError = () => {
    if (selectedAnswer === null || confidence === null || errorReason === null) return;

    const answer: Omit<BattleAnswer, 'xpGained'> = {
      questionId: question.id,
      userAnswer: selectedAnswer,
      confidence,
      errorReason,
      isCorrect: false,
    };

    onSubmitAnswer(answer);
    setHasAnswered(true);
    setShowErrorDialog(false);
  };

  const handleSubjectiveAnswer = () => {
    if (selfAssessment === null) return;

    const scoreMap = { facil: 85, dificil: 60, erro: 20 };
    const isCorrect = scoreMap[selfAssessment] >= 60;

    const answer: Omit<BattleAnswer, 'xpGained'> = {
      questionId: question.id,
      selfAssessment,
      isCorrect,
    };

    onSubmitAnswer(answer);
    setHasAnswered(true);
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setConfidence(null);
    setSelfAssessment(null);
    setErrorReason(null);
    setShowBack(false);
    setHasAnswered(false);
    setShowErrorDialog(false);
  };

  const handleNext = () => {
    resetQuestion();
    onNextQuestion();
  };

  const getConfidenceIcon = (conf: string) => {
    switch (conf) {
      case 'certeza': return <Target className="h-4 w-4" />;
      case 'duvida': return <Star className="h-4 w-4" />;
      case 'chute': return <Zap className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Questão {questionIndex + 1} de {totalQuestions}
          </Badge>
          <Badge variant="secondary">
            {question.type === 'objective' ? 'Objetiva' : 'Subjetiva'}
          </Badge>
        </div>
        
        <Progress value={progress} className="h-3 bg-muted">
          <div className="h-full bg-gradient-fire rounded-full transition-all duration-500" />
        </Progress>
      </div>

      {/* Question Content */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {question.type === 'objective' ? question.enunciado : question.front}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {question.type === 'objective' ? (
            <>
              {/* Objective Question */}
              <div className="space-y-3">
                {question.alternativas?.map((alt, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => !hasAnswered && setSelectedAnswer(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                        selectedAnswer === index
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground text-muted-foreground'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{alt}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Confidence Selection */}
              {selectedAnswer !== null && !hasAnswered && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-center">Qual seu nível de confiança?</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'certeza', label: 'Certeza', variant: 'default' },
                      { key: 'duvida', label: 'Dúvida', variant: 'secondary' },
                      { key: 'chute', label: 'Chute', variant: 'outline' }
                    ].map(({ key, label, variant }) => (
                      <Button
                        key={key}
                        variant={confidence === key ? 'default' : variant as any}
                        onClick={() => setConfidence(key as any)}
                        className="flex items-center gap-2"
                      >
                        {getConfidenceIcon(key)}
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnswer !== null && confidence !== null && !showResult && (
                <Button 
                  onClick={handleObjectiveAnswer}
                  variant="epic"
                  size="lg"
                  className="w-full"
                >
                  CONFIRMAR RESPOSTA
                </Button>
              )}
            </>
          ) : (
            <>
              {/* Subjective Question */}
              {!showBack ? (
                <div className="text-center space-y-6">
                  <p className="text-lg text-muted-foreground">
                    Pense na resposta e clique para revelar a explicação
                  </p>
                  <Button
                    onClick={() => setShowBack(true)}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-5 w-5" />
                    VER RESPOSTA
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-muted/30 rounded-lg border-l-4 border-primary">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <EyeOff className="h-4 w-4" />
                      Resposta:
                    </h4>
                    <p className="leading-relaxed">{question.back}</p>
                  </div>

                  {/* Self Assessment */}
                  {!hasAnswered && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-center">Como você avalia sua resposta?</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { key: 'facil', label: 'Fácil (85%)', variant: 'default' },
                          { key: 'dificil', label: 'Difícil (60%)', variant: 'secondary' },
                          { key: 'erro', label: 'Erro (20%)', variant: 'destructive' }
                        ].map(({ key, label, variant }) => (
                          <Button
                            key={key}
                            variant={selfAssessment === key ? 'default' : variant as any}
                            onClick={() => setSelfAssessment(key as any)}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selfAssessment !== null && !showResult && (
                    <Button 
                      onClick={handleSubjectiveAnswer}
                      variant="epic"
                      size="lg"
                      className="w-full"
                    >
                      CONFIRMAR AVALIAÇÃO
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Battle Result */}
      {showResult && lastAnswer && (
        <Card className={`border-2 animate-scale-in ${
          lastAnswer.isCorrect 
            ? 'border-green-500 bg-green-500/10' 
            : 'border-red-500 bg-red-500/10'
        }`}>
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center">
              {lastAnswer.isCorrect ? (
                <div className="flex items-center gap-3 text-green-600">
                  <Check className="h-8 w-8" />
                  <span className="text-2xl font-bold">VITÓRIA!</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-red-600">
                  <X className="h-8 w-8" />
                  <span className="text-2xl font-bold">DERROTA!</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                +{lastAnswer.xpGained} XP
              </Badge>
              {lastAnswer.confidence && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  {getConfidenceIcon(lastAnswer.confidence)}
                  {lastAnswer.confidence}
                </Badge>
              )}
              {lastAnswer.selfAssessment && (
                <Badge variant="secondary">
                  {lastAnswer.selfAssessment}
                </Badge>
              )}
            </div>

            <Button
              onClick={handleNext}
              variant="epic"
              size="lg"
              className="w-full"
            >
              {questionIndex + 1 < totalQuestions ? 'PRÓXIMA QUESTÃO' : 'VER RELATÓRIO'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Reason Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Por que errou a questão?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Identificar o motivo do erro ajuda a melhorar seu desempenho:
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                { 
                  key: 'conteudo', 
                  label: 'CONTEÚDO', 
                  icon: BookOpen, 
                  desc: 'Não domino o assunto'
                },
                { 
                  key: 'distracao', 
                  label: 'DISTRAÇÃO', 
                  icon: Focus, 
                  desc: 'Falta de concentração'
                },
                { 
                  key: 'interpretacao', 
                  label: 'INTERPRETAÇÃO', 
                  icon: Brain, 
                  desc: 'Não entendi a pergunta'
                },
                { 
                  key: 'indefinido', 
                  label: 'INDEFINIDO', 
                  icon: HelpCircle, 
                  desc: 'Não sei o motivo'
                }
              ].map(({ key, label, icon: Icon, desc }) => (
                <Button
                  key={key}
                  variant={errorReason === key ? 'default' : 'outline'}
                  onClick={() => setErrorReason(key as any)}
                  className="flex items-center gap-3 h-auto p-4 justify-start"
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            {errorReason && (
              <Button 
                onClick={handleSubmitWithError}
                variant="epic"
                size="lg"
                className="w-full"
              >
                CONFIRMAR
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};