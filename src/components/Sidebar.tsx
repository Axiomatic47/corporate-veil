import { useNavigate } from "react-router-dom";
import { compositionData } from "@/utils/compositionData";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarSections } from "./sidebar/SidebarSections";

interface SidebarProps {
  sections: Array<{ id: number; title: string }>;
  collectionName: string;
  compositionId: string;
  currentSectionId: string;
}

export const Sidebar = ({ sections, collectionName, compositionId, currentSectionId }: SidebarProps) => {
  const navigate = useNavigate();

  // Get the composition title based on the compositionId only
  const getCompositionTitle = () => {
    const collection = compositionId === "memorandum" ? compositionData.memorandum : compositionData.corrective;
    // Always use the first composition as the main title for the collection
    return collection[0]?.title || "";
  };

  const compositionTitle = getCompositionTitle();

  return (
    <div className="w-64 min-h-[calc(100vh-4rem)] bg-[#1A1F2C] text-white p-6">
      <div className="space-y-4">
        <SidebarHeader 
          collectionName={collectionName} 
          compositionTitle={compositionTitle} 
        />
        <SidebarSections 
          sections={sections}
          currentSectionId={currentSectionId}
          compositionId={compositionId}
          onSectionClick={(sectionId) => 
            navigate(`/composition/${compositionId}/section/${sectionId}`)
          }
        />
      </div>
    </div>
  );
};