import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import Index from "./pages/Index";
import SectionsPage from "./pages/SectionsPage";
import CompositionPage from "./pages/CompositionPage";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";
import Donate from "./pages/Donate";

const queryClient = new QueryClient();

const AdminPage = () => {
  useEffect(() => {
    // Load CMS script if not already loaded
    if (!document.getElementById('decap-cms-script')) {
      const script = document.createElement('script');
      script.id = 'decap-cms-script';
      script.src = 'https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full">
      <iframe
        src="/admin/index.html"
        className="w-full h-full border-0"
        title="Content Management System"
      />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/composition/:compositionId" element={<SectionsPage />} />
          <Route path="/composition/:compositionId/section/:sectionId" element={<CompositionPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;