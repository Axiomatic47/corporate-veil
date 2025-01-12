import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroButtons } from "@/components/hero/HeroButtons";
import { IndivisibilitySection } from "@/components/sections/IndivisibilitySection";
import { FeaturedWorkSection } from "@/components/sections/FeaturedWorkSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-16 flex-grow">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif mb-8">
            A Constitutional Analysis of Corporate Personhood
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16">
            Explore the legal framework and implications of corporate personhood in constitutional law.
          </p>
          
          <HeroButtons />
        </div>

        <IndivisibilitySection />
        <FeaturedWorkSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;