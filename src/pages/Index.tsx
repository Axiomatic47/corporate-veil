import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CompositionCard from "@/components/CompositionCard";

const Index = () => {
  const [activeSection, setActiveSection] = useState("memorandum");
  const [literacyLevels, setLiteracyLevels] = useState({
    comp1: 3,
    comp2: 3,
    comp3: 3,
  });

  const handleLiteracyChange = (composition: string) => (value: number[]) => {
    setLiteracyLevels((prev) => ({
      ...prev,
      [composition]: value[0],
    }));
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {/* Header */}
      <header className="py-6 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-serif">Corporate Veil</h1>
        <Button variant="ghost" className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif mb-6">
            A Constitutional Analysis of Corporate Personhood
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the legal framework and implications of corporate personhood in constitutional law.
          </p>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => setActiveSection("memorandum")}
              variant={activeSection === "memorandum" ? "default" : "outline"}
              className="text-lg"
            >
              Memorandum and Manifestation
            </Button>
            <Button
              onClick={() => setActiveSection("corrective")}
              variant={activeSection === "corrective" ? "default" : "outline"}
              className="text-lg"
            >
              Corrective Measures
            </Button>
          </div>
        </div>

        {/* Featured Work */}
        <section className="mt-24">
          <h2 className="text-4xl font-serif mb-12">Featured Work</h2>
          <div className="grid gap-8">
            <CompositionCard
              title="The Nature of Corporate Personhood"
              description="An analysis of the fundamental principles underlying corporate personhood in constitutional law."
              onReadMore={() => console.log("Navigate to composition 1")}
              literacyLevel={literacyLevels.comp1}
              onLiteracyChange={handleLiteracyChange("comp1")}
            />
            <CompositionCard
              title="Corporate Rights and Responsibilities"
              description="Examining the balance between corporate rights and societal obligations."
              onReadMore={() => console.log("Navigate to composition 2")}
              literacyLevel={literacyLevels.comp2}
              onLiteracyChange={handleLiteracyChange("comp2")}
            />
            <CompositionCard
              title="Future of Corporate Law"
              description="Exploring emerging trends and potential reforms in corporate constitutional law."
              onReadMore={() => console.log("Navigate to composition 3")}
              literacyLevel={literacyLevels.comp3}
              onLiteracyChange={handleLiteracyChange("comp3")}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;