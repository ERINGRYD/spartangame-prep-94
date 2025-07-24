import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Focus, Plus, ArrowRight } from 'lucide-react';

interface QuickActionsProps {
  onAction?: (action: 'quick-battle' | 'focus-red' | 'new-enemy') => void;
}

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Ações Rápidas</h3>
        
        <div className="grid gap-3 md:grid-cols-3">
          {/* Batalha Rápida */}
          <Button 
            onClick={() => onAction?.('quick-battle')}
            className="group bg-gradient-fire hover:bg-primary/90 text-foreground p-4 h-auto flex-col gap-2 shadow-warrior transition-all duration-300 hover:scale-105"
          >
            <Zap className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Batalha Rápida</div>
              <div className="text-xs opacity-90">Campo de Batalha</div>
            </div>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          {/* Foco Vermelho */}
          <Button 
            onClick={() => onAction?.('focus-red')}
            className="group bg-gradient-room-red hover:bg-room-red/90 text-foreground p-4 h-auto flex-col gap-2 transition-all duration-300 hover:scale-105"
          >
            <Focus className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Foco Vermelho</div>
              <div className="text-xs opacity-90">Inimigos Críticos</div>
            </div>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          {/* Novo Inimigo */}
          <Button 
            onClick={() => onAction?.('new-enemy')}
            className="group bg-gradient-bronze hover:bg-secondary/90 text-foreground p-4 h-auto flex-col gap-2 shadow-bronze transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Novo Inimigo</div>
              <div className="text-xs opacity-90">Arsenal</div>
            </div>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Comandos rápidos para acelerar sua jornada
          </p>
        </div>
      </CardContent>
    </Card>
  );
};