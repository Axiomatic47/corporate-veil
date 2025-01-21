import React from 'react';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";

export const useMobileNavigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobile
  };
};

interface MobileNavigationProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  children
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <div className="w-64 border-r border-white/10 bg-black/80 backdrop-blur-md">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Fixed elements container */}
      <div className="fixed inset-y-16 left-0 z-50">
        {/* Vertical Bar */}
        <div className="absolute inset-0 w-1 bg-white/20" />

        {/* Toggle Button - Always centered in viewport */}
        <div className="fixed left-0 top-1/2 -translate-y-1/2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "transition-transform duration-300",
              isSidebarOpen && "translate-x-64"
            )}
          >
            <div className={cn(
              "flex items-center justify-center",
              "w-7 h-16",
              "bg-white/30",
              "rounded-r-md",
              "-ml-px",
              "transition-colors duration-200",
              "hover:bg-white/40"
            )}>
              {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Panel - Fixed in viewport with scrollable content */}
      <div
        className={cn(
          "fixed top-16 left-0 bottom-0 w-64",
          "bg-black/80 backdrop-blur-md",
          "border-r border-white/10",
          "z-40 transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Scrollable container for navigation content */}
        <div className="h-full overflow-y-auto">
          <div className="p-6 space-y-6">
            {children}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default MobileNavigation;