import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-center gap-4">
      <Button
        variant="outline"
        className="min-w-[120px] bg-white text-[#1A1F2C] hover:bg-gray-100 transition-colors py-6 text-lg font-medium"
        onClick={() => navigate("/composition/memorandum")}
      >
        Law
      </Button>
      
      <Button
        variant="outline"
        className="min-w-[120px] bg-transparent border-white text-white hover:bg-white/10 transition-colors py-6 text-lg font-medium"
        onClick={() => navigate("/composition/corrective")}
      >
        Philosophy
      </Button>
    </div>
  );
};