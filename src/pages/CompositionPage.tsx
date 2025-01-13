import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useCompositionStore } from "@/utils/compositionData";

const CompositionPage: React.FC = () => {
  const { compositionId = "", sectionId = "1" } = useParams();
  const [literacyLevel, setLiteracyLevel] = useState(3);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { memorandum, corrective, refreshCompositions } = useCompositionStore();

  useEffect(() => {
    refreshCompositions();
  }, [refreshCompositions]);

  // Get sections based on composition type
  const sections = compositionId === "memorandum" ? memorandum : corrective;

  // Find current section
  const currentSection = sections.find(section => section.section === parseInt(sectionId));

  const handleLiteracyChange = (value: number[]) => {
    const nearestLevel = [1, 3, 5].reduce((prev, curr) => {
      return Math.abs(curr - value[0]) < Math.abs(prev - value[0]) ? curr : prev;
    });

    setLiteracyLevel(nearestLevel);
    toast({
      title: "Reading Level Updated",
      description: `Reading level set to ${nearestLevel}`,
    });
  };

  const getContentForLevel = () => {
    if (!currentSection) return "";

    switch (literacyLevel) {
      case 1:
        return currentSection.content_level_1;
      case 3:
        return currentSection.content_level_3;
      case 5:
        return currentSection.content_level_5;
      default:
        return currentSection.content_level_3;
    }
  };

  if (!currentSection) {
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
    <div className="min-h-screen bg-[#0F1218]">
      <Header />
      <div className="flex">
        <div className="w-64 min-h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-sidebar-foreground mb-1">
                {currentSection.title}
              </h2>
              <p className="text-sm text-sidebar-foreground/60">
                {currentSection.description}
              </p>
            </div>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.section}
                  onClick={() => {
                    navigate(`/composition/${compositionId}/section/${section.section}`);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    section.section === parseInt(sectionId)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {section.section_title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 p-8 text-white">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-serif mb-4">{currentSection.section_title}</h1>

              <div className="flex items-center space-x-4 mb-8">
                <span className="text-sm text-gray-300">Reading Level:</span>
                <Slider
                  value={[literacyLevel]}
                  max={5}
                  min={1}
                  step={2}
                  onValueChange={handleLiteracyChange}
                  className="w-48"
                />
                <span className="text-sm text-gray-300">{literacyLevel}</span>
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-serif mb-6" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-serif mb-4" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-serif mb-3" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
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