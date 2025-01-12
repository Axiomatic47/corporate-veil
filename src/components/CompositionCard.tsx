import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface CompositionCardProps {
  id: number;
  title: string;
  description: string;
  literacyLevel: number;
  onLiteracyChange: (value: number[]) => void;
  content?: string;
}

const CompositionCard = ({
  id,
  title,
  description,
  literacyLevel,
  onLiteracyChange,
  content,
}: CompositionCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/composition/${id}`);
  };

  return (
    <Card 
      className="bg-[#1A1F2C] text-white border-none mb-6 cursor-pointer transition-all hover:bg-[#252A37]"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-serif">{title}</CardTitle>
        <CardDescription className="text-gray-300">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">Literacy Level:</span>
          <Slider
            defaultValue={[literacyLevel]}
            max={5}
            min={1}
            step={1}
            onValueChange={onLiteracyChange}
            className="w-48"
            onClick={(e) => e.stopPropagation()} // Prevent card click when adjusting slider
          />
          <span className="text-sm text-gray-300">{literacyLevel}</span>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 line-clamp-3">
            {content || `This is the content for Section 1 of ${title} at literacy level ${literacyLevel}. The content would adapt based on the selected literacy level.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompositionCard;