import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Home } from "lucide-react";

const CompositionPage = () => {
  const { compositionId, sectionId } = useParams();
  const navigate = useNavigate();
  const [literacyLevel, setLiteracyLevel] = useState(3);

  // This would be replaced with actual content based on the literacy level
  const getContent = (level: number) => {
    return `This is the content for Section ${sectionId} of Composition ${compositionId} at literacy level ${level}. The content would adapt based on the selected literacy level.`;
  };

  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      <header className="py-6 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-serif">Corporate Veil</h1>
        <Button variant="ghost" className="text-white" onClick={() => navigate("/")}>
          <Home className="w-6 h-6" />
        </Button>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-4">Composition {compositionId}</h1>
          <p className="text-xl text-gray-300">Section {sectionId}</p>
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
      </main>
    </div>
  );
};

export default CompositionPage;