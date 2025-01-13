import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AdminSidebar = ({ sections, currentSection, onSectionSelect, onSectionsReorder }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update section numbers based on new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      section: index + 1
    }));
    
    onSectionsReorder(updatedItems);
  };

  return (
    <div className="w-64 min-h-screen bg-gray-100 p-4 border-r">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Sections</h2>
        <p className="text-sm text-gray-600 mt-1">Drag sections to reorder</p>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
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
                        w-full text-left py-2 px-4 rounded transition-colors
                        ${currentSection?.title === section.title
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-200"
                        }
                        ${snapshot.isDragging ? "shadow-lg" : ""}
                      `}
                      onClick={() => onSectionSelect(section)}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">≡</span>
                        <span>Section {section.section}: {section.title}</span>
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