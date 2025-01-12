import { useNavigate } from "react-router-dom";
import { compositionData } from "@/utils/compositionData";

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
        <h2 className="text-xl font-serif">{collectionName}</h2>
        <h3 className="text-lg font-serif text-gray-300">{compositionTitle}</h3>
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() =>
                navigate(`/composition/${compositionId}/section/${section.id}`)
              }
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
      </div>
    </div>
  );
};