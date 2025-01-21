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
      <div className="w-64 h-[calc(100vh-4rem)] border-r border-white/10 bg-black/80 backdrop-blur-md overflow-y-auto">
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Pull Tab */}
      <div className="fixed top-16 left-0 h-full z-50 flex items-stretch">
        {/* Handle */}
        <div
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "w-6 flex items-center justify-center cursor-pointer",
            "transition-all duration-300",
            isSidebarOpen ? "translate-x-64" : "translate-x-0"
          )}
        >
          <div className="w-1 h-32 bg-white/20" />
          <div className="absolute right-0 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-r-lg">
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </div>
        </div>
      </div>

      {/* Fixed Sidebar */}
      <div
        className={cn(
          "fixed top-16 left-0 w-64 h-[calc(100vh-4rem)]",
          "bg-black/80 backdrop-blur-md",
          "border-r border-white/10",
          "z-40 transition-transform duration-300",
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
    </>
  );
};

export default MobileNavigation;