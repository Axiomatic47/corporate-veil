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
      {/* Pull Bar */}
      <div
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={cn(
          "fixed z-50 h-full flex items-center cursor-pointer",
          "transition-all duration-200 ease-in-out",
          isSidebarOpen ? "left-[256px]" : "left-0"
        )}
      >
        <div className="h-32 flex items-center">
          {/* Vertical Bar */}
          <div className={cn(
            "w-1 h-full backdrop-blur-md bg-white/10",
            "transition-opacity duration-200",
            isSidebarOpen ? "opacity-0" : "opacity-100"
          )} />

          {/* Toggle Button */}
          <div className={cn(
            "px-2 py-8 backdrop-blur-md bg-black/40 border border-white/10",
            "rounded-r-lg -ml-px",
            "transition-colors duration-200",
            "hover:bg-black/60"
          )}>
            <div className="rotate-0 transition-transform duration-200">
              {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Content */}
      <div
        className={cn(
          "w-64 min-h-[calc(100vh-4rem)] backdrop-blur-md bg-black/80 border-r border-white/10",
          "fixed lg:relative z-40 transition-all duration-300 ease-in-out h-full overflow-y-auto",
          isSidebarOpen ? "left-0" : "-left-64"
        )}
      >
        {children}
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MobileNavigation;