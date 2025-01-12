import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-center gap-6">
      <Button
        variant="outline"
        className="min-w-[180px] bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 py-7 text-lg font-medium rounded-lg shadow-lg"
        onClick={() => navigate("/composition/memorandum")}
      >
        Law
      </Button>
      
      <Button
        variant="outline"
        className="min-w-[180px] bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 py-7 text-lg font-medium rounded-lg shadow-lg"
        onClick={() => navigate("/composition/corrective")}
      >
        Philosophy
      </Button>
    </div>
  );
};