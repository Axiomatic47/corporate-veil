import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useCompositionStore } from "@/utils/compositionData";

const CompositionPage = () => {
  const { compositionId = "", sectionId = "1" } = useParams();
  const [literacyLevel, setLiteracyLevel] = useState(3);
  const { memorandum, corrective } = useCompositionStore();

  // Get the appropriate collection based on compositionId
  const compositions = compositionId === "memorandum" ? memorandum : corrective;

  // Find the composition that matches the current section
  const currentComposition = compositions.find(
    comp => comp.section === parseInt(sectionId)
  );

  // Get only the sections that exist in the compositions
  const existingSections = compositions
    .map(comp => ({
      id: comp.section,
      title: `Section ${comp.section}`
    }))
    .sort((a, b) => a.id - b.id);

  const getCollectionName = () => {
    return compositionId === "memorandum" ? "Memorandum and Manifestation" : "Corrective Measures";
  };

  return (
    <div className="min-h-screen bg-[#0F1218]">
      <Header />
      <div className="flex">
        <Sidebar
          sections={existingSections}
          collectionName={getCollectionName()}
          compositionId={compositionId}
          currentSectionId={sectionId}
        />
        <div className="flex-1 p-8 text-white">
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-gray-300 mb-2">{getCollectionName()}</h2>
            <h1 className="text-4xl font-serif mb-2">{currentComposition?.title || "Untitled"}</h1>
            <h3 className="text-3xl font-serif text-gray-300">Section {sectionId}</h3>
          </div>

          <div className="mb-8 flex items-center space-x-4">
            <span className="text-sm text-gray-300">Reading Level:</span>
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
            <p className="text-lg leading-relaxed">
              {currentComposition?.content || `No content available for Section ${sectionId}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompositionPage;