// src/pages/SectionsPage.tsx

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useCompositionStore } from "@/utils/compositionData";

const SectionsPage = () => {
  const { compositionId } = useParams();
  const navigate = useNavigate();
  const { memorandum, corrective, refreshCompositions } = useCompositionStore();

  useEffect(() => {
    refreshCompositions();
  }, []);

  const compositions = compositionId === "memorandum" ? memorandum : corrective;
  const collectionTitle = compositionId === "memorandum"
    ? "Memorandum and Manifestation"
    : "Corrective Measures";

  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif mb-6">{collectionTitle}</h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {compositions.map(composition => (
            <div key={composition.id} className="space-y-6">
              <h2 className="text-3xl font-serif mb-4">{composition.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {composition.sections.map((section, index) => (
                  <div
                    key={index}
                    className="bg-[#1A1F2C] rounded-lg p-8 border border-[#2A2F3C] cursor-pointer transition-all hover:bg-[#252A37]"
                    onClick={() => navigate(`/composition/${compositionId}/section/${index + 1}`)}
                  >
                    <h3 className="text-xl font-serif">{section.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SectionsPage;