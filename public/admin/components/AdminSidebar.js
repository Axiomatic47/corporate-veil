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
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-50">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Sections</h2>
        <p className="text-sm text-gray-500 mt-1">Drag sections to reorder</p>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="p-4 space-y-2"
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
                        w-full text-left py-2 px-4 rounded cursor-pointer
                        ${currentSection?.title === section.title
                          ? "bg-blue-100 text-blue-900"
                          : "bg-white text-gray-700 hover:bg-gray-50"
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