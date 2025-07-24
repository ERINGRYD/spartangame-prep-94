import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, Zap, Calendar, TrendingUp, Users } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

const mockXPData = [
  { day: 'Seg', xp: 120 },
  { day: 'Ter', xp: 250 },
  { day: 'Qua', xp: 180 },
  { day: 'Qui', xp: 320 },
  { day: 'Sex', xp: 290 },
  { day: 'Sáb', xp: 410 },
  { day: 'Dom', xp: 180 },
];

const ROOM_COLORS = {
  vermelha: '#ef4444',
  amarela: '#eab308', 
  verde: '#22c55e'
};

export const CampaignReport = () => {
  const { gameState } = useGameState();

  if (!gameState.guerreiro) return null;

  const { guerreiro, inimigos } = gameState;

  // Cálculo das estatísticas gerais
  const totalTentativas = inimigos.reduce((acc, inimigo) => acc + inimigo.estatisticas.tentativas, 0);
  const totalAcertos = inimigos.reduce((acc, inimigo) => acc + inimigo.estatisticas.acertos, 0);
  const taxaAcertoGeral = totalTentativas > 0 ? (totalAcertos / totalTentativas) * 100 : 0;

  // Distribuição de inimigos por sala
  const roomDistribution = [
    { name: 'Vermelha', value: inimigos.filter(i => i.sala_atual === 'vermelha').length, color: ROOM_COLORS.vermelha },
    { name: 'Amarela', value: inimigos.filter(i => i.sala_atual === 'amarela').length, color: ROOM_COLORS.amarela },
    { name: 'Verde', value: inimigos.filter(i => i.sala_atual === 'verde').length, color: ROOM_COLORS.verde },
  ].filter(room => room.value > 0);

  const xpProgress = (guerreiro.xp_atual / guerreiro.xp_proximo_nivel) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Perfil do Guerreiro */}
      <Card className="lg:col-span-1 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-epic">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
            <Trophy className="h-8 w-8 text-background" />
          </div>
          <CardTitle className="text-2xl text-foreground">{guerreiro.nome}</CardTitle>
          <Badge variant="secondary" className="bg-gradient-bronze">
            Nível {guerreiro.nivel}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Experiência</span>
              <span className="text-foreground font-semibold">
                {guerreiro.xp_atual.toLocaleString()} XP
              </span>
            </div>
            <Progress value={xpProgress} variant="xp" className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              {(guerreiro.xp_proximo_nivel - guerreiro.xp_atual).toLocaleString()} XP para próximo nível
            </p>
          </div>

          {/* Estatísticas Principais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-background/20 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {guerreiro.estatisticas.questoes_resolvidas}
              </div>
              <div className="text-xs text-muted-foreground">Questões</div>
            </div>
            <div className="text-center p-3 bg-background/20 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {taxaAcertoGeral.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Taxa Acerto</div>
            </div>
            <div className="text-center p-3 bg-background/20 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {guerreiro.sequencia_dias}
              </div>
              <div className="text-xs text-muted-foreground">Dias Consecutivos</div>
            </div>
            <div className="text-center p-3 bg-background/20 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {guerreiro.energia}
              </div>
              <div className="text-xs text-muted-foreground">Energia</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Evolução XP */}
      <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Evolução do XP - Últimos 7 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockXPData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
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
              />
              <Line 
                type="monotone" 
                dataKey="xp" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribuição de Inimigos */}
      <Card className="lg:col-span-1 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-secondary" />
            Distribuição por Sala
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roomDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {roomDistribution.map((room) => (
              <div key={room.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: room.color }}
                  />
                  <span className="text-sm text-foreground">{room.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {room.value} inimigos
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Consistência */}
      <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Métricas de Consistência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-6">
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">
                  {guerreiro.sequencia_dias}
                </div>
                <div className="text-sm text-muted-foreground">Dias Consecutivos</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Recorde: {Math.max(guerreiro.sequencia_dias, 15)} dias
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg p-6">
                <Target className="h-8 w-8 text-secondary mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">5</div>
                <div className="text-sm text-muted-foreground">Sessões/Semana</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Meta: 7 sessões
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg p-6">
                <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">
                  {Math.floor(guerreiro.estatisticas.tempo_total_estudo / 60)} h
                </div>
                <div className="text-sm text-muted-foreground">Tempo Total</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Esta semana: 12h
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};