import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";

const Donate = () => {
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
        
        <h1 className="text-4xl font-serif mb-8">Support Our Work</h1>
        
        <div className="max-w-3xl space-y-8">
          <p className="text-xl text-gray-300">
            Your donation helps us continue our mission of making corporate law and constitutional rights accessible to everyone.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-32 text-xl hover:bg-[#2A2F3C]"
              onClick={() => console.log("$10 donation")}
            >
              $10
              <span className="block text-sm text-gray-400">One-time</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-32 text-xl hover:bg-[#2A2F3C]"
              onClick={() => console.log("$25 donation")}
            >
              $25
              <span className="block text-sm text-gray-400">One-time</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-32 text-xl hover:bg-[#2A2F3C]"
              onClick={() => console.log("$50 donation")}
            >
              $50
              <span className="block text-sm text-gray-400">One-time</span>
            </Button>
          </div>
          
          <div className="bg-[#2A2F3C] p-6 rounded-lg mt-8">
            <h2 className="text-2xl mb-4">Other Ways to Support</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Become a monthly donor</li>
              <li>Corporate matching programs</li>
              <li>Legacy giving</li>
              <li>In-kind donations</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Donate;