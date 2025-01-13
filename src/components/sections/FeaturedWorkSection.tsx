import { useEffect, useState } from "react";
import { useCompositionStore } from "@/utils/compositionData";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export const FeaturedWorkSection = () => {
  const { memorandum, corrective, initialized, refreshCompositions } = useCompositionStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!initialized) {
          await refreshCompositions();
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading composition data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [initialized, refreshCompositions]);

  if (isLoading) {
    return (
      <div className="mt-32">
        <h2 className="text-4xl font-serif mb-12">Featured Content</h2>
        <div className="text-gray-400">Loading featured sections...</div>
      </div>
    );
  }

  // Filter featured sections directly
  const featuredSections = [
    ...memorandum.filter(section => section.featured),
    ...corrective.filter(section => section.featured)
  ];

  if (featuredSections.length === 0) {
    return null;
  }

  return (
    <section className="mt-32">
      <h2 className="text-4xl font-serif mb-12">Featured Content</h2>
      <div className="space-y-24">
        {featuredSections.map((section) => (
          <div key={`${section.collection_type}-${section.id}`} className="prose prose-invert prose-lg max-w-none">
            <h3 className="text-3xl font-serif mb-6">{section.section_title}</h3>
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
              {section.content_level_3}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedWorkSection;