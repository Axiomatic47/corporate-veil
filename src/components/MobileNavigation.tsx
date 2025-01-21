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
      <div className="w-64 h-screen border-r border-white/10 bg-black/80 backdrop-blur-md overflow-y-auto">
        {children}
      </div>
    );
  }

  return (
    <div className="fixed h-screen w-screen pointer-events-none z-50" style={{ marginTop: '4rem' }}>
      {/* Vertical Line */}
      <div className="fixed top-16 bottom-0 left-0 w-1 bg-white/20" />

      {/* Tab Button */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 pointer-events-auto">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ transform: `translateX(${isSidebarOpen ? '256px' : '0px'})` }}
          className="transition-transform duration-300"
        >
          <div className="flex items-center justify-center w-7 h-16 bg-white/30 rounded-r-md -ml-px hover:bg-white/40">
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </div>
        </button>
      </div>

      {/* Navigation Menu */}
      <div
        className={cn(
          "fixed top-16 bottom-0 left-0 w-64 pointer-events-auto",
          "bg-black/80 backdrop-blur-md border-r border-white/10",
          "overflow-hidden transition-transform duration-300",
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
          className="fixed inset-0 bg-black/50 pointer-events-auto"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MobileNavigation;