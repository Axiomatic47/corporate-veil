interface SidebarSectionsProps {
  sections: Array<{ id: number; title: string }>;
  currentSectionId: string;
  compositionId: string;
  onSectionClick: (sectionId: number) => void;
}

export const SidebarSections = ({ 
  sections, 
  currentSectionId, 
  onSectionClick 
}: SidebarSectionsProps) => {
  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionClick(section.id)}
          className={`w-full text-left py-2 px-4 rounded transition-colors ${
            Number(currentSectionId) === section.id
              ? "bg-white text-[#1A1F2C] font-medium"
              : "text-gray-300 hover:bg-[#2A2F3C] hover:text-white"
          }`}
        >
          Section {section.id}
        </button>
      ))}
    </div>
  );
};