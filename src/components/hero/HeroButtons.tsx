import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-6">
      <Button
        variant="outline"
        className="group relative w-[300px] bg-gray-800/50 backdrop-blur-sm border-2 border-gray-600 text-white hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300 py-7 text-lg font-medium rounded-lg overflow-hidden"
        onClick={() => navigate("/composition/memorandum")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform group-hover:scale-105 transition-transform duration-500"/>
        <span className="relative">Memorandum and Manifestation</span>
      </Button>

      <Button
        variant="outline"
        className="group relative w-[300px] bg-gray-800/50 backdrop-blur-sm border-2 border-gray-600 text-white hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300 py-7 text-lg font-medium rounded-lg overflow-hidden"
        onClick={() => navigate("/composition/corrective")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 transform group-hover:scale-105 transition-transform duration-500"/>
        <span className="relative">Corrective Measures</span>
      </Button>
    </div>
  );
};