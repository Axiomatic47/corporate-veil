import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

// Mock data with different reading levels
const mockSectionsData = {
  1: [ // Basic reading level
    {
      id: 1,
      title: "What is a Company?",
      content: "A company is like a group of people working together. They make things or help people. Companies are special because the law treats them almost like real people."
    },
    {
      id: 2,
      title: "Company Rules",
      content: "Companies must follow rules. These rules help keep everything fair. The rules say what companies can and cannot do."
    },
    {
      id: 3,
      title: "Company Money",
      content: "Companies make and spend money. They keep track of all their money. This helps them make good choices about what to do."
    },
    {
      id: 4,
      title: "Companies Today",
      content: "Today, companies are everywhere. They make the things we use. They give people jobs. They help make our world work better."
    }
  ],
  3: [ // Intermediate reading level
    {
      id: 1,
      title: "Introduction to Corporate Personhood",
      content: "Corporate personhood is a legal concept that gives companies certain rights and responsibilities. This means companies can own property, make contracts, and be held accountable for their actions."
    },
    {
      id: 2,
      title: "Legal Framework and Precedents",
      content: "The legal system has established important rules and examples that shape how companies operate. These precedents help guide business practices and corporate responsibilities."
    },
    {
      id: 3,
      title: "Financial Implications",
      content: "Companies must manage their finances responsibly while considering various stakeholders. This includes proper accounting, investment decisions, and resource allocation."
    },
    {
      id: 4,
      title: "Modern Corporate Landscape",
      content: "Today's corporate environment is complex and interconnected. Companies must navigate various challenges while maintaining ethical practices and sustainable growth."
    }
  ],
  5: [ // Advanced reading level
    {
      id: 1,
      title: "Theoretical Foundations of Corporate Personhood",
      content: "The doctrine of corporate personhood encompasses complex legal and philosophical principles regarding the attribution of rights, responsibilities, and legal standing to corporate entities within constitutional frameworks."
    },
    {
      id: 2,
      title: "Jurisprudential Evolution and Legislative Framework",
      content: "The development of corporate law through judicial interpretation and legislative action has established sophisticated precedents governing corporate conduct, liability, and stakeholder relationships."
    },
    {
      id: 3,
      title: "Fiscal Policy and Corporate Governance",
      content: "Contemporary corporate governance necessitates sophisticated financial management strategies, incorporating stakeholder theory, agency considerations, and sustainable business practices."
    },
    {
      id: 4,
      title: "Contemporary Corporate Paradigms",
      content: "Modern corporate entities operate within an intricate ecosystem of regulatory requirements, market forces, and societal expectations, necessitating adaptive strategies and robust governance frameworks."
    }
  ]
};

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

  // Get the closest reading level (1, 3, or 5)
  const getClosestReadingLevel = (level: number) => {
    if (level <= 2) return 1;
    if (level >= 4) return 5;
    return 3;
  };

  const currentReadingLevel = getClosestReadingLevel(literacyLevel);
  const currentSections = mockSectionsData[currentReadingLevel];
  const currentSectionData = currentSections.find(section => section.id === currentSection) || currentSections[0];

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
              {currentSections.map((section) => (
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