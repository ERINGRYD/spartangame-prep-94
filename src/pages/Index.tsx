import { Layout } from "@/components/Layout/Layout";
import { HeroSection } from "@/components/Dashboard/HeroSection";
import { AgoraContent } from "@/components/Dashboard/Agora";
import { MobileNavigation } from "@/components/Layout/MobileNavigation";
import { OnboardingFlow } from "@/components/Onboarding/OnboardingFlow";
import { InstallPrompt } from "@/components/PWA/InstallPrompt";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { showOnboarding } = useApp();
  const navigate = useNavigate();

  const handleNavigate = (tab: string) => {
    navigate(`/${tab}`);
  };

  return (
    <Layout>
      {showOnboarding && <OnboardingFlow />}
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AgoraContent onNavigate={handleNavigate} />
        </div>
      </div>
      <MobileNavigation />
      <InstallPrompt />
    </Layout>
  );
};

export default Index;
