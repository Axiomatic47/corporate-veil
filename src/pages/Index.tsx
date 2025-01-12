import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CompositionCard from "@/components/CompositionCard";
import { Footer } from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  const featuredWorks = [
    {
      id: 1,
      title: "The Nature of Corporate Personhood",
      description: "An analysis of the fundamental principles underlying corporate personhood in constitutional law.",
      content: "This is the content for Section 1 of The Nature of Corporate Personhood at reading level 3. The content would adapt based on the selected reading level."
    },
    {
      id: 2,
      title: "Corporate Rights and Responsibilities",
      description: "Examining the balance between corporate rights and societal obligations.",
      content: "This is the content for Section 1 of Corporate Rights and Responsibilities at reading level 3. The content would adapt based on the selected reading level."
    },
    {
      id: 3,
      title: "Future of Corporate Law",
      description: "Exploring emerging trends and potential reforms in corporate constitutional law.",
      content: "This is the content for Section 1 of Future of Corporate Law at reading level 3. The content would adapt based on the selected reading level."
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex flex-col">
      <header className="py-6 px-8 flex justify-between items-center bg-[#0F1218]">
        <h1 className="text-2xl font-serif">Corporate Veil</h1>
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-[#2A2F3C] px-6"
            onClick={() => navigate("/composition/memorandum")}
          >
            Memorandum and Manifestation
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-[#2A2F3C] px-6"
            onClick={() => navigate("/composition/corrective")}
          >
            Corrective Measures
          </Button>
          <Button variant="ghost" className="text-white">
            <Home className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif mb-6">
            A Constitutional Analysis of Corporate Personhood
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the legal framework and implications of corporate personhood in constitutional law.
          </p>
        </div>

        <section className="mt-24">
          <h2 className="text-4xl font-serif mb-12">Featured Work</h2>
          <div className="grid gap-8">
            {featuredWorks.map((work) => (
              <CompositionCard
                key={work.id}
                id={work.id}
                title={work.title}
                description={work.description}
                literacyLevel={3}
                onLiteracyChange={() => {}}
                content={work.content}
                showSlider={false}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;