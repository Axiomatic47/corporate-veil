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
    <div className="fixed top-16 left-0 bottom-0 z-50">
      {/* Vertical Line and Toggle */}
      <div
        className={cn(
          "absolute top-0 bottom-0 w-1 transition-transform duration-300",
          isSidebarOpen ? "translate-x-64" : "translate-x-0"
        )}
        style={{ background: 'rgba(255, 255, 255, 0.2)' }}
      />

      {/* Toggle Button */}
      <div
        className={cn(
          "absolute top-32 transition-transform duration-300",
          isSidebarOpen ? "translate-x-64" : "translate-x-0"
        )}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "flex items-center justify-center",
            "w-7 h-16 -ml-px",
            "bg-white/30 hover:bg-white/40",
            "rounded-r-md",
            "transition-colors duration-200"
          )}
        >
          {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <div
        className={cn(
          "absolute top-0 left-0 w-64 h-full",
          "bg-black/80 backdrop-blur-md",
          "border-r border-white/10",
          "transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MobileNavigation;