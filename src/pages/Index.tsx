import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/hero/HeroSection";
import { IndivisibilitySection } from "@/components/sections/IndivisibilitySection";
import { FeaturedWorkSection } from "@/components/sections/FeaturedWorkSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex flex-col">
      <Header />

      <main className="flex-grow">
        <HeroSection />
        <div className="container mx-auto px-4">
          <IndivisibilitySection />
          <FeaturedWorkSection />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;