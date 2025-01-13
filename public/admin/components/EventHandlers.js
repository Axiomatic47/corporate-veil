(() => {
  const registerEventHandlers = () => {
    let currentEntries = [];
    let currentEntry = null;
    let currentReadingLevel = 3;
    let hasUnsavedChanges = false;
    let draggedItem = null;

    const createSidebar = () => {
      const sidebar = document.createElement('div');
      sidebar.id = 'custom-sidebar';
      sidebar.className = 'fixed left-0 top-0 bottom-0 w-64 bg-[#1A1F2C] text-white p-6 overflow-y-auto';

      const title = document.createElement('h2');
      title.className = 'text-lg font-medium mb-4';
      title.textContent = 'Sections';
      sidebar.appendChild(title);

      const list = document.createElement('div');
      list.className = 'space-y-2';
      list.id = 'sections-list';

      // Add drag and drop handlers
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
          list.appendChild(draggable);
        } else {
          list.insertBefore(draggable, afterElement);
        }
      });

      currentEntries.forEach((entry, index) => {
        const section = document.createElement('div');
        section.className = `p-3 bg-[#2A2F3C] rounded-lg cursor-move ${
          currentEntry?.data?.title === entry.data.title ? 'border-l-4 border-blue-500' : ''
        }`;
        section.draggable = true;
        section.dataset.index = index;
        section.innerHTML = `
          <div class="flex items-center">
            <span class="mr-2">≡</span>
            <span>${entry.data.title}</span>
          </div>
        `;

        section.addEventListener('dragstart', (e) => {
          section.classList.add('dragging');
          draggedItem = section;
        });

        section.addEventListener('dragend', async (e) => {
          section.classList.remove('dragging');
          const newIndex = Array.from(list.children).indexOf(section);
          await updateSectionOrder(entry, newIndex);
        });

        section.addEventListener('click', () => {
          window.CMS.entry.select(entry);
        });

        list.appendChild(section);
      });

      sidebar.appendChild(list);
      return sidebar;
    };

    const getDragAfterElement = (container, y) => {
      const draggableElements = [...container.querySelectorAll('[draggable]:not(.dragging)')];

      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    const updateSectionOrder = async (entry, newIndex) => {
      try {
        // Update the section numbers
        const updatedEntries = Array.from(document.querySelectorAll('#sections-list > div'));
        const updates = updatedEntries.map((el, idx) => {
          const entryIndex = parseInt(el.dataset.index);
          const entry = currentEntries[entryIndex];
          return {
            ...entry,
            data: {
              ...entry.data,
              section: idx + 1
            }
          };
        });

        // Save the updates
        for (const updatedEntry of updates) {
          await window.CMS.entry.persist(updatedEntry);
        }

        // Refresh the entries
        currentEntries = updates;
        initializeSidebar();
      } catch (error) {
        console.error('Error updating section order:', error);
      }
    };

    const initializeSidebar = async () => {
      try {
        // Get entries if not already loaded
        if (!currentEntries.length) {
          currentEntries = await window.CMS.getEntries({ collection_name: 'compositions' });
        }

        // Sort entries by section number
        currentEntries.sort((a, b) => a.data.section - b.data.section);

        // Remove existing sidebar if present
        const existingSidebar = document.getElementById('custom-sidebar');
        if (existingSidebar) {
          existingSidebar.remove();
        }

        // Create and append new sidebar
        const sidebar = createSidebar();
        document.body.appendChild(sidebar);

        // Adjust main content area
        const mainContent = document.querySelector('.css-1gj57a0-AppMainContainer');
        if (mainContent) {
          mainContent.style.marginLeft = '16rem';
          mainContent.style.width = 'calc(100% - 16rem)';
        }
      } catch (error) {
        console.error('Error initializing sidebar:', error);
      }
    };

    // Register event handlers
    window.CMS.registerEventListener({
      name: 'preSave',
      handler: async () => {
        hasUnsavedChanges = false;
        return true;
      }
    });

    window.CMS.registerEventListener({
      name: 'entryLoaded',
      handler: async (entry) => {
        currentEntry = entry;
        initializeSidebar();
      }
    });

    window.CMS.registerEventListener({
      name: 'entriesLoaded',
      handler: async () => {
        initializeSidebar();
      }
    });

    // Initialize on load
    setTimeout(initializeSidebar, 1000);
  };

  // Make it available globally
  window.registerEventHandlers = registerEventHandlers;
})();