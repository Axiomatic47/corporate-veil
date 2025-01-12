import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const featuredWorks = [
    {
      id: 1,
      title: "The Nature of Corporate Personhood",
      description: "An analysis of the fundamental principles underlying corporate personhood in constitutional law.",
    },
    {
      id: 2,
      title: "Corporate Rights and Responsibilities",
      description: "Examining the balance between corporate rights and societal obligations.",
    },
    {
      id: 3,
      title: "Future of Corporate Law",
      description: "Exploring emerging trends and potential reforms in corporate constitutional law.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
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

      <main className="container mx-auto px-4 py-12">
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
              <div
                key={work.id}
                onClick={() => navigate(`/composition/memorandum/section/1`)}
                className="bg-[#1A1F2C] rounded-lg p-8 border border-[#2A2F3C] cursor-pointer transition-all hover:bg-[#252A37]"
              >
                <h2 className="text-2xl font-serif mb-4">{work.title}</h2>
                <p className="text-gray-300 mb-6">{work.description}</p>
                <p className="text-gray-300 line-clamp-3">
                  This composition explores the fundamental principles of corporate personhood, examining how legal frameworks have evolved to grant corporations certain constitutional rights while balancing these with societal responsibilities.
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;