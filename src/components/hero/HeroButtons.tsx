import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-8 p-8 backdrop-blur-sm bg-black/20 rounded-xl shadow-2xl">
        <Button
          variant="ghost"
          className="group relative h-32 overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-300"
          onClick={() => navigate("/composition/memorandum")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 group-hover:opacity-75 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <span className="text-xl font-serif">Memorandum and Manifestation</span>
            <span className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
              Explore the documentation
            </span>
          </div>
        </Button>
        
        <Button
          variant="ghost"
          className="group relative h-32 overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-300"
          onClick={() => navigate("/composition/corrective")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-600/20 group-hover:opacity-75 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <span className="text-xl font-serif">Corrective Measures</span>
            <span className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
              Review correction protocols
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};