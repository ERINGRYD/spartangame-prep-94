import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BattleAnswer } from '@/hooks/useBattleState';
import { Trophy, Target, Zap, Star, TrendingUp, RotateCcw } from 'lucide-react';

interface BattleReportProps {
  results: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    totalXP: number;
  };
  answers: BattleAnswer[];
  onRestart: () => void;
}

export const BattleReport = ({ results, answers, onRestart }: BattleReportProps) => {
  const getPerformanceMessage = (accuracy: number) => {
    if (accuracy >= 80) return { message: "PERFORMANCE EXCEPCIONAL!", color: "text-yellow-600", icon: Trophy };
    if (accuracy >= 60) return { message: "BOA PERFORMANCE!", color: "text-green-600", icon: Target };
    if (accuracy >= 40) return { message: "PERFORMANCE REGULAR", color: "text-orange-600", icon: Zap };
    return { message: "PRECISA MELHORAR", color: "text-red-600", icon: Star };
  };

  const performance = getPerformanceMessage(results.accuracy);
  const PerformanceIcon = performance.icon;

  const confidenceStats = answers.reduce((acc, answer) => {
    if (answer.confidence) {
      acc[answer.confidence] = (acc[answer.confidence] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const selfAssessmentStats = answers.reduce((acc, answer) => {
    if (answer.selfAssessment) {
      acc[answer.selfAssessment] = (acc[answer.selfAssessment] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className={`flex items-center justify-center gap-3 ${performance.color}`}>
          <PerformanceIcon className="h-12 w-12" />
          <h1 className="text-4xl font-bold">BATALHA CONCLUÍDA</h1>
        </div>
        <p className={`text-2xl font-semibold ${performance.color}`}>
          {performance.message}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Questões Corretas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {results.correctAnswers}/{results.totalQuestions}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Taxa de Acerto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{results.accuracy.toFixed(1)}%</div>
              <Progress value={results.accuracy} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-gold/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">XP Total Ganho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              +{results.totalXP}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">XP Médio/Questão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {results.totalQuestions > 0 ? Math.round(results.totalXP / results.totalQuestions) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Confidence Analysis */}
        {Object.keys(confidenceStats).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Análise de Confiança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(confidenceStats).map(([confidence, count]) => (
                <div key={confidence} className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {confidence}
                  </Badge>
                  <span className="font-semibold">{count} questões</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Self Assessment Analysis */}
        {Object.keys(selfAssessmentStats).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Autoavaliação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(selfAssessmentStats).map(([assessment, count]) => (
                <div key={assessment} className="flex items-center justify-between">
                  <Badge 
                    variant={assessment === 'erro' ? 'destructive' : assessment === 'facil' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {assessment}
                  </Badge>
                  <span className="font-semibold">{count} questões</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommendations */}
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recomendações Estratégicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {results.accuracy >= 80 && (
            <p className="text-green-600 font-semibold">
              • Excelente performance! Continue mantendo este nível de estudo.
            </p>
          )}
          {results.accuracy < 60 && (
            <p className="text-orange-600 font-semibold">
              • Foque mais tempo nos temas que apresentaram dificuldades.
            </p>
          )}
          {Object.values(confidenceStats).some(count => count > 0) && (
            <p className="text-blue-600 font-semibold">
              • Trabalhe na calibração da sua confiança com a performance real.
            </p>
          )}
          <p className="text-muted-foreground">
            • Revise os inimigos que mudaram de sala para otimizar seu próximo combate.
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center">
        <Button
          onClick={onRestart}
          variant="epic"
          size="epic"
          className="flex items-center gap-3"
        >
          <RotateCcw className="h-6 w-6" />
          NOVA BATALHA
        </Button>
      </div>
    </div>
  );
};