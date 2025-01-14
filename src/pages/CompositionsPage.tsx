import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useCompositionStore } from "@/utils/compositionData";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const CompositionsPage = () => {
  const { compositionId } = useParams();
  const navigate = useNavigate();
  const { memorandum, corrective, refreshCompositions } = useCompositionStore();

  useEffect(() => {
    refreshCompositions();
  }, [refreshCompositions]);

  const compositions = compositionId === "memorandum" ? memorandum : corrective;
  const collectionTitle = compositionId === "memorandum"
    ? "Memorandum and Manifestation"
    : "Corrective Measures";

  const getPreviewContent = (composition) => {
    if (composition.sections && composition.sections.length > 0) {
      return composition.sections[0].content_level_3;
    }
    return "";
  };

  // Function to handle composition selection
  const handleCompositionClick = (index: number) => {
    navigate(`/composition/${compositionId}/composition/${index + 1}/section/1`);
  };

  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif mb-6">{collectionTitle}</h1>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {compositions.map((composition, index) => (
            <div
              key={index}
              className="bg-[#1A1F2C] rounded-lg p-8 border border-[#2A2F3C] cursor-pointer transition-all hover:bg-[#252A37]"
              onClick={() => handleCompositionClick(index)}
            >
              <h2 className="text-3xl font-serif mb-6">{composition.title}</h2>
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  className="line-clamp-4"
                  components={{
                    p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-300" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
                  }}
                >
                  {getPreviewContent(composition)}
                </ReactMarkdown>
                <div className="mt-6">
                  <button className="text-blue-400 hover:text-blue-300 group inline-flex items-center">
                    Read More
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CompositionsPage;