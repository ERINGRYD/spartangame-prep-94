import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

export const SubjectBreakdown = () => {
  const { gameState } = useGameState();

  if (!gameState.guerreiro) return null;

  const { inimigos } = gameState;

  // Agrupa estatísticas por matéria
  const subjectStats = inimigos.reduce((acc, inimigo) => {
    const materia = inimigo.materia;
    if (!acc[materia]) {
      acc[materia] = {
        name: materia,
        tentativas: 0,
        acertos: 0,
        taxa_acerto: 0,
        questoes_resolvidas: 0,
        inimigos_count: 0,
        sala_distribution: { vermelha: 0, amarela: 0, verde: 0 }
      };
    }
    
    acc[materia].tentativas += inimigo.estatisticas.tentativas;
    acc[materia].acertos += inimigo.estatisticas.acertos;
    acc[materia].questoes_resolvidas += inimigo.questoes.length;
    acc[materia].inimigos_count += 1;
    acc[materia].sala_distribution[inimigo.sala_atual] += 1;
    acc[materia].taxa_acerto = acc[materia].tentativas > 0 
      ? (acc[materia].acertos / acc[materia].tentativas) * 100 
      : 0;
    
    return acc;
  }, {} as Record<string, any>);

  const subjects = Object.values(subjectStats).sort((a: any, b: any) => b.taxa_acerto - a.taxa_acerto);

  // Dados para o gráfico
  const chartData = subjects.map((subject: any) => ({
    name: subject.name.length > 15 ? subject.name.substring(0, 15) + '...' : subject.name,
    acertos: subject.acertos,
    tentativas: subject.tentativas,
    taxa: subject.taxa_acerto
  }));

  const getPerformanceIcon = (taxa: number) => {
    if (taxa >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (taxa >= 60) return <Target className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getPerformanceLabel = (taxa: number) => {
    if (taxa >= 80) return "Excelente";
    if (taxa >= 60) return "Bom";
    if (taxa >= 40) return "Regular";
    return "Precisa melhorar";
  };

  const getPerformanceBadge = (taxa: number) => {
    if (taxa >= 80) return "default";
    if (taxa >= 60) return "secondary";
    return "destructive";
  };

  const getSalaColor = (sala: string) => {
    switch (sala) {
      case 'vermelha': return 'bg-red-500/20 text-red-700';
      case 'amarela': return 'bg-yellow-500/20 text-yellow-700';
      case 'verde': return 'bg-green-500/20 text-green-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Performance por Matéria */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Performance por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => {
                  if (name === 'acertos') return [value, 'Acertos'];
                  if (name === 'tentativas') return [value, 'Tentativas'];
                  if (name === 'taxa') return [`${Number(value).toFixed(1)}%`, 'Taxa de Acerto'];
                  return [value, name];
                }}
              />
              <Bar dataKey="acertos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tentativas" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lista Detalhada de Matérias */}
      <div className="grid gap-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-gold" />
          Ranking de Performance
        </h3>
        
        {subjects.map((subject: any, index) => (
          <Card key={subject.name} className="bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-bronze text-background font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{subject.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {subject.inimigos_count} inimigo{subject.inimigos_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getPerformanceIcon(subject.taxa_acerto)}
                  <Badge variant={getPerformanceBadge(subject.taxa_acerto)}>
                    {getPerformanceLabel(subject.taxa_acerto)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Taxa de Acerto */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de Acerto</span>
                    <span className="font-semibold text-foreground">
                      {subject.taxa_acerto.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={subject.taxa_acerto} 
                    variant={subject.taxa_acerto >= 80 ? "default" : subject.taxa_acerto >= 60 ? "energy" : "energy"}
                    className="h-2" 
                  />
                  <p className="text-xs text-muted-foreground">
                    {subject.acertos} acertos em {subject.tentativas} tentativas
                  </p>
                </div>

                {/* Distribuição por Salas */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Distribuição</span>
                  <div className="flex gap-1">
                    {subject.sala_distribution.vermelha > 0 && (
                      <Badge className="bg-gradient-room-red text-xs">
                        {subject.sala_distribution.vermelha} V
                      </Badge>
                    )}
                    {subject.sala_distribution.amarela > 0 && (
                      <Badge className="bg-gradient-room-yellow text-xs">
                        {subject.sala_distribution.amarela} A
                      </Badge>
                    )}
                    {subject.sala_distribution.verde > 0 && (
                      <Badge className="bg-gradient-room-green text-xs">
                        {subject.sala_distribution.verde} G
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Recomendação */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Recomendação</span>
                  <div className="text-xs text-foreground">
                    {subject.taxa_acerto < 60 ? (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        Foco prioritário
                      </div>
                    ) : subject.taxa_acerto < 80 ? (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Target className="h-3 w-3" />
                        Revisar conceitos
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600">
                        <Award className="h-3 w-3" />
                        Manter ritmo
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Análise de Pontos Fortes e Fracos */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-5 w-5" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjects
                .filter((s: any) => s.taxa_acerto >= 70)
                .slice(0, 3)
                .map((subject: any) => (
                  <div key={subject.name} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{subject.name}</span>
                    <Badge variant="outline" className="border-green-500/30 text-green-700">
                      {subject.taxa_acerto.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              {subjects.filter((s: any) => s.taxa_acerto >= 70).length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Continue praticando para desenvolver seus pontos fortes!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Pontos Fracos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjects
                .filter((s: any) => s.taxa_acerto < 60)
                .slice(0, 3)
                .map((subject: any) => (
                  <div key={subject.name} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{subject.name}</span>
                    <Badge variant="outline" className="border-red-500/30 text-red-700">
                      {subject.taxa_acerto.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              {subjects.filter((s: any) => s.taxa_acerto < 60).length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Parabéns! Você não tem pontos fracos identificados.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};