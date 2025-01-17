// At the top of SectionPage.tsx, add:
import MobileSidebar from "@/components/navigation/MobileSidebar";

// Replace the existing sidebar section with:
<div className="flex relative">
  <MobileSidebar
    isMobile={isMobile}
    isSidebarOpen={isSidebarOpen}
    setIsSidebarOpen={setIsSidebarOpen}
  >
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-serif text-white drop-shadow-lg mb-1">
          {compositionId === "memorandum" ? "Memorandum and Manifestation" : "Corrective Measures"}
        </h2>
        <h3 className="text-sm text-gray-200">{currentComposition.title}</h3>
      </div>
      <nav className="space-y-2">
        {currentComposition.sections.map((section, index) => (
          <button
            key={index}
            onClick={() => handleSectionChange(index + 1)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              index + 1 === parseInt(sectionId)
                ? "bg-white/20 text-white font-medium backdrop-blur-md"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  </MobileSidebar>

  {/* Main Content */}
  <div className={cn(
    "flex-1 p-8 text-gray-200 transition-all duration-300",
    isMobile && isSidebarOpen ? "ml-64" : "ml-0"
  )}>
    {/* Rest of your main content */}
  </div>
</div>