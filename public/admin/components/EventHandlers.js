(() => {
  let initialized = false;
  let currentEntries = [];
  let currentEntry = null;

  const createSidebar = () => {
    const sidebarContainer = document.createElement('div');
    sidebarContainer.className = 'custom-sidebar';
    sidebarContainer.innerHTML = `
      <div class="mb-4">
        <h2 class="text-lg font-medium">Sections</h2>
      </div>
      <div id="sections-list" class="space-y-2"></div>
    `;

    const sectionsList = sidebarContainer.querySelector('#sections-list');

    // Sort entries by section number
    const sortedEntries = [...currentEntries].sort((a, b) =>
      (a.data?.section || 0) - (b.data?.section || 0)
    );

    sortedEntries.forEach((entry, index) => {
      const section = document.createElement('div');
      section.className = 'sidebar-section';
      section.draggable = true;
      section.dataset.index = index;
      section.innerHTML = `
        <div class="flex items-center">
          <span class="mr-2">≡</span>
          <span>${entry.data?.title || 'Untitled'}</span>
        </div>
      `;

      // Drag events
      section.addEventListener('dragstart', () => {
        section.classList.add('dragging');
      });

      section.addEventListener('dragend', () => {
        section.classList.remove('dragging');
        updateSectionOrder();
      });

      // Click to edit
      section.addEventListener('click', () => {
        if (window.CMS.getBackend()?.currentUser) {
          window.CMS.entry.select(entry);
        }
      });

      sectionsList.appendChild(section);
    });

    return sidebarContainer;
  };

  const updateSectionOrder = async () => {
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
          entry.data.section = newSection;
          await window.CMS.entry.persist(entry);
        }
      }
    } catch (error) {
      console.error('Error updating section order:', error);
    }
  };

  const initializeSidebar = async () => {
    if (initialized) return;

    try {
      // Get entries
      currentEntries = await window.CMS.getEntries();

      // Remove existing sidebar if present
      const existingSidebar = document.querySelector('.custom-sidebar');
      if (existingSidebar) {
        existingSidebar.remove();
      }

      // Create and append new sidebar
      const sidebar = createSidebar();
      document.body.appendChild(sidebar);

      // Add drag and drop listeners
      const sectionsList = sidebar.querySelector('#sections-list');
      sectionsList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(sectionsList, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (dragging && afterElement) {
          sectionsList.insertBefore(dragging, afterElement);
        } else if (dragging) {
          sectionsList.appendChild(dragging);
        }
      });

      initialized = true;
    } catch (error) {
      console.error('Error initializing sidebar:', error);
    }
  };

  const getDragAfterElement = (container, y) => {
    const draggableElements = [
      ...container.querySelectorAll('.sidebar-section:not(.dragging)')
    ];

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

  window.initializeEventHandlers = () => {
    // Wait for CMS to be ready
    window.CMS.registerEventListener({
      name: 'preSave',
      handler: () => true
    });

    window.CMS.registerEventListener({
      name: 'postSave',
      handler: () => {
        initialized = false;
        initializeSidebar();
      }
    });

    window.CMS.registerEventListener({
      name: 'entryLoaded',
      handler: (entry) => {
        currentEntry = entry;
        if (!initialized) {
          initializeSidebar();
        }
      }
    });

    // Initial setup
    setTimeout(initializeSidebar, 1000);
  };
})();