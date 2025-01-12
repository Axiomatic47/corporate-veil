import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-4">
      <Button
        variant="ghost"
        className="group relative h-12 px-6 overflow-hidden rounded-lg bg-gradient-to-br from-[#9b87f5]/20 to-[#D6BCFA]/20 hover:from-[#9b87f5]/30 hover:to-[#D6BCFA]/30 border border-[#9b87f5]/20 hover:border-[#9b87f5]/40 transition-all duration-300"
        onClick={() => navigate("/composition/memorandum")}
      >
        <span className="text-base font-serif text-[#1A1F2C]">Memorandum</span>
      </Button>
      
      <Button
        variant="ghost"
        className="group relative h-12 px-6 overflow-hidden rounded-lg bg-gradient-to-br from-[#D6BCFA]/20 to-[#9b87f5]/20 hover:from-[#D6BCFA]/30 hover:to-[#9b87f5]/30 border border-[#9b87f5]/20 hover:border-[#9b87f5]/40 transition-all duration-300"
        onClick={() => navigate("/composition/corrective")}
      >
        <span className="text-base font-serif text-[#1A1F2C]">Corrective</span>
      </Button>
    </div>
  );
};