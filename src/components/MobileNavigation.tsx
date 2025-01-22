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
    <div className="fixed inset-0 isolate" style={{ top: '64px', touchAction: 'none', pointerEvents: 'none' }}>
      {/* Vertical Bar */}
      <div
        className="absolute inset-y-0 left-0 w-1 bg-white/20"
        style={{ touchAction: 'none' }}
      />

      {/* Toggle Button Container */}
      <div
        className="absolute inset-y-0 left-0 flex items-center"
        style={{ touchAction: 'manipulation' }}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "transform transition-transform duration-300",
            "touch-manipulation pointer-events-auto",
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

      {/* Navigation Panel */}
      <div
        className={cn(
          "absolute top-0 left-0 w-64 h-full",
          "bg-black/80 backdrop-blur-md",
          "border-r border-white/10",
          "transition-transform duration-300",
          "touch-manipulation pointer-events-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="h-full overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black/50 pointer-events-auto"
          onClick={() => setIsSidebarOpen(false)}
          style={{ touchAction: 'none' }}
        />
      )}
    </div>
  );
};

export default MobileNavigation;