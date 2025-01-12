import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const SectionsPage = () => {
  const { compositionId } = useParams();
  const navigate = useNavigate();

  const sections = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Section ${i + 1}`,
  }));

  return (
    <div className="min-h-screen bg-[#0F1218] text-white">
      <header className="py-6 px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-white" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-serif">Corporate Veil</h1>
        </div>
        <Button 
          variant="ghost" 
          className="text-white" 
          onClick={() => navigate("/")}
        >
          <Home className="w-6 h-6" />
        </Button>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-serif mb-4">Composition {compositionId}</h1>
          <p className="text-xl text-gray-300">
            Description for Composition {compositionId}. This is a placeholder description that outlines
            the main themes and topics covered in this composition.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              className="w-full text-left p-6 bg-[#1A1F2C] hover:bg-[#222632] rounded-lg text-xl font-serif"
              onClick={() => navigate(`/composition/${compositionId}/section/${section.id}`)}
            >
              {section.title}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SectionsPage;