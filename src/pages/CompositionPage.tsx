// src/pages/CompositionPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useCompositionStore } from "@/utils/compositionData";

const CompositionPage = () => {
  const { compositionId = "", sectionId = "1" } = useParams();
  const [literacyLevel, setLiteracyLevel] = useState(3);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { memorandum, corrective, refreshCompositions } = useCompositionStore();

  useEffect(() => {
    refreshCompositions();
  }, [refreshCompositions]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [sectionId]);

  const compositions = compositionId === "memorandum" ? memorandum : corrective;
  const currentComposition = compositions[0]; // Assuming first composition for now
  const currentSection = currentComposition?.sections?.[parseInt(sectionId) - 1];

  const handleSectionChange = (newSectionId: number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    setTimeout(() => {
      navigate(`/composition/${compositionId}/section/${newSectionId}`);
    }, 100);
  };

  const handleLiteracyChange = (value: number[]) => {
    const requestedLevel = value[0];
    const section = currentSection;

    if (section) {
      const hasContent = requestedLevel === 1 ? section.content_level_1 :
                        requestedLevel === 5 ? section.content_level_5 : true;

      const newLevel = hasContent ? requestedLevel : 3;

      setLiteracyLevel(newLevel);

      if (!hasContent) {
        toast({
          title: "Reading Level Adjusted",
          description: "Content not available at requested level, showing intermediate level instead.",
        });
      } else {
        toast({
          title: "Reading Level Updated",
          description: `Reading level set to ${newLevel}`,
        });
      }
    }
  };

  const getContentForLevel = () => {
    if (!currentSection) return "";

    switch (literacyLevel) {
      case 1:
        return currentSection.content_level_1 || currentSection.content_level_3;
      case 5:
        return currentSection.content_level_5 || currentSection.content_level_3;
      default:
        return currentSection.content_level_3;
    }
  };

  if (!currentSection || !currentComposition) {
    return (
      <div className="min-h-screen bg-[#0F1218] text-white p-8">
        <Header />
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl mb-4">Section Not Found</h1>
          <button
            onClick={() => navigate(`/composition/${compositionId}`)}
            className="text-blue-400 hover:text-blue-300"
          >
            Return to Composition List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1218] scroll-smooth">
      <Header />
      <div className="flex">
        <div className="w-64 min-h-[calc(100vh-4rem)] bg-[#1A1F2C] border-r border-[#2A2F3C]">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-serif text-gray-300 mb-1">
                {compositionId === "memorandum" ? "Memorandum and Manifestation" : "Corrective Measures"}
              </h2>
              <h3 className="text-sm text-gray-400">{currentComposition.title}</h3>
            </div>
            <nav className="space-y-2">
              {currentComposition.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => handleSectionChange(index + 1)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    index + 1 === parseInt(sectionId)
                      ? "bg-[#252A37] text-white font-medium"
                      : "text-gray-400 hover:bg-[#252A37] hover:text-white"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 p-8 text-gray-300">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-serif mb-4 text-gray-200 leading-snug">{currentSection.title}</h1>

              <div className="flex items-center space-x-4 mb-8">
                <span className="text-sm text-gray-400">Reading Level:</span>
                <Slider
                  value={[literacyLevel]}
                  max={5}
                  min={1}
                  step={2}
                  onValueChange={handleLiteracyChange}
                  className="w-48"
                />
                <span className="text-sm text-gray-400">{literacyLevel}</span>
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-serif mb-6 text-gray-200" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-serif mb-4 text-gray-200" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-serif mb-3 text-gray-200" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-300" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-gray-300" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-gray-300" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2 text-gray-300" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4 text-gray-400" {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
                  ),
                }}
              >
                {getContentForLevel()}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompositionPage;