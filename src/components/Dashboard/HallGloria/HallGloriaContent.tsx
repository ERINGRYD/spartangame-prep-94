import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, Target, Award } from 'lucide-react';
import { CampaignReport } from './CampaignReport';
import { SubjectBreakdown } from './SubjectBreakdown';
import { AchievementsPanel } from './AchievementsPanel';
import { BattleTimeline } from './BattleTimeline';
import { StrategicRecommendations } from './StrategicRecommendations';

export const HallGloriaContent = () => {
  return (
    <div className="space-y-6">
      {/* Header Épico */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-full shadow-gold">
          <Trophy className="h-10 w-10 text-background" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Hall da Glória
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Suas conquistas e análises de batalha
          </p>
        </div>
      </div>

      {/* Navegação por Abas */}
      <Tabs defaultValue="campaign" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="campaign" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Campanha
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Matérias
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Troféus
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Estratégia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaign" className="space-y-6">
          <CampaignReport />
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <SubjectBreakdown />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AchievementsPanel />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <BattleTimeline />
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <StrategicRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};