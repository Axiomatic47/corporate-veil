const AdminSidebar = ({ sections, currentSection, onSectionSelect, onSectionsReorder }) => {
  const e = React.createElement;

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

  return e('div', {
    className: "fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50"
  }, [
    e('div', {
      key: 'header',
      className: "p-6 border-b border-gray-200"
    }, [
      e('h2', {
        className: "text-xl font-semibold text-gray-800"
      }, 'Collections'),
      e(window.ReactBeautifulDnd.DragDropContext, {
        onDragEnd: handleDragEnd
      },
        e(window.ReactBeautifulDnd.Droppable, {
          droppableId: "sections"
        }, (provided) =>
          e('div', {
            ...provided.droppableProps,
            ref: provided.innerRef,
            className: "p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]"
          }, [
            sections.map((section, index) =>
              e(window.ReactBeautifulDnd.Draggable, {
                key: section.title,
                draggableId: section.title,
                index
              }, (dragProvided, snapshot) =>
                e('div', {
                  ref: dragProvided.innerRef,
                  ...dragProvided.draggableProps,
                  ...dragProvided.dragHandleProps,
                  className: `w-full text-left py-3 px-4 rounded-md cursor-pointer ${
                    currentSection?.title === section.title
                      ? "bg-blue-50 text-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } ${snapshot.isDragging ? "shadow-lg" : ""}`,
                  onClick: () => onSectionSelect(section)
                }, [
                  e('div', {
                    className: "flex items-center"
                  }, [
                    e('span', {
                      className: "mr-2 text-gray-400"
                    }, '≡'),
                    e('span', {
                      className: "truncate"
                    }, section.title)
                  ])
                ])
              )
            ),
            provided.placeholder
          ])
        )
      )
    ])
  ]);
};