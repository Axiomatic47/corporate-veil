import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

// Keep the original mock data structure
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
      content: `# The Legal Framework

The doctrine of corporate personhood encompasses complex legal and philosophical principles regarding the attribution of rights, responsibilities, and legal standing to corporate entities within constitutional frameworks.

## Historical Context

* Early development of corporate rights
* Evolution through judicial interpretation
* Modern implications and challenges

## Key Principles

1. Legal Autonomy
2. Limited Liability
3. Perpetual Existence
4. Property Rights

> "Corporate personhood represents a fundamental shift in how we understand the relationship between business entities and constitutional law."

### Impact on Modern Business

The implications of corporate personhood extend far beyond simple legal recognition...`
    },
    {
      id: 2,
      title: "Jurisprudential Evolution",
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
  const { toast } = useToast();

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

  // Get the correct section data
  const sections = mockSectionsData[literacyLevel];
  const currentSection = sections.find(section => section.id === parseInt(sectionId));

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
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    window.location.href = `/composition/${compositionId}/section/${section.id}`;
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    section.id === parseInt(sectionId)
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
              <h1 className="text-4xl font-serif mb-4">{currentSection?.title}</h1>

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
                  code: ({node, ...props}) => (
                    <code className="bg-gray-800 rounded px-1 py-0.5" {...props} />
                  ),
                  pre: ({node, ...props}) => (
                    <pre className="bg-gray-800 rounded p-4 overflow-x-auto my-4" {...props} />
                  ),
                }}
              >
                {currentSection?.content || ''}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompositionPage;