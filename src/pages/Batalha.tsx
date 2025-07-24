import { useState } from 'react';
import { Layout } from "@/components/Layout/Layout";
import { BattlefieldContent } from "@/components/Dashboard/Battlefield";
import { MobileNavigation } from "@/components/Layout/MobileNavigation";
import { useNavigate } from 'react-router-dom';

const Batalha = () => {
  const navigate = useNavigate();

  const handleNavigate = (tab: string) => {
    navigate(`/${tab}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BattlefieldContent onNavigate={handleNavigate} />
      </div>
      <MobileNavigation />
    </Layout>
  );
};

export default Batalha;