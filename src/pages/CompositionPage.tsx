import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Home } from "lucide-react";

const CompositionPage = () => {
  const { compositionId, sectionId } = useParams();
  const navigate = useNavigate();
  const [literacyLevel, setLiteracyLevel] = useState(3);

  // Mock sections data - in a real app this would come from an API
  const sections = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Section ${i + 1}`,
  }));

  // Get collection name based on the ID
  const getCollectionName = () => {
    return compositionId === "memorandum" ? "Memorandum and Manifestation" : "Corrective Measures";
  };

  // Get composition title based on the ID and section
  const getCompositionTitle = () => {
    if (compositionId === "memorandum") {
      const memorandumTitles = [
        "The Nature of Corporate Personhood",
        "Legal Rights and Responsibilities",
        "Historical Evolution",
        "Constitutional Implications"
      ];
      return memorandumTitles[0]; // For now returning first title, in real app would be based on actual composition
    } else {
      const correctiveTitles = [
        "Reform Proposals",
        "Regulatory Framework",
        "Accountability Measures",
        "Future Directions"
      ];
      return correctiveTitles[0];
    }
  };

  // This would be replaced with actual content based on the literacy level
  const getContent = (level: number) => {
    return `This is the content for Section ${sectionId} of ${getCompositionTitle()} at literacy level ${level}. The content would adapt based on the selected literacy level.`;
  };

  return (
    <div className="min-h-screen bg-[#0F1218]">
      {/* Header */}
      <header className="w-full bg-[#1A1F2C] py-4 px-8 flex justify-between items-center border-b border-[#2A2F3C]">
        <button 
          onClick={() => navigate("/")} 
          className="text-2xl font-serif text-white hover:text-gray-300 transition-colors"
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

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-[calc(100vh-4rem)] bg-[#1A1F2C] text-white p-6">
          <h2 className="text-xl font-serif mb-6">{getCollectionName()}</h2>
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  navigate(`/composition/${compositionId}/section/${section.id}`)
                }
                className={`w-full text-left py-2 px-4 rounded transition-colors ${
                  Number(sectionId) === section.id
                    ? "bg-white text-[#1A1F2C] font-medium"
                    : "text-gray-300 hover:bg-[#2A2F3C] hover:text-white"
                }`}
              >
                Section {section.id}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 text-white">
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-gray-300 mb-2">{getCollectionName()}</h2>
            <h1 className="text-4xl font-serif mb-2">{getCompositionTitle()}</h1>
            <h3 className="text-3xl font-serif text-gray-300">Section {sectionId}</h3>
          </div>

          <div className="mb-8 flex items-center space-x-4">
            <span className="text-sm text-gray-300">Literacy Level:</span>
            <Slider
              defaultValue={[literacyLevel]}
              max={5}
              min={1}
              step={1}
              onValueChange={(value) => setLiteracyLevel(value[0])}
              className="w-48"
            />
            <span className="text-sm text-gray-300">{literacyLevel}</span>
          </div>

          <div className="bg-[#1A1F2C] rounded-lg p-8">
            <p className="text-lg leading-relaxed">{getContent(literacyLevel)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompositionPage;