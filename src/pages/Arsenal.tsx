import { Layout } from "@/components/Layout/Layout";
import { ArsenalContent } from "@/components/Dashboard/Arsenal";
import { MobileNavigation } from "@/components/Layout/MobileNavigation";

const Arsenal = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ArsenalContent />
      </div>
      <MobileNavigation />
    </Layout>
  );
};

export default Arsenal;