import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";

const Partners = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <Button
          variant="ghost"
          className="text-white mb-8"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </Button>
        
        <h1 className="text-4xl font-serif mb-8">Our Partners</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#2A2F3C] p-6 rounded-lg">
            <h2 className="text-2xl mb-4">Academic Partners</h2>
            <p className="text-gray-300">
              We collaborate with leading universities and research institutions to advance the understanding of corporate law and constitutional rights.
            </p>
          </div>
          
          <div className="bg-[#2A2F3C] p-6 rounded-lg">
            <h2 className="text-2xl mb-4">Legal Organizations</h2>
            <p className="text-gray-300">
              Our partnerships with legal organizations help ensure our content reflects current legal practices and interpretations.
            </p>
          </div>
          
          <div className="bg-[#2A2F3C] p-6 rounded-lg">
            <h2 className="text-2xl mb-4">Corporate Sponsors</h2>
            <p className="text-gray-300">
              We work with forward-thinking corporations committed to understanding and improving corporate citizenship.
            </p>
          </div>
          
          <div className="bg-[#2A2F3C] p-6 rounded-lg">
            <h2 className="text-2xl mb-4">Non-Profit Organizations</h2>
            <p className="text-gray-300">
              Our non-profit partners help us maintain a balanced perspective on corporate rights and responsibilities.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Partners;