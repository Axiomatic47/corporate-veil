// src/components/MobileNavigation.tsx
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

    // Lock body scroll when sidebar is open on mobile
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isSidebarOpen]);

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
      <div className="w-64 h-[calc(100vh-4rem)] border-r border-white/10 bg-black/80 backdrop-blur-md overflow-y-auto sticky top-16">
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Vertical Bar Indicator */}
      <div
        className={cn(
          "fixed z-50 top-16 h-[calc(100vh-4rem)]",
          "transition-all duration-300",
          isSidebarOpen ? "left-64" : "left-0"
        )}
      >
        {/* Vertical Line */}
        <div className="h-full w-1 bg-white/20" />

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-1/2 -translate-y-1/2 -right-6"
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

      {/* Sidebar */}
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