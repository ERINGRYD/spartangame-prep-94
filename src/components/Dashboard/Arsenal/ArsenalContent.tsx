import { useState } from 'react';
import { InventarioInimigos } from './InventarioInimigos';
import { ForjaInimigos } from './ForjaInimigos';
import { VisaoGeral } from './VisaoGeral';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hammer, Package, BarChart3, Sword } from 'lucide-react';

export const ArsenalContent = () => {
  const [activeTab, setActiveTab] = useState('inventario');
  const [showForja, setShowForja] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header do Arsenal */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-bronze rounded-xl p-4 shadow-bronze">
                <Sword className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground bg-gradient-fire bg-clip-text text-transparent">
                  Arsenal de Guerra
                </h1>
                <p className="text-muted-foreground mt-1">
                  Forje, gerencie e domine seus inimigos de estudo
                </p>
              </div>
            </div>
            
            <Button
              variant="epic"
              size="epic"
              onClick={() => setShowForja(true)}
              className="gap-3"
            >
              <Hammer className="h-6 w-6" />
              Forjar Inimigo
            </Button>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="inventario" className="gap-2">
              <Package className="h-4 w-4" />
              Inventário
            </TabsTrigger>
            <TabsTrigger value="visao-geral" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <Sword className="h-4 w-4" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventario" className="space-y-6">
            <InventarioInimigos />
          </TabsContent>

          <TabsContent value="visao-geral" className="space-y-6">
            <VisaoGeral />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Estatísticas avançadas em desenvolvimento...
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal da Forja */}
        {showForja && (
          <ForjaInimigos
            open={showForja}
            onClose={() => setShowForja(false)}
          />
        )}
      </div>
    </div>
  );
};