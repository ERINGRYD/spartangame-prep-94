import { Layout } from "@/components/Layout/Layout";
import { HallGloriaContent } from "@/components/Dashboard/HallGloria";
import { MobileNavigation } from "@/components/Layout/MobileNavigation";

const HallGloria = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HallGloriaContent />
      </div>
      <MobileNavigation />
    </Layout>
  );
};

export default HallGloria;