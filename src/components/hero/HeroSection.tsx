import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-6xl font-serif mb-6 tracking-tight">
        Constitutional Philosophy Forum
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
        Explore profound legal and philosophical arguments about constitutional rights, personhood, and democracy.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="bg-white text-[#1A1F2C] hover:bg-gray-100 min-w-[120px]"
          onClick={() => navigate("/law")}
        >
          Law
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="text-white border border-white/20 hover:bg-white/10 min-w-[120px]"
          onClick={() => navigate("/philosophy")}
        >
          Philosophy
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="text-white border border-white/20 hover:bg-white/10 min-w-[120px]"
          onClick={() => navigate("/theology")}
        >
          Theology
        </Button>
      </div>
    </div>
  );
};