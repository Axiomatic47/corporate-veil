import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const SectionsPage = () => {
  const { compositionId } = useParams();
  const navigate = useNavigate();

  // Mock data for Memorandum and Manifestation
  const memorandumCompositions = [
    {
      id: 1,
      title: "The Nature of Corporate Personhood",
      description: "An exploration of fundamental principles underlying corporate personhood in constitutional law.",
    },
    {
      id: 2,
      title: "Legal Rights and Responsibilities",
      description: "Understanding the balance between corporate rights and their corresponding obligations to society.",
    },
    {
      id: 3,
      title: "Historical Evolution",
      description: "Tracing the development of corporate personhood through significant legal precedents and societal changes.",
    },
    {
      id: 4,
      title: "Constitutional Implications",
      description: "Analyzing the impact of corporate personhood on constitutional interpretation and application.",
    },
  ];

  // Mock data for Corrective Measures
  const correctiveCompositions = [
    {
      id: 1,
      title: "Reform Proposals",
      description: "Examining contemporary proposals for reforming corporate constitutional rights and responsibilities.",
    },
    {
      id: 2,
      title: "Regulatory Framework",
      description: "Analysis of current regulatory mechanisms and their effectiveness in corporate governance.",
    },
    {
      id: 3,
      title: "Accountability Measures",
      description: "Exploring methods to enhance corporate accountability and transparency.",
    },
    {
      id: 4,
      title: "Future Directions",
      description: "Investigating emerging trends and potential future developments in corporate law reform.",
    },
  ];

  // Select the appropriate compositions based on the route
  const compositions = compositionId === "memorandum" 
    ? memorandumCompositions 
    : correctiveCompositions;

  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      {/* Header */}
      <header className="w-full bg-[#1A1F2C] py-4 px-8 flex justify-between items-center border-b border-[#2A2F3C]">
        <button 
          onClick={() => navigate("/")} 
          className="text-2xl font-serif hover:text-gray-300 transition-colors"
        >
          Corporate Veil
        </button>
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
          <Button 
            variant="ghost" 
            className="text-white hover:bg-[#2A2F3C]"
            onClick={() => navigate("/")}
          >
            <Home className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif mb-6">
            {compositionId === "memorandum" ? "Memorandum and Manifestation" : "Corrective Measures"}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {compositionId === "memorandum" 
              ? "Explore the fundamental principles and implications of corporate personhood in constitutional law"
              : "Examine contemporary approaches to corporate law reform and accountability"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {compositions.map((composition) => (
            <div
              key={composition.id}
              className="bg-[#1A1F2C] rounded-lg p-8 border border-[#2A2F3C]"
            >
              <h2 className="text-2xl font-serif mb-4">{composition.title}</h2>
              <p className="text-gray-300 mb-6">{composition.description}</p>
              <Button
                onClick={() => navigate(`/composition/${compositionId}/section/1`)}
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#1A1F2C]"
              >
                Read More
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SectionsPage;