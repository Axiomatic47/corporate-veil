import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";

// Mock data for sections
const mockSections = [
  {
    id: 1,
    title: "Introduction to Corporate Personhood",
    content: "This section explores the fundamental concepts of corporate personhood and its historical development in constitutional law..."
  },
  {
    id: 2,
    title: "Legal Framework and Precedents",
    content: "An examination of key legal cases and precedents that have shaped the current understanding of corporate rights..."
  },
  {
    id: 3,
    title: "Constitutional Implications",
    content: "Analysis of how corporate personhood affects constitutional interpretations and citizen rights..."
  },
  {
    id: 4,
    title: "Modern Applications",
    content: "Current applications and challenges of corporate personhood in contemporary legal contexts..."
  }
];

const CompositionPage = () => {
  const { compositionId = "", sectionId = "1" } = useParams();
  const [literacyLevel, setLiteracyLevel] = useState(3);
  const [currentSection, setCurrentSection] = useState(parseInt(sectionId));
  const { toast } = useToast();

  const handleSectionChange = (sectionId: number) => {
    setCurrentSection(sectionId);
    toast({
      title: "Section Changed",
      description: `Viewing section ${sectionId}`,
    });
  };

  const handleLiteracyChange = (value: number[]) => {
    setLiteracyLevel(value[0]);
    toast({
      title: "Reading Level Updated",
      description: `Reading level set to ${value[0]}`,
    });
  };

  const currentSectionData = mockSections.find(section => section.id === currentSection) || mockSections[0];

  return (
    <div className="min-h-screen bg-[#0F1218]">
      <Header />
      <div className="flex">
        <div className="w-64 min-h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-sidebar-foreground mb-1">
                {compositionId === "memorandum" ? "Memorandum and Manifestation" : "Corrective Measures"}
              </h2>
              <p className="text-sm text-sidebar-foreground/60">
                Understanding Corporate Personhood
              </p>
            </div>
            <nav className="space-y-2">
              {mockSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    section.id === currentSection
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="flex-1 p-8 text-white">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-serif mb-4">{currentSectionData.title}</h1>
              
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-sm text-gray-300">Reading Level:</span>
                <Slider
                  value={[literacyLevel]}
                  max={5}
                  min={1}
                  step={1}
                  onValueChange={handleLiteracyChange}
                  className="w-48"
                />
                <span className="text-sm text-gray-300">{literacyLevel}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed">
                {currentSectionData.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompositionPage;