import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useCompositionStore } from "@/utils/compositionData";
import { PageLayout } from "@/components/PageLayout";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const SectionPage = () => {
  const { compositionId = "", compositionIndex = "1", sectionId = "1" } = useParams();
  const [literacyLevel, setLiteracyLevel] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { memorandum, corrective, refreshCompositions } = useCompositionStore();
  const isMobile = useIsMobile();

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
  const currentComposition = compositions[parseInt(compositionIndex) - 1];
  const currentSection = currentComposition?.sections?.[parseInt(sectionId) - 1];

  const handleSectionChange = (newSectionId: number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    if (isMobile) {
      setIsSidebarOpen(false);
    }

    setTimeout(() => {
      navigate(`/composition/${compositionId}/composition/${compositionIndex}/section/${newSectionId}`);
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
      <PageLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="backdrop-blur-md bg-black/40 rounded-lg p-8 border border-white/10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl mb-4 text-white drop-shadow-lg">Section Not Found</h1>
              <button
                onClick={() => navigate(`/composition/${compositionId}`)}
                className="text-blue-400 hover:text-blue-300"
              >
                Return to Composition List
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Mobile Pull Tab */}
      {isMobile && (
        <div
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "fixed z-[100] top-16 h-[calc(100vh-64px)]",
            "transition-all duration-200",
            isSidebarOpen ? "left-[256px]" : "left-0"
          )}
        >
          <div className="h-full w-1 bg-white/30" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-6">
            <div className={cn(
              "flex items-center justify-center",
              "w-7 h-16",
              "bg-white/30",
              "rounded-r-md",
              "-ml-px",
              "transition-colors duration-200",
              "hover:bg-white/40"
            )}>
              <div className="text-white">
                {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div
          className={cn(
            "w-64 min-h-screen bg-black/80 border-r border-white/10",
            "backdrop-blur-md z-40 transition-all duration-300",
            isMobile ? (isSidebarOpen ? "fixed left-0 top-16" : "fixed -left-64 top-16") : ""
          )}
        >
          {/* Navigation container */}
          <div className="sticky top-0">
            {/* Header section */}
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-serif text-white drop-shadow-lg mb-1">
                  {compositionId === "memorandum" ? "Memorandum and Manifestation" : "Corrective Measures"}
                </h2>
                <h3 className="text-sm text-gray-200">{currentComposition.title}</h3>
              </div>

              {/* Navigation links */}
              <nav className="space-y-2">
                {currentComposition.sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => handleSectionChange(index + 1)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      index + 1 === parseInt(sectionId)
                        ? "bg-white/20 text-white font-medium backdrop-blur-md"
                        : "text-gray-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={cn(
          "flex-1 p-8",
          isMobile && isSidebarOpen ? "ml-64" : ""
        )}>
          <div className="max-w-3xl mx-auto backdrop-blur-md bg-black/80 p-8 rounded-lg border border-white/10">
            <div className="mb-8">
              <h1 className="text-3xl font-serif mb-4 text-white drop-shadow-lg leading-snug text-center">
                {currentSection.title}
              </h1>

              <div className="flex items-center space-x-4 mb-8 bg-black/40 p-4 rounded-lg backdrop-blur-sm">
                <span className="text-sm text-gray-200">Reading Level:</span>
                <Slider
                  value={[literacyLevel]}
                  max={5}
                  min={1}
                  step={2}
                  onValueChange={handleLiteracyChange}
                  className="w-48"
                />
                <span className="text-sm text-gray-200">{literacyLevel}</span>
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-serif mb-6 text-white drop-shadow-lg" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-serif mb-4 text-white drop-shadow-lg" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-serif mb-3 text-white drop-shadow-lg" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-200 drop-shadow" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-gray-200" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-gray-200" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2 text-gray-200" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-white/20 pl-4 italic my-4 text-gray-200 backdrop-blur-sm bg-black/40 p-4 rounded-r-lg" {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
                  ),
                  em: ({node, ...props}) => <em className="italic text-gray-200" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-white drop-shadow" {...props} />,
                  code: ({node, inline, ...props}) =>
                    inline ? (
                      <code className="bg-black/50 px-1 rounded text-sm backdrop-blur-sm" {...props} />
                    ) : (
                      <code className="block bg-black/50 p-4 rounded text-sm overflow-x-auto backdrop-blur-sm" {...props} />
                    ),
                }}
              >
                {getContentForLevel()}
              </ReactMarkdown>

              {/* Section Navigation */}
              <div className="mt-12 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleSectionChange(parseInt(sectionId) - 1)}
                    className={cn(
                      "px-4 py-2 flex items-center space-x-2 rounded-lg",
                      "backdrop-blur-md bg-black/40 border border-white/10",
                      "transition-all duration-200",
                      "text-gray-200 hover:bg-black/60",
                      parseInt(sectionId) <= 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                    )}
                    disabled={parseInt(sectionId) <= 1}
                  >
                    <span>←</span>
                    <span>Previous Section</span>
                  </button>

                  <div className="text-gray-200">
                    Section {sectionId} of {currentComposition.sections.length}
                  </div>

                  <button
                    onClick={() => handleSectionChange(parseInt(sectionId) + 1)}
                    className={cn(
                      "px-4 py-2 flex items-center space-x-2 rounded-lg",
                      "backdrop-blur-md bg-black/40 border border-white/10",
                      "transition-all duration-200",
                      "text-gray-200 hover:bg-black/60",
                      parseInt(sectionId) >= currentComposition.sections.length ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                    )}
                    disabled={parseInt(sectionId) >= currentComposition.sections.length}
                  >
                    <span>Next Section</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SectionPage;