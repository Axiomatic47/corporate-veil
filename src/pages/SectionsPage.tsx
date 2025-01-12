import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const SectionsPage = () => {
  const { compositionId } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app this would come from an API
  const compositions = [
    {
      id: 1,
      title: "Foundations of Metaphysics",
      description: "An exploration of fundamental metaphysical principles",
    },
    {
      id: 2,
      title: "Composition 1",
      description: "Description for Composition 1. This is a placeholder description that outlines the main themes and topics covered in this composition.",
    },
    {
      id: 3,
      title: "Composition 2",
      description: "Description for Composition 2. This is a placeholder description that outlines the main themes and topics covered in this composition.",
    },
    {
      id: 4,
      title: "Composition 3",
      description: "Description for Composition 3. This is a placeholder description that outlines the main themes and topics covered in this composition.",
    },
  ];

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
            Delve into metaphysics, ethics, and epistemology
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