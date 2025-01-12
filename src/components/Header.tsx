import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroButtons } from "./hero/HeroButtons";

export const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="w-full bg-[#1A1F2C] py-4 px-8 flex justify-between items-center border-b border-[#2A2F3C]">
      <div className="flex items-center gap-8">
        <button 
          onClick={() => navigate("/")} 
          className="text-2xl font-serif text-white hover:text-gray-300 transition-colors"
        >
          Corporate Veil
        </button>
        <HeroButtons />
      </div>
      <Button 
        variant="ghost" 
        className="text-white hover:bg-[#2A2F3C]"
        onClick={() => navigate("/")}
      >
        <Home className="w-6 h-6" />
      </Button>
    </header>
  );
};