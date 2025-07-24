import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { SimuladoResults, SimuladoAnswer, SimuladoQuestion } from '@/hooks/useSimuladoState';
import { 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  BookMarked, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Flame,
  Medal,
  Swords
} from 'lucide-react';

interface SimuladoReportProps {
  results: SimuladoResults;
  answers: SimuladoAnswer[];
  questions: SimuladoQuestion[];
  onRestart: () => void;
}

export const SimuladoReport = ({ 
  results, 
  answers, 
  questions, 
  onRestart 
}: SimuladoReportProps) => {
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getPerformanceLevel = (taxa: number) => {
    if (taxa >= 90) return { level: 'Gladiador Lendário', color: 'text-yellow-600', icon: Medal };
    if (taxa >= 80) return { level: 'Gladiador Veterano', color: 'text-purple-600', icon: Trophy };
    if (taxa >= 70) return { level: 'Guerreiro Habilidoso', color: 'text-blue-600', icon: Swords };
    if (taxa >= 60) return { level: 'Soldado Competente', color: 'text-green-600', icon: Target };
    return { level: 'Recruta em Treinamento', color: 'text-gray-600', icon: Star };
  };

  const performance = getPerformanceLevel(results.taxa_acerto);
  const PerformanceIcon = performance.icon;

  const tipoNames = {
    escaramuca: 'Escaramuça',
    guerra_total: 'Guerra Total',
    operacao_resgate: 'Operação Resgate'
  };

  const markedQuestions = questions.filter(q => results.questoes_marcadas.includes(q.id));

  return (
    <div className="space-y-8">
      {/* Header - Victory Celebration */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 rounded-full bg-gradient-fire animate-pulse">
            <PerformanceIcon className="h-12 w-12 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-fire bg-clip-text text-transparent">
            Combate Concluído!
          </h1>
          <p className={`text-xl font-semibold ${performance.color}`}>
            {performance.level}
          </p>
          <p className="text-muted-foreground">
            {tipoNames[results.tipo]} • {new Date(results.data_conclusao).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-700 dark:text-green-400">
              {results.questoes_corretas}
            </p>
            <p className="text-sm text-green-600 dark:text-green-500">Acertos</p>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {results.taxa_acerto.toFixed(1)}%
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-500">Precisão</p>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              {formatTime(results.tempo_total)}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-500">Tempo Total</p>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <Flame className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
              +{results.xp_ganho}
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-500">XP Ganho</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Subject */}
      {Object.keys(results.performance_por_materia).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance por Matéria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(results.performance_por_materia).map(([materia, stats]) => (
              <div key={materia} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{materia}</span>
                  <Badge variant={stats.taxa >= 70 ? "default" : "secondary"}>
                    {stats.corretas}/{stats.totais} ({stats.taxa.toFixed(1)}%)
                  </Badge>
                </div>
                <Progress value={stats.taxa} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Time Comparison */}
      {results.tempo_previsto > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Análise de Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Previsto</p>
                <p className="text-2xl font-bold">{formatTime(results.tempo_previsto)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempo Real</p>
                <p className="text-2xl font-bold">{formatTime(results.tempo_total)}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-center">
              {results.tempo_total < results.tempo_previsto ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  ⚡ Completou {formatTime(results.tempo_previsto - results.tempo_total)} mais rápido!
                </Badge>
              ) : (
                <Badge variant="secondary">
                  🕒 Levou {formatTime(results.tempo_total - results.tempo_previsto)} a mais
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Marked Questions for Review */}
      {markedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5" />
              Questões Marcadas para Revisão ({markedQuestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {markedQuestions.slice(0, 5).map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id);
              return (
                <div key={question.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  {answer?.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Questão {questions.indexOf(question) + 1}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {question.enunciado || question.front}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {markedQuestions.length > 5 && (
              <p className="text-sm text-muted-foreground text-center">
                +{markedQuestions.length - 5} questões adicionais marcadas
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Strategic Recommendations */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recomendações Estratégicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3">
            {results.taxa_acerto < 60 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-400">
                  🎯 <strong>Foco no Treinamento:</strong> Performance abaixo do ideal. Concentre-se em revisar os conceitos básicos.
                </p>
              </div>
            )}
            
            {results.taxa_acerto >= 60 && results.taxa_acerto < 80 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  📈 <strong>Progresso Sólido:</strong> Continue praticando para alcançar excelência. Foque nas matérias com menor performance.
                </p>
              </div>
            )}
            
            {results.taxa_acerto >= 80 && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-400">
                  🏆 <strong>Excelente Performance:</strong> Você está dominando o conteúdo! Mantenha a consistência.
                </p>
              </div>
            )}
            
            {markedQuestions.length > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  📚 <strong>Revisão Focada:</strong> Você marcou {markedQuestions.length} questões. Revise-as no Arsenal.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={onRestart}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Swords className="h-4 w-4" />
          Novo Combate
        </Button>
      </div>
    </div>
  );
};