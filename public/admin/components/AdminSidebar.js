import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AdminSidebar = ({ sections, currentSection, onSectionSelect, onSectionsReorder }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      section: index + 1
    }));

    onSectionsReorder(updatedItems);
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Collections</h2>
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search all"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <button className="flex items-center space-x-2 text-blue-600 font-medium">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Compositions</span>
          </button>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]"
            >
              {sections.map((section, index) => (
                <Draggable
                  key={section.title}
                  draggableId={section.title}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`
                        w-full text-left py-3 px-4 rounded-md cursor-pointer
                        ${currentSection?.title === section.title
                          ? "bg-blue-50 text-blue-700"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                        }
                        ${snapshot.isDragging ? "shadow-lg" : ""}
                      `}
                      onClick={() => onSectionSelect(section)}
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-400">≡</span>
                        <span className="truncate">{section.title}</span>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default AdminSidebar;