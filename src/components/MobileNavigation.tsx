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
      <div className="w-64 min-h-[calc(100vh-4rem)] border-r border-white/10 bg-black/80 backdrop-blur-md overflow-y-auto">
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Pull Tab */}
      <div className="fixed top-16 left-0 h-screen pointer-events-none z-50">
        {/* The line that is always visible */}
        <div
          className={cn(
            "absolute h-full w-1 bg-white/20 transition-transform duration-300",
            isSidebarOpen ? "translate-x-64" : "translate-x-0"
          )}
        />

        {/* The clickable button */}
        <div
          className={cn(
            "absolute top-1/3 pointer-events-auto",
            "transition-transform duration-300",
            isSidebarOpen ? "translate-x-64" : "translate-x-0"
          )}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="relative flex items-center"
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
              <div className="text-white">
                {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Panel */}
      <div
        className={cn(
          "fixed top-16 left-0 bottom-0 w-64",
          "bg-black/80 backdrop-blur-md",
          "border-r border-white/10",
          "transition-transform duration-300 ease-in-out",
          "z-40",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Scrollable Container */}
        <div className="h-full overflow-y-auto pb-16">
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