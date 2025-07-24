import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGameState, Inimigo, Questao } from '@/hooks/useGameState';
import { useToast } from '@/hooks/use-toast';
import { Hammer, Plus, Trash2, Target, BookOpen } from 'lucide-react';

interface ForjaInimigosProps {
  open: boolean;
  onClose: () => void;
  inimigo?: Inimigo;
}

export const ForjaInimigos = ({ open, onClose, inimigo }: ForjaInimigosProps) => {
  const { addInimigo, updateInimigo, addQuestaoToInimigo } = useGameState();
  const { toast } = useToast();
  
  // Estado do formulário
  const [materia, setMateria] = useState('');
  const [tema, setTema] = useState('');
  const [subtema, setSubtema] = useState('');
  const [tipo, setTipo] = useState<'objetiva' | 'subjetiva'>('objetiva');
  const [salaAtual, setSalaAtual] = useState<'vermelha' | 'amarela' | 'verde'>('vermelha');
  
  // Estado das questões
  const [questoes, setQuestoes] = useState<Omit<Questao, 'id'>[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState<Omit<Questao, 'id'>>({
    tipo: 'objetiva',
    enunciado: '',
    alternativas: ['', '', '', '', ''],
    gabarito: ''
  });

  // Popular dados se estiver editando
  useEffect(() => {
    if (inimigo) {
      setMateria(inimigo.materia);
      setTema(inimigo.tema);
      setSubtema(inimigo.subtema || '');
      setTipo(inimigo.tipo);
      setSalaAtual(inimigo.sala_atual);
      setQuestoes(inimigo.questoes.map(q => ({ ...q })));
    }
  }, [inimigo]);

  // Reset form
  const resetForm = () => {
    setMateria('');
    setTema('');
    setSubtema('');
    setTipo('objetiva');
    setSalaAtual('vermelha');
    setQuestoes([]);
    setQuestaoAtual({
      tipo: 'objetiva',
      enunciado: '',
      alternativas: ['', '', '', '', ''],
      gabarito: ''
    });
  };

  const handleAddQuestao = () => {
    if (!questaoAtual.enunciado.trim()) {
      toast({
        title: "Erro",
        description: "O enunciado da questão é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (questaoAtual.tipo === 'objetiva') {
      if (!questaoAtual.alternativas?.every(alt => alt.trim()) || !questaoAtual.gabarito) {
        toast({
          title: "Erro", 
          description: "Para questões objetivas, todas as alternativas e o gabarito são obrigatórios",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (!questaoAtual.verso?.trim()) {
        toast({
          title: "Erro",
          description: "Para questões subjetivas, a resposta (verso) é obrigatória",
          variant: "destructive"
        });
        return;
      }
    }

    setQuestoes(prev => [...prev, { ...questaoAtual }]);
    setQuestaoAtual({
      tipo: tipo,
      enunciado: '',
      alternativas: tipo === 'objetiva' ? ['', '', '', '', ''] : undefined,
      gabarito: tipo === 'objetiva' ? '' : undefined,
      frente: tipo === 'subjetiva' ? '' : undefined,
      verso: tipo === 'subjetiva' ? '' : undefined
    });

    toast({
      title: "Questão adicionada!",
      description: "A questão foi adicionada ao inimigo"
    });
  };

  const handleRemoveQuestao = (index: number) => {
    setQuestoes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!materia.trim() || !tema.trim()) {
      toast({
        title: "Erro",
        description: "Matéria e tema são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const inimigoData = {
      materia: materia.trim(),
      tema: tema.trim(),
      subtema: subtema.trim() || undefined,
      tipo,
      sala_atual: salaAtual,
      questoes: questoes as Questao[]
    };

    if (inimigo) {
      // Editando
      updateInimigo(inimigo.id, inimigoData);
      toast({
        title: "Inimigo atualizado!",
        description: `${materia} - ${tema} foi atualizado com sucesso`
      });
    } else {
      // Criando novo
      addInimigo(inimigoData);
      toast({
        title: "Inimigo forjado!",
        description: `${materia} - ${tema} foi criado com sucesso. +15 XP!`
      });
    }

    resetForm();
    onClose();
  };

  const updateAlternativa = (index: number, value: string) => {
    setQuestaoAtual(prev => ({
      ...prev,
      alternativas: prev.alternativas?.map((alt, i) => i === index ? value : alt)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-gradient-bronze rounded-lg p-2 shadow-bronze">
              <Hammer className="h-6 w-6 text-foreground" />
            </div>
            {inimigo ? 'Forjar Novamente' : 'Forjar Novo Inimigo'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Informações do Inimigo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="materia">Matéria *</Label>
                  <Input
                    id="materia"
                    placeholder="Ex: Direito Constitucional"
                    value={materia}
                    onChange={(e) => setMateria(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tema">Tema *</Label>
                  <Input
                    id="tema"
                    placeholder="Ex: Direitos Fundamentais"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtema">Subtema (opcional)</Label>
                <Input
                  id="subtema"
                  placeholder="Ex: Direitos Sociais"
                  value={subtema}
                  onChange={(e) => setSubtema(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label>Tipo de Questão</Label>
                  <RadioGroup
                    value={tipo}
                    onValueChange={(value) => {
                      setTipo(value as 'objetiva' | 'subjetiva');
                      setQuestaoAtual(prev => ({
                        tipo: value as 'objetiva' | 'subjetiva',
                        enunciado: '',
                        alternativas: value === 'objetiva' ? ['', '', '', '', ''] : undefined,
                        gabarito: value === 'objetiva' ? '' : undefined,
                        frente: value === 'subjetiva' ? '' : undefined,
                        verso: value === 'subjetiva' ? '' : undefined
                      }));
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="objetiva" id="objetiva" />
                      <Label htmlFor="objetiva">🎯 Objetiva (múltipla escolha)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="subjetiva" id="subjetiva" />
                      <Label htmlFor="subjetiva">📝 Subjetiva (flashcard)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Sala Inicial</Label>
                  <Select value={salaAtual} onValueChange={(value) => setSalaAtual(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vermelha">
                        <Badge className="bg-gradient-room-red text-foreground">
                          Sala Vermelha
                        </Badge>
                      </SelectItem>
                      <SelectItem value="amarela">
                        <Badge className="bg-gradient-room-yellow text-foreground">
                          Sala Amarela
                        </Badge>
                      </SelectItem>
                      <SelectItem value="verde">
                        <Badge className="bg-gradient-room-green text-foreground">
                          Sala Verde
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Criação de Questões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Adicionar Questão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="enunciado">
                  {tipo === 'objetiva' ? 'Enunciado da Questão' : 'Frente do Card'}
                </Label>
                <Textarea
                  id="enunciado"
                  placeholder={tipo === 'objetiva' ? 'Digite o enunciado da questão...' : 'Digite a pergunta...'}
                  value={questaoAtual.enunciado}
                  onChange={(e) => setQuestaoAtual(prev => ({ ...prev, enunciado: e.target.value }))}
                  rows={3}
                />
              </div>

              {tipo === 'objetiva' ? (
                <>
                  <div className="space-y-3">
                    <Label>Alternativas</Label>
                    {questaoAtual.alternativas?.map((alt, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="font-medium min-w-8">
                          {String.fromCharCode(65 + index)})
                        </span>
                        <Input
                          placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                          value={alt}
                          onChange={(e) => updateAlternativa(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Gabarito</Label>
                    <Select 
                      value={questaoAtual.gabarito} 
                      onValueChange={(value) => setQuestaoAtual(prev => ({ ...prev, gabarito: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a alternativa correta" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A', 'B', 'C', 'D', 'E'].map(letter => (
                          <SelectItem key={letter} value={letter}>
                            {letter}) {questaoAtual.alternativas?.[letter.charCodeAt(0) - 65] || 'Alternativa não preenchida'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="verso">Verso do Card (Resposta)</Label>
                  <Textarea
                    id="verso"
                    placeholder="Digite a resposta..."
                    value={questaoAtual.verso || ''}
                    onChange={(e) => setQuestaoAtual(prev => ({ ...prev, verso: e.target.value }))}
                    rows={3}
                  />
                </div>
              )}

              <Button onClick={handleAddQuestao} variant="secondary" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Questão
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Questões Adicionadas */}
          {questoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Questões Adicionadas ({questoes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questoes.map((questao, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">Q{index + 1}</Badge>
                          <Badge>{questao.tipo === 'objetiva' ? '🎯' : '📝'}</Badge>
                        </div>
                        <p className="text-sm text-foreground">
                          {questao.enunciado.substring(0, 100)}
                          {questao.enunciado.length > 100 && '...'}
                        </p>
                        {questao.tipo === 'objetiva' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Gabarito: {questao.gabarito}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestao(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="epic" className="flex-1">
              <Hammer className="h-4 w-4 mr-2" />
              {inimigo ? 'Reforjar Inimigo' : 'Forjar Inimigo'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};