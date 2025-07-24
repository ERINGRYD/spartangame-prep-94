import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameState } from '@/hooks/useGameState';
import { useApp } from '@/contexts/AppContext';
import { Settings, User, Download, Trash2, Volume2, VolumeX, Moon, Sun, Monitor } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const { gameState, updateWarriorName } = useGameState();
  const { settings, updateSettings, resetGameData, exportData, showToast } = useApp();
  const [newWarriorName, setNewWarriorName] = useState(gameState.guerreiro.nome);

  const handleNameUpdate = () => {
    if (newWarriorName.trim() && newWarriorName !== gameState.guerreiro.nome) {
      updateWarriorName(newWarriorName.trim());
      showToast('Nome do guerreiro atualizado!', 'success');
    }
  };

  const handleReset = () => {
    resetGameData();
    onOpenChange(false);
  };

  const getThemeIcon = () => {
    switch (settings.theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configurações do Sistema</span>
          </DialogTitle>
          <DialogDescription>
            Personalize sua experiência no Sistema Espartano
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
            <TabsTrigger value="data">Dados</TabsTrigger>
            <TabsTrigger value="about">Sobre</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Informações do Guerreiro</span>
                </CardTitle>
                <CardDescription>
                  Gerencie as informações do seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="warrior-name">Nome do Guerreiro</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="warrior-name"
                      value={newWarriorName}
                      onChange={(e) => setNewWarriorName(e.target.value)}
                      placeholder="Digite o nome do guerreiro"
                      maxLength={20}
                    />
                    <Button 
                      onClick={handleNameUpdate}
                      disabled={!newWarriorName.trim() || newWarriorName === gameState.guerreiro.nome}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{gameState.guerreiro.nivel}</p>
                    <p className="text-sm text-muted-foreground">Nível</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary">{gameState.guerreiro.sequencia_dias}</p>
                    <p className="text-sm text-muted-foreground">Dias Consecutivos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aparência e Som</CardTitle>
                <CardDescription>
                  Configure a interface e efeitos sonoros
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center space-x-2">
                      <ThemeIcon className="h-4 w-4" />
                      <span>Tema</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Escolha o tema da interface
                    </p>
                  </div>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value: 'light' | 'dark' | 'system') => 
                      updateSettings({ theme: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center space-x-2">
                      {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      <span>Efeitos Sonoros</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Reproduzir sons para ações importantes
                    </p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tutorial</Label>
                    <p className="text-sm text-muted-foreground">
                      Exibir dicas e tutoriais
                    </p>
                  </div>
                  <Switch
                    checked={settings.showTutorial}
                    onCheckedChange={(checked) => updateSettings({ showTutorial: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Dados</CardTitle>
                <CardDescription>
                  Exporte ou remova seus dados do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Exportar Dados</span>
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Baixe um backup completo dos seus dados
                      </p>
                    </div>
                    <Button onClick={exportData} variant="outline">
                      Exportar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                    <div>
                      <h4 className="font-semibold flex items-center space-x-2 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span>Resetar Sistema</span>
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Remove todos os dados e recomeça do zero
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Resetar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Reset</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação é irreversível. Todos os seus dados, progresso, 
                            inimigos e conquistas serão perdidos permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                            Sim, resetar tudo
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sistema Espartano</CardTitle>
                <CardDescription>
                  Plataforma de estudos gamificados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="text-6xl">⚔️</div>
                  <div>
                    <h3 className="text-lg font-semibold">Versão 1.0.0</h3>
                    <p className="text-sm text-muted-foreground">
                      Transformando estudos em conquistas épicas
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-lg font-bold">{gameState.inimigos.length}</p>
                      <p className="text-xs text-muted-foreground">Inimigos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{gameState.guerreiro.estatisticas.questoes_resolvidas}</p>
                      <p className="text-xs text-muted-foreground">Questões</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{gameState.achievements.length}</p>
                      <p className="text-xs text-muted-foreground">Conquistas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};