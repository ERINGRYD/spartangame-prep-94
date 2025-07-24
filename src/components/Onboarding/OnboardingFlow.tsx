import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sword, Shield, Star, Zap, Trophy, Target, Calendar, CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useGameState } from '@/hooks/useGameState';
import { useApp } from '@/contexts/AppContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
}

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [warriorName, setWarriorName] = useState('');
  const [examDate, setExamDate] = useState<Date>();
  const { updateWarriorName, gainXP, setDataProva } = useGameState();
  const { setShowOnboarding, showToast } = useApp();

  const completeOnboarding = () => {
    if (warriorName.trim()) {
      updateWarriorName(warriorName.trim());
      if (examDate) {
        setDataProva(examDate.toISOString());
      }
      gainXP(50); // XP de boas-vindas
      localStorage.setItem('spartanOnboardingComplete', 'true');
      setShowOnboarding(false);
      showToast(`Bem-vindo, ${warriorName}! Sua jornada espartana começou!`, 'success');
    }
  };

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao Sistema Espartano',
      description: 'Transforme seus estudos em uma jornada épica de conquistas',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">⚔️</div>
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Prepare-se para uma experiência única de estudos gamificados.
            </p>
            <p className="text-muted-foreground">
              Aqui, você não apenas estuda — você batalha contra inimigos, conquista territórios 
              e evolui como um verdadeiro guerreiro do conhecimento.
            </p>
          </div>
          <div className="flex justify-center space-x-4 mt-8">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Sword className="h-3 w-3" />
              <span>Batalhas</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Conquistas</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Star className="h-3 w-3" />
              <span>Evolução</span>
            </Badge>
          </div>
        </div>
      )
    },
    {
      id: 'warrior-name',
      title: 'Defina sua Identidade',
      description: 'Como os outros guerreiros o conhecerão?',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <p className="text-muted-foreground mb-6">
              Escolha um nome épico que represente sua força e determinação nos estudos.
            </p>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Digite o nome do seu guerreiro..."
              value={warriorName}
              onChange={(e) => setWarriorName(e.target.value)}
              className="text-center text-lg font-semibold"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground text-center">
              Este nome aparecerá em suas conquistas e rankings
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'how-it-works',
      title: 'Como Funciona o Sistema',
      description: 'Entenda a mecânica por trás da sua evolução',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-card/50">
              <Target className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Crie Inimigos</h4>
                <p className="text-sm text-muted-foreground">
                  Transforme matérias difíceis em inimigos para derrotar
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-card/50">
              <Zap className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Use Energia</h4>
                <p className="text-sm text-muted-foreground">
                  Cada batalha consome energia, que regenera com o tempo
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-card/50">
              <Star className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Ganhe XP</h4>
                <p className="text-sm text-muted-foreground">
                  Evolua de nível conforme resolve questões e conquista objetivos
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-card/50">
              <Trophy className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Conquiste Troféus</h4>
                <p className="text-sm text-muted-foreground">
                  Desbloqueie medalhas por marcos importantes
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'exam-date',
      title: 'Data da Sua Prova',
      description: 'Quando será seu grande desafio?',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-muted-foreground mb-6">
              Defina a data da sua prova para que possamos te ajudar a contar os dias e organizar sua preparação.
            </p>
          </div>
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !examDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {examDate ? format(examDate, "PPP", { locale: ptBR }) : <span>Selecione a data da prova</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={examDate}
                  onSelect={setExamDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Esta data aparecerá no seu painel para te motivar nos estudos
          </p>
        </div>
      )
    },
    {
      id: 'ready',
      title: 'Tudo Pronto, Guerreiro!',
      description: 'Sua jornada épica está prestes a começar',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">🏛️</div>
          <div className="space-y-4">
            <p className="text-lg">
              <strong>{warriorName || 'Guerreiro'}</strong>, você está pronto para começar!
            </p>
            <p className="text-muted-foreground">
              Acesse a <strong>Ágora</strong> para ver sua visão geral, visite o <strong>Arsenal</strong> para 
              criar seus primeiros inimigos, e entre no <strong>Campo de Batalha</strong> para começar a estudar.
            </p>
            <div className="bg-gradient-fire p-4 rounded-lg text-primary-foreground">
              <p className="font-semibold">🎁 Bônus de Boas-vindas</p>
              <p className="text-sm">+50 XP para começar sua jornada!</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">{currentStep + 1} de {steps.length}</Badge>
            <Progress value={progress} className="flex-1 mx-4" />
          </div>
          <CardTitle className="text-2xl bg-gradient-fire bg-clip-text text-transparent">
            {currentStepData.title}
          </CardTitle>
          <CardDescription className="text-base">
            {currentStepData.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStepData.content}
          
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button 
                onClick={completeOnboarding}
                disabled={!warriorName.trim()}
                className="bg-gradient-fire hover:bg-gradient-fire/90"
              >
                Iniciar Jornada! 🚀
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={(currentStep === 1 && !warriorName.trim())}
              >
                Próximo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};