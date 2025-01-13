import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CompositionCardProps {
  id: number;
  title: string;
  section_title: string;
  collection?: string;
}

const CompositionCard = ({
  id,
  title,
  section_title,
  collection,
}: CompositionCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (collection) {
      navigate(`/composition/${collection}/section/${id}`);
    }
  };

  return (
    <Card
      className="bg-[#1A1F2C] text-white border-none mb-6 cursor-pointer transition-all hover:bg-[#252A37]"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-serif">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-lg">
          {section_title}
        </p>
      </CardContent>
    </Card>
  );
};

export default CompositionCard;