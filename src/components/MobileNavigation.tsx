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
      {/* Vertical Bar */}
      <div className="fixed inset-y-16 left-0 w-1 bg-white/20 z-40" />

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={cn(
          "fixed z-50 left-0 top-1/2 -translate-y-1/2",
          "transition-transform duration-300",
          isSidebarOpen && "translate-x-64"
        )}
      >
        <div className="relative flex items-center">
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
        </div>
      </button>

      {/* Navigation Panel */}
      <div
        className={cn(
          "fixed top-16 left-0 w-64 h-[calc(100vh-4rem)]",
          "bg-black/80 backdrop-blur-md",
          "border-r border-white/10",
          "z-40 transition-transform duration-300",
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
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default MobileNavigation;