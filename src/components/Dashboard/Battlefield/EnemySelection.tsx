import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Inimigo } from '@/hooks/useGameState';
import { Sword, Shield, Zap } from 'lucide-react';

interface EnemySelectionProps {
  enemies: Inimigo[];
  onStartBattle: (selectedEnemies: Inimigo[]) => void;
}

export const EnemySelection = ({ enemies, onStartBattle }: EnemySelectionProps) => {
  const [selectedEnemies, setSelectedEnemies] = useState<string[]>([]);
  const [roomFilter, setRoomFilter] = useState<'all' | 'vermelha' | 'amarela' | 'verde'>('all');

  const filteredEnemies = enemies.filter(enemy => 
    roomFilter === 'all' || enemy.sala_atual === roomFilter
  );

  const handleEnemyToggle = (enemyId: string) => {
    setSelectedEnemies(prev => {
      if (prev.includes(enemyId)) {
        return prev.filter(id => id !== enemyId);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, enemyId];
    });
  };

  const handleStartBattle = () => {
    const selected = enemies.filter(enemy => selectedEnemies.includes(enemy.id));
    onStartBattle(selected);
  };

  const getRoomIcon = (sala: string) => {
    switch (sala) {
      case 'vermelha': return <Sword className="h-4 w-4" />;
      case 'amarela': return <Shield className="h-4 w-4" />;
      case 'verde': return <Zap className="h-4 w-4" />;
      default: return null;
    }
  };

  const getRoomVariant = (sala: string) => {
    switch (sala) {
      case 'vermelha': return 'destructive';
      case 'amarela': return 'secondary';
      case 'verde': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-fire bg-clip-text text-transparent">
          CAMPO DE BATALHA
        </h1>
        <p className="text-lg text-muted-foreground">
          Selecione até 5 inimigos para enfrentar em combate
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">
            Selecionados: {selectedEnemies.length}/5
          </span>
          <Badge variant="outline" className="border-primary text-primary">
            {filteredEnemies.length} inimigos disponíveis
          </Badge>
        </div>
      </div>

      <Tabs value={roomFilter} onValueChange={(value) => setRoomFilter(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas as Salas</TabsTrigger>
          <TabsTrigger value="vermelha" className="data-[state=active]:bg-gradient-room-red">
            Vermelha
          </TabsTrigger>
          <TabsTrigger value="amarela" className="data-[state=active]:bg-gradient-room-yellow">
            Amarela
          </TabsTrigger>
          <TabsTrigger value="verde" className="data-[state=active]:bg-gradient-room-green">
            Verde
          </TabsTrigger>
        </TabsList>

        <TabsContent value={roomFilter} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnemies.map((enemy) => (
              <Card 
                key={enemy.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-warrior hover:scale-105 ${
                  selectedEnemies.includes(enemy.id) 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleEnemyToggle(enemy.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Checkbox 
                      checked={selectedEnemies.includes(enemy.id)}
                      onChange={() => handleEnemyToggle(enemy.id)}
                      className="data-[state=checked]:bg-primary"
                    />
                    <Badge 
                      variant={getRoomVariant(enemy.sala_atual) as any}
                      className="flex items-center gap-1"
                    >
                      {getRoomIcon(enemy.sala_atual)}
                      {enemy.sala_atual}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {enemy.materia}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {enemy.tema}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <p className="font-semibold">{enemy.estatisticas.taxa_acerto.toFixed(0)}%</p>
                      <p className="text-muted-foreground">Acertos</p>
                    </div>
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <p className="font-semibold">{enemy.estatisticas.tentativas}</p>
                      <p className="text-muted-foreground">Tentativas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedEnemies.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={handleStartBattle}
            variant="epic"
            size="epic"
            className="animate-pulse hover:animate-none"
          >
            <Sword className="h-6 w-6 mr-2" />
            INICIAR BATALHA
            <Sword className="h-6 w-6 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};