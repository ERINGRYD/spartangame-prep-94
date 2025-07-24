import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useGameState, Inimigo } from '@/hooks/useGameState';
import { Search, Filter, Swords, Edit, Trash2, Eye, EyeOff, Target, Hammer } from 'lucide-react';
import { ForjaInimigos } from './ForjaInimigos';

export const InventarioInimigos = () => {
  const { gameState, deleteInimigo } = useGameState();
  const [filtroSala, setFiltroSala] = useState<string>('todas');
  const [filtroMateria, setFiltroMateria] = useState<string>('todas');
  const [busca, setBusca] = useState('');
  const [inimigoEditando, setInimigoEditando] = useState<Inimigo | null>(null);
  const [questoesVisiveis, setQuestoesVisiveis] = useState<string[]>([]);

  const { inimigos } = gameState;

  // Filtros
  const inimigosFiltrados = inimigos.filter(inimigo => {
    const matchSala = filtroSala === 'todas' || inimigo.sala_atual === filtroSala;
    const matchMateria = filtroMateria === 'todas' || inimigo.materia === filtroMateria;
    const matchBusca = busca === '' || 
      inimigo.materia.toLowerCase().includes(busca.toLowerCase()) ||
      inimigo.tema.toLowerCase().includes(busca.toLowerCase()) ||
      (inimigo.subtema && inimigo.subtema.toLowerCase().includes(busca.toLowerCase()));
    
    return matchSala && matchMateria && matchBusca;
  });

  // Matérias únicas para filtro
  const materiasUnicas = Array.from(new Set(inimigos.map(i => i.materia)));

  const getSalaColor = (sala: string) => {
    const colors = {
      vermelha: 'bg-gradient-room-red text-foreground',
      amarela: 'bg-gradient-room-yellow text-foreground',
      verde: 'bg-gradient-room-green text-foreground'
    };
    return colors[sala as keyof typeof colors] || 'bg-muted';
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'objetiva' ? '🎯' : '📝';
  };

  const toggleQuestoesVisiveis = (inimigoId: string) => {
    setQuestoesVisiveis(prev => 
      prev.includes(inimigoId) 
        ? prev.filter(id => id !== inimigoId)
        : [...prev, inimigoId]
    );
  };

  if (inimigos.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="bg-gradient-bronze rounded-full p-6 mb-4 shadow-bronze">
            <Swords className="h-12 w-12 text-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Arsenal Vazio</h3>
          <p className="text-muted-foreground text-center mb-6">
            Seu arsenal está vazio, guerreiro! <br />
            Forge seus primeiros inimigos para começar a batalha.
          </p>
          <Button variant="epic" size="lg">
            <Hammer className="h-5 w-5 mr-2" />
            Forjar Primeiro Inimigo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card className="bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Batalha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar inimigos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por Sala */}
            <Select value={filtroSala} onValueChange={setFiltroSala}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as salas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as salas</SelectItem>
                <SelectItem value="vermelha">Sala Vermelha</SelectItem>
                <SelectItem value="amarela">Sala Amarela</SelectItem>
                <SelectItem value="verde">Sala Verde</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por Matéria */}
            <Select value={filtroMateria} onValueChange={setFiltroMateria}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as matérias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as matérias</SelectItem>
                {materiasUnicas.map(materia => (
                  <SelectItem key={materia} value={materia}>
                    {materia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Contador */}
            <div className="flex items-center justify-center bg-muted rounded-lg p-3">
              <span className="text-sm font-medium">
                {inimigosFiltrados.length} de {inimigos.length} inimigos
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Inimigos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {inimigosFiltrados.map((inimigo) => (
          <Card key={inimigo.id} className="group bg-card/80 backdrop-blur-sm hover:shadow-warrior transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTipoIcon(inimigo.tipo)}</span>
                    <Badge className={getSalaColor(inimigo.sala_atual)}>
                      {inimigo.sala_atual}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground">
                    {inimigo.materia}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-medium">
                    {inimigo.tema}
                  </p>
                  {inimigo.subtema && (
                    <p className="text-xs text-muted-foreground">
                      {inimigo.subtema}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">
                    {inimigo.estatisticas.taxa_acerto.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Taxa de Acerto</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">
                    {inimigo.estatisticas.tentativas}
                  </div>
                  <div className="text-xs text-muted-foreground">Tentativas</div>
                </div>
              </div>

              {/* Questões (se visível) */}
              {questoesVisiveis.includes(inimigo.id) && (
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <h4 className="text-sm font-medium">Questões ({inimigo.questoes.length})</h4>
                  {inimigo.questoes.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhuma questão cadastrada</p>
                  ) : (
                    <div className="space-y-1">
                      {inimigo.questoes.slice(0, 2).map((questao, index) => (
                        <div key={questao.id} className="text-xs p-2 bg-background/50 rounded">
                          <span className="font-medium">Q{index + 1}:</span> {questao.enunciado.substring(0, 50)}...
                        </div>
                      ))}
                      {inimigo.questoes.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{inimigo.questoes.length - 2} questões...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {/* TODO: Navegar para batalha */}}
                >
                  <Target className="h-4 w-4 mr-1" />
                  Batalhar
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleQuestoesVisiveis(inimigo.id)}
                >
                  {questoesVisiveis.includes(inimigo.id) ? 
                    <EyeOff className="h-4 w-4" /> : 
                    <Eye className="h-4 w-4" />
                  }
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInimigoEditando(inimigo)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Destruir Inimigo</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja destruir este inimigo? Esta ação não pode ser desfeita.
                        <br /><br />
                        <strong>{inimigo.materia} - {inimigo.tema}</strong>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteInimigo(inimigo.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Destruir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Edição */}
      {inimigoEditando && (
        <ForjaInimigos
          open={!!inimigoEditando}
          onClose={() => setInimigoEditando(null)}
          inimigo={inimigoEditando}
        />
      )}
    </div>
  );
};