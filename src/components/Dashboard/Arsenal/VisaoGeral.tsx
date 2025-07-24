import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGameState } from '@/hooks/useGameState';
import { Swords, Target, TrendingUp, Calendar, BarChart3, Trophy } from 'lucide-react';

export const VisaoGeral = () => {
  const { gameState } = useGameState();
  const { inimigos } = gameState;

  // Cálculos estatísticos
  const totalInimigos = inimigos.length;
  const inimigosPorSala = {
    vermelha: inimigos.filter(i => i.sala_atual === 'vermelha').length,
    amarela: inimigos.filter(i => i.sala_atual === 'amarela').length,
    verde: inimigos.filter(i => i.sala_atual === 'verde').length,
  };

  const inimigosPorTipo = {
    objetiva: inimigos.filter(i => i.tipo === 'objetiva').length,
    subjetiva: inimigos.filter(i => i.tipo === 'subjetiva').length,
  };

  // Estatísticas de performance
  const totalTentativas = inimigos.reduce((acc, inimigo) => acc + inimigo.estatisticas.tentativas, 0);
  const totalAcertos = inimigos.reduce((acc, inimigo) => acc + inimigo.estatisticas.acertos, 0);
  const taxaAcertoGeral = totalTentativas > 0 ? (totalAcertos / totalTentativas) * 100 : 0;

  // Matérias únicas e suas performances
  const materias = Array.from(new Set(inimigos.map(i => i.materia)));
  const estatisticasPorMateria = materias.map(materia => {
    const inimigosMateria = inimigos.filter(i => i.materia === materia);
    const tentativasMateria = inimigosMateria.reduce((acc, i) => acc + i.estatisticas.tentativas, 0);
    const acertosMateria = inimigosMateria.reduce((acc, i) => acc + i.estatisticas.acertos, 0);
    const taxaAcerto = tentativasMateria > 0 ? (acertosMateria / tentativasMateria) * 100 : 0;
    
    return {
      materia,
      inimigos: inimigosMateria.length,
      tentativas: tentativasMateria,
      taxaAcerto
    };
  }).sort((a, b) => b.taxaAcerto - a.taxaAcerto);

  // Último inimigo adicionado
  const ultimoInimigo = inimigos.length > 0 ? 
    inimigos.sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())[0] :
    null;

  if (totalInimigos === 0) {
    return (
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="bg-gradient-bronze rounded-full p-6 mb-4 shadow-bronze">
            <BarChart3 className="h-12 w-12 text-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Sem Dados para Análise</h3>
          <p className="text-muted-foreground text-center">
            Forge alguns inimigos para ver estatísticas detalhadas do seu arsenal.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Visão Geral */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Total de Inimigos */}
        <Card className="bg-gradient-fire/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Inimigos</p>
                <p className="text-3xl font-bold text-foreground">{totalInimigos}</p>
              </div>
              <div className="bg-gradient-fire rounded-lg p-3 shadow-warrior">
                <Swords className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Acerto Geral */}
        <Card className="bg-gradient-bronze/10 border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
                <p className="text-3xl font-bold text-foreground">{taxaAcertoGeral.toFixed(1)}%</p>
              </div>
              <div className="bg-gradient-bronze rounded-lg p-3 shadow-bronze">
                <Target className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total de Tentativas */}
        <Card className="bg-gradient-gold/10 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Batalhas</p>
                <p className="text-3xl font-bold text-foreground">{totalTentativas}</p>
              </div>
              <div className="bg-gradient-gold rounded-lg p-3 shadow-gold">
                <TrendingUp className="h-6 w-6 text-background" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matérias Diferentes */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Matérias</p>
                <p className="text-3xl font-bold text-foreground">{materias.length}</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <Trophy className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Distribuição por Salas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribuição por Salas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-room-red text-foreground">
                    Sala Vermelha
                  </Badge>
                </div>
                <span className="font-medium">{inimigosPorSala.vermelha}</span>
              </div>
              <Progress 
                value={(inimigosPorSala.vermelha / totalInimigos) * 100} 
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-room-yellow text-foreground">
                    Sala Amarela
                  </Badge>
                </div>
                <span className="font-medium">{inimigosPorSala.amarela}</span>
              </div>
              <Progress 
                value={(inimigosPorSala.amarela / totalInimigos) * 100} 
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-room-green text-foreground">
                    Sala Verde
                  </Badge>
                </div>
                <span className="font-medium">{inimigosPorSala.verde}</span>
              </div>
              <Progress 
                value={(inimigosPorSala.verde / totalInimigos) * 100} 
                className="h-2"
              />
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              <p>Vermelha: {((inimigosPorSala.vermelha / totalInimigos) * 100).toFixed(1)}%</p>
              <p>Amarela: {((inimigosPorSala.amarela / totalInimigos) * 100).toFixed(1)}%</p>
              <p>Verde: {((inimigosPorSala.verde / totalInimigos) * 100).toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tipos de Questões
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span className="font-medium">Objetivas</span>
                </div>
                <span className="font-medium">{inimigosPorTipo.objetiva}</span>
              </div>
              <Progress 
                value={(inimigosPorTipo.objetiva / totalInimigos) * 100} 
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  <span className="font-medium">Subjetivas</span>
                </div>
                <span className="font-medium">{inimigosPorTipo.subjetiva}</span>
              </div>
              <Progress 
                value={(inimigosPorTipo.subjetiva / totalInimigos) * 100} 
                className="h-2"
              />
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              <p>Objetivas: {((inimigosPorTipo.objetiva / totalInimigos) * 100).toFixed(1)}%</p>
              <p>Subjetivas: {((inimigosPorTipo.subjetiva / totalInimigos) * 100).toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance por Matéria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estatisticasPorMateria.map((stats, index) => (
              <div key={stats.materia} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <h4 className="font-semibold">{stats.materia}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">{stats.inimigos}</span> inimigos
                    </div>
                    <div>
                      <span className="font-medium">{stats.tentativas}</span> tentativas
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{stats.taxaAcerto.toFixed(1)}%</span> acerto
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="w-20">
                    <Progress value={stats.taxaAcerto} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Último Inimigo Adicionado */}
      {ultimoInimigo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Último Inimigo Forjado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h4 className="font-semibold text-lg">{ultimoInimigo.materia}</h4>
                <p className="text-muted-foreground">{ultimoInimigo.tema}</p>
                {ultimoInimigo.subtema && (
                  <p className="text-sm text-muted-foreground">{ultimoInimigo.subtema}</p>
                )}
              </div>
              <div className="text-right">
                <Badge className={
                  ultimoInimigo.sala_atual === 'vermelha' ? 'bg-gradient-room-red text-foreground' :
                  ultimoInimigo.sala_atual === 'amarela' ? 'bg-gradient-room-yellow text-foreground' :
                  'bg-gradient-room-green text-foreground'
                }>
                  {ultimoInimigo.sala_atual}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(ultimoInimigo.data_criacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};