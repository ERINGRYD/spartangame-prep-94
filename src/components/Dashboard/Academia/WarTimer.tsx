import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Play, Pause, Square, Timer, Coffee, Settings } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

type TimerState = 'preparation' | 'study' | 'break' | 'finished';

export const WarTimer = () => {
  const { gainXP, addStudyTime } = useGameState();
  const [state, setState] = useState<TimerState>('preparation');
  const [studyTime, setStudyTime] = useState(25); // minutes
  const [breakTime, setBreakTime] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = state === 'study' ? studyTime * 60 : breakTime * 60;
    return ((total - timeLeft) / total) * 100;
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (state === 'study') {
        // Completed study session
        gainXP(50);
        addStudyTime(studyTime);
        setState('break');
        setTimeLeft(breakTime * 60);
        setIsRunning(false);
      } else if (state === 'break') {
        setState('finished');
        setIsRunning(false);
      }
    }
  }, [timeLeft, state, gainXP, addStudyTime]);

  const handleStart = () => {
    if (state === 'preparation') {
      setState('study');
      setTimeLeft(studyTime * 60);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setState('preparation');
    setTimeLeft(studyTime * 60);
  };

  const handleSaveSettings = (newStudyTime: number, newBreakTime: number) => {
    setStudyTime(newStudyTime);
    setBreakTime(newBreakTime);
    if (state === 'preparation') {
      setTimeLeft(newStudyTime * 60);
    }
    setShowSettings(false);
  };

  const getStateInfo = () => {
    switch (state) {
      case 'preparation':
        return {
          title: 'Preparação para Batalha',
          icon: Timer,
          description: `Prepare-se para ${studyTime} minutos de estudo intenso`
        };
      case 'study':
        return {
          title: 'Em Batalha!',
          icon: Timer,
          description: 'Foque nos estudos, guerreiro!'
        };
      case 'break':
        return {
          title: 'Descanso do Guerreiro',
          icon: Coffee,
          description: `${breakTime} minutos de pausa merecida`
        };
      case 'finished':
        return {
          title: 'Batalha Concluída!',
          icon: Timer,
          description: 'Sessão finalizada com sucesso! +50 XP'
        };
    }
  };

  const stateInfo = getStateInfo();
  const StateIcon = stateInfo.icon;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-bronze opacity-10" />
      
      <CardHeader className="text-center relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <StateIcon className="w-6 h-6 text-secondary" />
              {stateInfo.title}
            </CardTitle>
            <p className="text-muted-foreground">{stateInfo.description}</p>
          </div>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isRunning}>
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurações do Timer</DialogTitle>
              </DialogHeader>
              <TimerSettings
                studyTime={studyTime}
                breakTime={breakTime}
                onSave={handleSaveSettings}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="text-center space-y-6 relative z-10">
        {/* Progress Circle */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - getProgress() / 100)}`}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground">
                {state === 'study' ? 'Estudo' : state === 'break' ? 'Pausa' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <Button onClick={handleStart} className="bg-gradient-bronze hover:opacity-90">
              <Play className="w-4 h-4 mr-2" />
              {state === 'preparation' ? 'Iniciar Batalha' : 'Continuar'}
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              Pausar
            </Button>
          )}
          
          <Button onClick={handleReset} variant="outline">
            <Square className="w-4 h-4 mr-2" />
            Finalizar
          </Button>
        </div>

        {state === 'finished' && (
          <div className="text-center p-4 bg-gradient-gold rounded-lg">
            <p className="text-foreground font-semibold">
              Sessão de estudo completada! +50 XP conquistados!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TimerSettingsProps {
  studyTime: number;
  breakTime: number;
  onSave: (studyTime: number, breakTime: number) => void;
}

const TimerSettings = ({ studyTime, breakTime, onSave }: TimerSettingsProps) => {
  const [newStudyTime, setNewStudyTime] = useState(studyTime);
  const [newBreakTime, setNewBreakTime] = useState(breakTime);

  const handleSave = () => {
    onSave(newStudyTime, newBreakTime);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Tempo de Estudo (minutos)</label>
        <Input
          type="number"
          value={newStudyTime}
          onChange={(e) => setNewStudyTime(Number(e.target.value))}
          min={1}
          max={120}
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Tempo de Pausa (minutos)</label>
        <Input
          type="number"
          value={newBreakTime}
          onChange={(e) => setNewBreakTime(Number(e.target.value))}
          min={1}
          max={30}
          className="mt-1"
        />
      </div>
      
      <Button onClick={handleSave} className="w-full">
        Salvar Configurações
      </Button>
    </div>
  );
};