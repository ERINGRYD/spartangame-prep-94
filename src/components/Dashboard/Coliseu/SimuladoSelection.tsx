import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Inimigo } from '@/hooks/useGameState';
import { SimuladoConfig } from '@/hooks/useSimuladoState';
import { Swords, Clock, Trophy, Target, Users, Flame } from 'lucide-react';

interface SimuladoSelectionProps {
  enemies: Inimigo[];
  onStartSimulado: (config: SimuladoConfig) => void;
}

export const SimuladoSelection = ({ enemies, onStartSimulado }: SimuladoSelectionProps) => {
  const [selectedType, setSelectedType] = useState<SimuladoConfig['tipo'] | null>(null);
  const [selectedMaterias, setSelectedMaterias] = useState<string[]>([]);
  const [customQuestionCount, setCustomQuestionCount] = useState<number[]>([20]);

  const materias = Array.from(new Set(enemies.map(e => e.materia)));
  const redRoomEnemies = enemies.filter(e => e.sala_atual === 'vermelha');

  const simuladoTypes = [
    {
      id: 'escaramuca' as const,
      title: 'Escaramuça',
      subtitle: 'Combate Rápido',
      description: 'Batalha rápida para aquecimento',
      icon: Swords,
      questoes: '10-20 questões',
      tempo: '15-30 minutos',
      xp: '+100-150 XP',
      color: 'from-orange-500 to-red-500',
      available: enemies.length > 0
    },
    {
      id: 'guerra_total' as const,
      title: 'Guerra Total',
      subtitle: 'Combate Épico',
      description: 'Simulação completa de prova',
      icon: Trophy,
      questoes: '50-100 questões',
      tempo: '2-4 horas',
      xp: '+200-300 XP',
      color: 'from-purple-600 to-pink-600',
      available: enemies.length >= 25
    },
    {
      id: 'operacao_resgate' as const,
      title: 'Operação Resgate',
      subtitle: 'Missão Focada',
      description: 'Resgate inimigos da Sala Vermelha',
      icon: Target,
      questoes: `${redRoomEnemies.length * 2} questões`,
      tempo: 'Sem limite',
      xp: '+50 XP por resgate',
      color: 'from-red-600 to-rose-600',
      available: redRoomEnemies.length > 0
    }
  ];

  const getAvailableQuestions = () => {
    let filteredEnemies = enemies;
    
    if (selectedType === 'operacao_resgate') {
      filteredEnemies = redRoomEnemies;
    }
    
    if (selectedMaterias.length > 0) {
      filteredEnemies = filteredEnemies.filter(e => selectedMaterias.includes(e.materia));
    }
    
    return filteredEnemies.length * 2; // 2 questions per enemy
  };

  const getEstimatedTime = () => {
    if (!selectedType) return '0 min';
    
    const questionCount = selectedType === 'operacao_resgate' 
      ? getAvailableQuestions() 
      : customQuestionCount[0];
    
    switch (selectedType) {
      case 'escaramuca':
        return `${Math.ceil(questionCount * 1.5)} min`;
      case 'guerra_total':
        return `${Math.ceil(questionCount * 2.5)} min`;
      case 'operacao_resgate':
        return 'Sem limite';
      default:
        return '0 min';
    }
  };

  const handleStartCombate = () => {
    if (!selectedType) return;
    
    const config: SimuladoConfig = {
      tipo: selectedType,
      materias: selectedMaterias.length > 0 ? selectedMaterias : undefined,
      quantidade_questoes: selectedType === 'operacao_resgate' 
        ? undefined 
        : customQuestionCount[0],
      tempo_limite: selectedType === 'guerra_total' ? 240 : 
                   selectedType === 'escaramuca' ? 30 : undefined
    };
    
    onStartSimulado(config);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-fire">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-fire bg-clip-text text-transparent">
              Coliseu Romano
            </h1>
            <p className="text-muted-foreground">
              Entre na arena e prove seu valor em combate épico
            </p>
          </div>
        </div>
      </div>

      {/* Simulado Types */}
      <div className="grid md:grid-cols-3 gap-6">
        {simuladoTypes.map((tipo) => {
          const Icon = tipo.icon;
          const isSelected = selectedType === tipo.id;
          
          return (
            <Card 
              key={tipo.id} 
              className={`cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'ring-2 ring-primary shadow-warrior' 
                  : 'hover:shadow-lg'
              } ${!tipo.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => tipo.available && setSelectedType(tipo.id)}
            >
              <CardHeader className="text-center pb-2">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${tipo.color} flex items-center justify-center mb-3`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{tipo.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{tipo.subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-center">{tipo.description}</p>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{tipo.questoes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{tipo.tempo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span>{tipo.xp}</span>
                  </div>
                </div>
                
                {!tipo.available && (
                  <Badge variant="destructive" className="w-full justify-center">
                    Indisponível
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Panel */}
      {selectedType && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Configuração do Simulado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject Filters */}
            <div className="space-y-3">
              <h4 className="font-medium">Filtrar Matérias (Opcional)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {materias.map((materia) => (
                  <div key={materia} className="flex items-center space-x-2">
                    <Checkbox
                      id={materia}
                      checked={selectedMaterias.includes(materia)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMaterias([...selectedMaterias, materia]);
                        } else {
                          setSelectedMaterias(selectedMaterias.filter(m => m !== materia));
                        }
                      }}
                    />
                    <label 
                      htmlFor={materia} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {materia}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Count (not for Operação Resgate) */}
            {selectedType !== 'operacao_resgate' && (
              <div className="space-y-3">
                <h4 className="font-medium">Quantidade de Questões</h4>
                <div className="space-y-2">
                  <Slider
                    value={customQuestionCount}
                    onValueChange={setCustomQuestionCount}
                    max={selectedType === 'escaramuca' ? 20 : 100}
                    min={selectedType === 'escaramuca' ? 10 : 50}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    {customQuestionCount[0]} questões
                  </p>
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Preview do Combate</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Questões disponíveis:</span>
                  <p className="font-medium">{getAvailableQuestions()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tempo estimado:</span>
                  <p className="font-medium">{getEstimatedTime()}</p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <Button 
              onClick={handleStartCombate}
              className="w-full h-12 text-lg bg-gradient-fire hover:opacity-90 transition-opacity"
              disabled={getAvailableQuestions() === 0}
            >
              <Swords className="h-5 w-5 mr-2" />
              Iniciar Combate Épico!
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};