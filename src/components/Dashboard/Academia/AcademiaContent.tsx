import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WarTimer } from './WarTimer';
import { ScrollLibrary } from './ScrollLibrary';
import { KnowledgeCards } from './KnowledgeCards';
import { HistoricoEstudos } from './HistoricoEstudos';
import { Timer, BookOpen, Zap, History } from 'lucide-react';

export const AcademiaContent = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-bronze bg-clip-text text-transparent">
          Academia Espartana
        </h2>
        <p className="text-muted-foreground">
          Território do conhecimento teórico e preparação estratégica
        </p>
      </div>

      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timer" className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Cronômetro de Guerra
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Biblioteca de Pergaminhos
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Cartas de Conhecimento
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="mt-6">
          <WarTimer />
        </TabsContent>

        <TabsContent value="library" className="mt-6">
          <ScrollLibrary />
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <KnowledgeCards />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <HistoricoEstudos />
        </TabsContent>
      </Tabs>
    </div>
  );
};