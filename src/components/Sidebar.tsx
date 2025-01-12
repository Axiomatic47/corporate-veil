import { useNavigate } from "react-router-dom";

interface SidebarProps {
  sections: Array<{ id: number; title: string }>;
  collectionName: string;
  compositionId: string;
  currentSectionId: string;
}

export const Sidebar = ({ sections, collectionName, compositionId, currentSectionId }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 min-h-[calc(100vh-4rem)] bg-[#1A1F2C] text-white p-6">
      <h2 className="text-xl font-serif mb-6">{collectionName}</h2>
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
  );
};