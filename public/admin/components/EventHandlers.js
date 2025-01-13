(() => {
  const registerEventHandlers = async () => {
    let currentEntries = [];
    let currentEntry = null;

    const createSidebar = () => {
      const sidebarContainer = document.createElement('div');
      sidebarContainer.className = 'custom-sidebar';
      sidebarContainer.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">Sections</h2>
          <button id="add-section" style="width: 100%; padding: 0.5rem; background: #2196f3; color: white; border: none; border-radius: 4px;">
            Add New Section
          </button>
        </div>
        <div id="sections-list"></div>
      `;

      // Add section button handler
      const addSectionBtn = sidebarContainer.querySelector('#add-section');
      addSectionBtn.addEventListener('click', () => {
        window.CMS.store.getStore().dispatch({
          type: 'DRAFT_CREATE_NEW_ENTRY',
          payload: {
            collectionName: 'compositions',
            data: {
              collection_type: 'memorandum',
              section: currentEntries.length + 1,
              title: 'New Section'
            }
          }
        });
      });

      return sidebarContainer;
    };

    const updateSections = async () => {
      try {
        // Get entries from the store
        const collections = window.CMS.store.getStore().getState().collections;
        const compositions = collections.get('compositions');
        if (!compositions) return;

        currentEntries = compositions.get('entries').toJS();

        // Sort entries by section number
        currentEntries.sort((a, b) => a.data.section - b.data.section);

        // Update sections list
        const sectionsList = document.querySelector('#sections-list');
        if (!sectionsList) return;

        sectionsList.innerHTML = '';
        currentEntries.forEach((entry, index) => {
          const section = document.createElement('div');
          section.className = 'sidebar-section';
          section.draggable = true;
          section.dataset.index = index;
          section.innerHTML = `
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 0.5rem;">≡</span>
              <span>${entry.data.title || 'Untitled'}</span>
            </div>
          `;

          // Click handler
          section.addEventListener('click', () => {
            window.CMS.store.getStore().dispatch({
              type: 'DRAFT_CREATE_FROM_ENTRY',
              payload: {
                collectionName: 'compositions',
                entry
              }
            });
          });

          // Drag handlers
          section.addEventListener('dragstart', () => section.classList.add('dragging'));
          section.addEventListener('dragend', () => {
            section.classList.remove('dragging');
            reorderSections();
          });

          sectionsList.appendChild(section);
        });
      } catch (error) {
        console.error('Error updating sections:', error);
      }
    };

    const reorderSections = async () => {
      const sectionsList = document.querySelector('#sections-list');
      if (!sectionsList) return;

      const sections = Array.from(sectionsList.children);
      const newOrder = sections.map((section, index) => ({
        entry: currentEntries[parseInt(section.dataset.index)],
        newSection: index + 1
      }));

      try {
        for (const {entry, newSection} of newOrder) {
          if (entry && entry.data.section !== newSection) {
            const newData = { ...entry.data, section: newSection };
            window.CMS.store.getStore().dispatch({
              type: 'ENTRY_PERSIST',
              payload: {
                collectionName: 'compositions',
                entryDraft: { data: newData },
                options: { raw: true }
              }
            });
          }
        }
      } catch (error) {
        console.error('Error reordering sections:', error);
      }
    };

    // Initialize sidebar
    const initializeSidebar = () => {
      const sidebar = createSidebar();
      document.body.appendChild(sidebar);

      // Add dragover handler to sections list
      const sectionsList = sidebar.querySelector('#sections-list');
      sectionsList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (!dragging) return;

        const afterElement = getDragAfterElement(sectionsList, e.clientY);
        if (afterElement) {
          sectionsList.insertBefore(dragging, afterElement);
        } else {
          sectionsList.appendChild(dragging);
        }
      });

      // Initial sections update
      updateSections();
    };

    const getDragAfterElement = (container, y) => {
      const draggableElements = [...container.querySelectorAll('.sidebar-section:not(.dragging)')];

      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    // Register event listeners
    window.CMS.store.getStore().subscribe(() => {
      updateSections();
    });

    // Initialize
    setTimeout(initializeSidebar, 1000);
  };

  window.registerEventHandlers = registerEventHandlers;
})();