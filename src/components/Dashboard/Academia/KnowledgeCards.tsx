import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Edit3, 
  Save, 
  X,
  Zap
} from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

type Difficulty = 'easy' | 'medium' | 'hard';

interface FlashCard {
  id: string;
  front: string;
  back: string;
  difficulty: Difficulty;
  lastReviewed: string;
  reviewCount: number;
}

const difficultyConfig = {
  easy: { label: 'Fácil', color: 'bg-room-green', xp: 5 },
  medium: { label: 'Médio', color: 'bg-room-yellow', xp: 8 },
  hard: { label: 'Difícil', color: 'bg-room-red', xp: 12 }
};

export const KnowledgeCards = () => {
  const { gainXP } = useGameState();
  const [cards, setCards] = useState<FlashCard[]>(() => {
    const saved = localStorage.getItem('spartanFlashcards');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    difficulty: 'medium' as Difficulty
  });

  const saveCards = (newCards: FlashCard[]) => {
    setCards(newCards);
    localStorage.setItem('spartanFlashcards', JSON.stringify(newCards));
  };

  const createCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    const card: FlashCard = {
      id: Date.now().toString(),
      front: newCard.front.trim(),
      back: newCard.back.trim(),
      difficulty: newCard.difficulty,
      lastReviewed: new Date().toISOString(),
      reviewCount: 0
    };

    const updatedCards = [...cards, card];
    saveCards(updatedCards);
    
    setNewCard({ front: '', back: '', difficulty: 'medium' });
    setIsCreating(false);
    setCurrentIndex(updatedCards.length - 1);
  };

  const reviewCard = () => {
    if (cards.length === 0) return;

    const currentCard = cards[currentIndex];
    const xpGained = difficultyConfig[currentCard.difficulty].xp;
    
    gainXP(xpGained);

    const updatedCards = cards.map((card, index) => 
      index === currentIndex 
        ? { 
            ...card, 
            lastReviewed: new Date().toISOString(),
            reviewCount: card.reviewCount + 1
          }
        : card
    );

    saveCards(updatedCards);
    setShowBack(false);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setShowBack(false);
  };

  const previousCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setShowBack(false);
  };

  const editCard = (updates: Partial<FlashCard>) => {
    const updatedCards = cards.map((card, index) =>
      index === currentIndex ? { ...card, ...updates } : card
    );
    saveCards(updatedCards);
    setIsEditing(false);
  };

  const deleteCard = () => {
    const updatedCards = cards.filter((_, index) => index !== currentIndex);
    saveCards(updatedCards);
    
    if (updatedCards.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= updatedCards.length) {
      setCurrentIndex(updatedCards.length - 1);
    }
    
    setShowBack(false);
    setIsEditing(false);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-gold opacity-10" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              Cartas de Conhecimento
            </CardTitle>
            
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-gradient-bronze hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Carta
            </Button>
          </div>
          
          {cards.length > 0 && (
            <p className="text-muted-foreground">
              Carta {currentIndex + 1} de {cards.length}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Create New Card */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Carta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Frente da carta:</label>
              <Textarea
                placeholder="Digite a pergunta ou conceito..."
                value={newCard.front}
                onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Verso da carta:</label>
              <Textarea
                placeholder="Digite a resposta ou explicação..."
                value={newCard.back}
                onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Dificuldade:</label>
              <div className="flex gap-2">
                {Object.entries(difficultyConfig).map(([key, config]) => (
                  <Button
                    key={key}
                    variant={newCard.difficulty === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewCard(prev => ({ 
                      ...prev, 
                      difficulty: key as Difficulty 
                    }))}
                    className={newCard.difficulty === key ? config.color : ''}
                  >
                    {config.label} (+{config.xp} XP)
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={createCard}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flashcard Display */}
      {cards.length > 0 && currentCard && (
        <Card className="min-h-[400px]">
          <CardContent className="p-8">
            <div className="h-full flex flex-col justify-between">
              {/* Card Content */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4 w-full">
                  <Badge className={difficultyConfig[currentCard.difficulty].color}>
                    {difficultyConfig[currentCard.difficulty].label}
                  </Badge>
                  
                  <div className="text-lg leading-relaxed">
                    {showBack ? currentCard.back : currentCard.front}
                  </div>
                </div>
              </div>

              {/* Card Controls */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={previousCard}
                  disabled={cards.length <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex gap-2">
                  {!showBack ? (
                    <Button onClick={() => setShowBack(true)}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Mostrar Resposta
                    </Button>
                  ) : (
                    <Button 
                      onClick={reviewCard}
                      className="bg-gradient-gold hover:opacity-90"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Revisei (+{difficultyConfig[currentCard.difficulty].xp} XP)
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={nextCard}
                  disabled={cards.length <= 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Cards Message */}
      {cards.length === 0 && !isCreating && (
        <Card>
          <CardContent className="text-center py-12">
            <Zap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma carta criada ainda
            </h3>
            <p className="text-muted-foreground mb-4">
              Crie suas primeiras cartas de conhecimento para começar a estudar
            </p>
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-gradient-bronze hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Carta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};