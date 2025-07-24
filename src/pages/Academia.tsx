import { Layout } from "@/components/Layout/Layout";
import { AcademiaContent } from "@/components/Dashboard/Academia";
import { MobileNavigation } from "@/components/Layout/MobileNavigation";

const Academia = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AcademiaContent />
      </div>
      <MobileNavigation />
    </Layout>
  );
};

export default Academia;