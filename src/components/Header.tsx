// src/components/Header.tsx

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-white/10 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4 px-8">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-serif text-white hover:text-gray-300 transition-colors drop-shadow-lg"
          >
            Corporate Veil
          </button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => navigate("/")}
          >
            <Home className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};