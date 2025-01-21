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

  if (!isMobile) return <>{children}</>;

  return (
    <div className="relative">
      {/* Pull Tab - Fixed position */}
      <div
        className={cn(
          "fixed top-16 z-50",
          "transition-all duration-200 ease-in-out",
          isSidebarOpen ? "left-64" : "left-0"
        )}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center"
        >
          {/* Vertical Line */}
          <div className="w-1 h-screen bg-white/20" />

          {/* Toggle Button */}
          <div className={cn(
            "p-2 backdrop-blur-md bg-black/40",
            "border border-white/10 rounded-r-lg -ml-px",
            "transition-colors duration-200",
            "hover:bg-black/60"
          )}>
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </div>
        </button>
      </div>

      {/* Sidebar - Fixed position */}
      <div
        className={cn(
          "fixed top-16 left-0 z-40",
          "w-64 h-screen",
          "transition-transform duration-200 ease-in-out",
          "bg-black/80 backdrop-blur-md",
          "border-r border-white/10",
          "overflow-y-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {children}
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MobileNavigation;