import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/hooks/use-toast';

interface AppSettings {
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'pt' | 'en';
  showTutorial: boolean;
}

interface AppContextType {
  isFirstTime: boolean;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetGameData: () => void;
  exportData: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  isOnline: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  theme: 'dark',
  language: 'pt',
  showTutorial: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { gameState, updateWarriorName } = useGameState();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('spartanSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Check if it's the first time opening the app
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('spartanOnboardingComplete');
    if (!hasSeenOnboarding && gameState.guerreiro.nome === 'Guerreiro') {
      setIsFirstTime(true);
      setShowOnboarding(true);
    }
  }, [gameState.guerreiro.nome]);

  // Save settings
  useEffect(() => {
    localStorage.setItem('spartanSettings', JSON.stringify(settings));
  }, [settings]);

  // Network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetGameData = () => {
    localStorage.removeItem('spartanSystem');
    localStorage.removeItem('spartanOnboardingComplete');
    localStorage.removeItem('spartanSettings');
    window.location.reload();
  };

  const exportData = () => {
    const data = {
      gameState,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sistema-espartano-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Dados exportados com sucesso!', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const variants = {
      success: { variant: 'default' as const, title: '✅ Sucesso' },
      error: { variant: 'destructive' as const, title: '❌ Erro' },
      warning: { variant: 'default' as const, title: '⚠️ Atenção' },
      info: { variant: 'default' as const, title: 'ℹ️ Informação' }
    };

    toast({
      ...variants[type],
      description: message,
    });
  };

  return (
    <AppContext.Provider value={{
      isFirstTime,
      showOnboarding,
      setShowOnboarding,
      settings,
      updateSettings,
      resetGameData,
      exportData,
      showToast,
      isOnline
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};