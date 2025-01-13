import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";

// Mock data for sections preview
const mockSectionsPreview = [
  {
    id: 1,
    title: "Introduction to Corporate Personhood",
    description: "Fundamental concepts and historical development"
  },
  {
    id: 2,
    title: "Legal Framework and Precedents",
    description: "Key cases and legal precedents"
  },
  {
    id: 3,
    title: "Constitutional Implications",
    description: "Impact on constitutional interpretations"
  },
  {
    id: 4,
    title: "Modern Applications",
    description: "Contemporary legal contexts and challenges"
  }
];

const SectionsPage = () => {
  const { compositionId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif mb-6">
            {compositionId === "memorandum" ? "Memorandum and Manifestation" : "Corrective Measures"}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {compositionId === "memorandum" 
              ? "Explore the fundamental principles and implications of corporate personhood in constitutional law"
              : "Examine contemporary approaches to corporate law reform and accountability"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockSectionsPreview.map((section) => (
            <div
              key={section.id}
              className="bg-[#1A1F2C] rounded-lg p-8 border border-[#2A2F3C] cursor-pointer transition-all hover:bg-[#252A37]"
              onClick={() => navigate(`/composition/${compositionId}/section/${section.id}`)}
            >
              <h2 className="text-2xl font-serif mb-4">{section.title}</h2>
              <p className="text-gray-300">{section.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SectionsPage;