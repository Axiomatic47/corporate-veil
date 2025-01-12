import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface CompositionCardProps {
  title: string;
  description: string;
  onReadMore: () => void;
  literacyLevel: number;
  onLiteracyChange: (value: number[]) => void;
}

const CompositionCard = ({
  title,
  description,
  onReadMore,
  literacyLevel,
  onLiteracyChange,
}: CompositionCardProps) => {
  return (
    <Card className="bg-[#1A1F2C] text-white border-none mb-6">
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
          />
          <span className="text-sm text-gray-300">{literacyLevel}</span>
        </div>
        <Button
          onClick={onReadMore}
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-white hover:text-[#1A1F2C]"
        >
          Read More
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompositionCard;