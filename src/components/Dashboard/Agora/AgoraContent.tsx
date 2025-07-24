import { WarriorProfile } from './WarriorProfile';
import { StatsCards } from './StatsCards';
import { StrategicAlerts } from './StrategicAlerts';
import { QuickActions } from './QuickActions';
import { useToast } from '@/hooks/use-toast';

interface AgoraContentProps {
  onNavigate?: (tab: string) => void;
}

export const AgoraContent = ({ onNavigate }: AgoraContentProps) => {
  const { toast } = useToast();

  const handleCardClick = (cardType: 'accuracy' | 'enemies' | 'nextLevel') => {
    switch (cardType) {
      case 'accuracy':
        toast({
          title: "Hall da Glória",
          description: "Navegando para suas estatísticas detalhadas...",
        });
        onNavigate?.('gloria');
        break;
      case 'enemies':
        toast({
          title: "Inimigos Ativos",
          description: "Mostrando todos os seus inimigos...",
        });
        // Mantém na ágora mas poderia filtrar inimigos
        break;
      case 'nextLevel':
        toast({
          title: "Progresso XP",
          description: "Continue lutando para alcançar o próximo nível!",
        });
        break;
    }
  };

  const handleAlertAction = (action: 'focus-red' | 'restore-energy' | 'celebrate') => {
    switch (action) {
      case 'focus-red':
        toast({
          title: "Foco Vermelho Ativado!",
          description: "Filtrando inimigos da Sala Vermelha...",
        });
        break;
      case 'restore-energy':
        toast({
          title: "Energia Restaurada!",
          description: "Você recuperou 30 pontos de energia.",
        });
        break;
      case 'celebrate':
        toast({
          title: "🏆 Conquista Desbloqueada!",
          description: "Navegando para suas conquistas...",
        });
        onNavigate?.('gloria');
        break;
    }
  };

  const handleQuickAction = (action: 'quick-battle' | 'focus-red' | 'new-enemy') => {
    switch (action) {
      case 'quick-battle':
        toast({
          title: "⚔️ Batalha Rápida!",
          description: "Preparando para o campo de batalha...",
        });
        onNavigate?.('batalha');
        break;
      case 'focus-red':
        toast({
          title: "🎯 Foco Vermelho!",
          description: "Priorizando inimigos críticos...",
        });
        break;
      case 'new-enemy':
        toast({
          title: "➕ Novo Inimigo",
          description: "Acessando o arsenal para criar novo desafio...",
        });
        onNavigate?.('arsenal');
        break;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Perfil do Guerreiro - Topo */}
      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <WarriorProfile />
      </div>

      {/* Layout em Grid para Desktop */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Cards Principais - Centro (Coluna Principal) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <StatsCards onCardClick={handleCardClick} />
          </div>
          
          {/* Ações Rápidas - Rodapé da coluna principal */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <QuickActions onAction={handleQuickAction} />
          </div>
        </div>

        {/* Alertas Estratégicos - Lateral */}
        <div className="lg:col-span-4">
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <StrategicAlerts onAlertAction={handleAlertAction} />
          </div>
        </div>
      </div>
    </div>
  );
};