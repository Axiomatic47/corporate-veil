import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#0F1218] text-white py-6 mt-auto">
      <div className="container mx-auto flex justify-center space-x-4">
        <Button
          variant="ghost"
          className="text-white hover:bg-[#2A2F3C]"
          onClick={() => navigate("/contact")}
        >
          Contact
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-[#2A2F3C]"
          onClick={() => navigate("/partners")}
        >
          Partners
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-[#2A2F3C]"
          onClick={() => navigate("/donate")}
        >
          Donate
        </Button>
      </div>
    </footer>
  );
};