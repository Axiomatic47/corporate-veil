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
      <div className="w-64 min-h-screen border-r border-white/10 bg-black/80 backdrop-blur-md">
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Pull Tab */}
      <div
        className={cn(
          "fixed z-50 top-16 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "left-64" : "left-0"
        )}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="group relative flex items-center"
        >
          {/* Vertical Line */}
          <div className={cn(
            "w-1 h-32 bg-white/20",
            "transition-opacity duration-200",
            isSidebarOpen ? "opacity-0" : "opacity-100"
          )} />

          {/* Toggle Button */}
          <div className={cn(
            "absolute right-0 translate-x-full",
            "p-2 backdrop-blur-md bg-black/40",
            "border border-white/10 rounded-r-lg -ml-px",
            "transition-colors duration-200",
            "hover:bg-black/60 group-hover:bg-black/60"
          )}>
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </div>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-16 bottom-0 w-64 z-40",
          "transition-all duration-300 ease-in-out",
          "bg-black/80 backdrop-blur-md",
          "border-r border-white/10",
          isSidebarOpen ? "left-0" : "-left-64"
        )}
      >
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Backdrop Overlay */}
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