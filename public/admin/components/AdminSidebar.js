import { useState, useEffect } from 'react';

const AdminSidebar = ({ sections, currentSection, onSectionSelect }) => {
  return (
    <div className="w-64 min-h-screen bg-gray-100 p-4 border-r">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Sections</h2>
      </div>
      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.title}
            onClick={() => onSectionSelect(section)}
            className={`w-full text-left py-2 px-4 rounded transition-colors ${
              currentSection?.title === section.title
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            Section {section.section}: {section.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;