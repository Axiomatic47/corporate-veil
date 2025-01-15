// src/pages/Partners.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { cn } from "@/lib/utils";

const BlurPanel = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative rounded-lg p-8 sm:p-12",
        "backdrop-blur-md bg-black/80",
        "border border-white/10",
        "shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
};

const Partners = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 flex-grow">
        <BlurPanel>
          <Button
            variant="ghost"
            className="text-white mb-8 hover:bg-white/10"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </Button>

          <h1 className="text-4xl font-serif mb-8 text-white drop-shadow-lg">Our Partners</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg bg-black/50 border border-white/20">
              <h2 className="text-2xl mb-4 text-white drop-shadow">Academic Partners</h2>
              <p className="text-gray-300">
                We collaborate with leading universities and research institutions to advance the understanding of corporate law and constitutional rights.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-black/50 border border-white/20">
              <h2 className="text-2xl mb-4 text-white drop-shadow">Legal Organizations</h2>
              <p className="text-gray-300">
                Our partnerships with legal organizations help ensure our content reflects current legal practices and interpretations.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-black/50 border border-white/20">
              <h2 className="text-2xl mb-4 text-white drop-shadow">Corporate Sponsors</h2>
              <p className="text-gray-300">
                We work with forward-thinking corporations committed to understanding and improving corporate citizenship.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-black/50 border border-white/20">
              <h2 className="text-2xl mb-4 text-white drop-shadow">Non-Profit Organizations</h2>
              <p className="text-gray-300">
                Our non-profit partners help us maintain a balanced perspective on corporate rights and responsibilities.
              </p>
            </div>
          </div>
        </BlurPanel>
      </div>
    </PageLayout>
  );
};

export default Partners;