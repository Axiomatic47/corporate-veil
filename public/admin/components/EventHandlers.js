(() => {
  const registerEventHandlers = () => {
    if (!window.CMS || !window.CMS.store) {
      console.error('CMS store not ready');
      return;
    }

    let currentEntries = [];

    const createSidebar = () => {
      const sidebarContainer = document.createElement('div');
      sidebarContainer.className = 'custom-sidebar';
      sidebarContainer.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">Sections</h2>
          <button id="add-section" style="width: 100%; padding: 0.5rem; border: none; background: #2196f3; color: white; border-radius: 4px; cursor: pointer;">
            Add New Section
          </button>
        </div>
        <div id="sections-list"></div>
      `;

      const addSectionBtn = sidebarContainer.querySelector('#add-section');
      addSectionBtn.addEventListener('click', () => {
        const store = CMS.store;
        store.dispatch({
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

    const updateSections = () => {
      try {
        const store = CMS.store;
        const state = store.getState();
        const collections = state.collections;

        if (collections) {
          const entries = collections
            .getIn(['compositions', 'entries'])
            ?.toJS() || [];

          currentEntries = entries.sort((a, b) =>
            (a.data.section || 0) - (b.data.section || 0)
          );

          const sectionsList = document.querySelector('#sections-list');
          if (sectionsList) {
            sectionsList.innerHTML = '';

            currentEntries.forEach((entry, index) => {
              const section = document.createElement('div');
              section.className = 'sidebar-section';
              section.draggable = true;
              section.dataset.index = index;
              section.innerHTML = `
                <div style="display: flex; align-items: center;">
                  <span style="margin-right: 0.5rem;">≡</span>
                  ${entry.data.title || 'Untitled'}
                </div>
              `;

              section.addEventListener('click', () => {
                store.dispatch({
                  type: 'DRAFT_CREATE_FROM_ENTRY',
                  payload: {
                    collectionName: 'compositions',
                    entry
                  }
                });
              });

              section.addEventListener('dragstart', () => section.classList.add('dragging'));
              section.addEventListener('dragend', () => {
                section.classList.remove('dragging');
                updateOrder();
              });

              sectionsList.appendChild(section);
            });
          }
        }
      } catch (error) {
        console.error('Error updating sections:', error);
      }
    };

    const updateOrder = () => {
      const sectionsList = document.querySelector('#sections-list');
      if (!sectionsList) return;

      const sections = Array.from(sectionsList.children);
      const newOrder = sections.map((section, index) => ({
        entry: currentEntries[parseInt(section.dataset.index)],
        newSection: index + 1
      }));

      newOrder.forEach(({entry, newSection}) => {
        if (entry && entry.data.section !== newSection) {
          const store = CMS.store;
          store.dispatch({
            type: 'ENTRY_PERSIST',
            payload: {
              collectionName: 'compositions',
              entryDraft: {
                data: { ...entry.data, section: newSection }
              },
              options: { raw: true }
            }
          });
        }
      });
    };

    // Initialize
    const sidebar = createSidebar();
    document.body.appendChild(sidebar);

    // Setup drag and drop
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

    // Helper function for drag and drop
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

    // Subscribe to store changes
    const unsubscribe = CMS.store.subscribe(() => {
      updateSections();
    });

    // Initial update
    updateSections();

    // Cleanup on page unload
    window.addEventListener('unload', () => {
      unsubscribe();
    });
  };

  window.registerEventHandlers = registerEventHandlers;
})();