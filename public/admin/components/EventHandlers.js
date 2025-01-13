(() => {
  const registerEventHandlers = () => {
    let currentEntries = [];
    let currentEntry = null;
    let sidebarInitialized = false;

    const createSidebar = () => {
      const sidebarContainer = document.createElement('div');
      sidebarContainer.className = 'custom-sidebar';
      sidebarContainer.innerHTML = `
        <div class="mb-4">
          <h2 class="text-lg font-medium">Sections</h2>
          <button id="add-section" class="px-4 py-2 mt-4 bg-white/10 rounded">
            Add Section
          </button>
        </div>
        <div id="sections-list" class="space-y-2"></div>
      `;

      const sectionsList = sidebarContainer.querySelector('#sections-list');
      const addSectionBtn = sidebarContainer.querySelector('#add-section');

      // Sort entries by section number
      currentEntries
        .sort((a, b) => a.data.section - b.data.section)
        .forEach((entry, index) => {
          const section = document.createElement('div');
          section.className = `sidebar-section ${
            currentEntry?.data?.title === entry.data.title ? 'bg-white/20' : ''
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
          });

          section.addEventListener('dragend', async () => {
            section.classList.remove('dragging');
            const newOrder = Array.from(sectionsList.children).map((child, idx) => ({
              entry: currentEntries[parseInt(child.dataset.index)],
              newSection: idx + 1
            }));

            try {
              for (const {entry, newSection} of newOrder) {
                if (entry.data.section !== newSection) {
                  entry.data.section = newSection;
                  await window.CMS.entry.persist(entry);
                }
              }
            } catch (error) {
              console.error('Error updating section order:', error);
            }
          });

          section.addEventListener('click', () => {
            window.CMS.entry.select(entry);
          });

          sectionsList.appendChild(section);
        });

      sectionsList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggable = document.querySelector('.dragging');
        if (!draggable) return;

        const afterElement = getDragAfterElement(sectionsList, e.clientY);
        if (afterElement) {
          sectionsList.insertBefore(draggable, afterElement);
        } else {
          sectionsList.appendChild(draggable);
        }
      });

      return sidebarContainer;
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

    const initializeSidebar = async () => {
      try {
        console.log('Initializing sidebar...');

        // Get entries
        currentEntries = await window.CMS.getEntries({ collection_name: 'compositions' });

        // Remove existing sidebar if present
        const existingSidebar = document.querySelector('.custom-sidebar');
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

        sidebarInitialized = true;
      } catch (error) {
        console.error('Error initializing sidebar:', error);
      }
    };

    // Register event handlers
    window.CMS.registerEventListener({
      name: 'prePublish',
      handler: function() {
        console.log('Pre-publish triggered');
        return true;
      }
    });

    window.CMS.registerEventListener({
      name: 'postPublish',
      handler: function() {
        console.log('Post-publish triggered');
        initializeSidebar();
      }
    });

    window.CMS.registerEventListener({
      name: 'onLoad',
      handler: function(entry) {
        console.log('Entry loaded:', entry);
        currentEntry = entry;
        if (!sidebarInitialized) {
          initializeSidebar();
        }
      }
    });

    // Initialize on load
    setTimeout(initializeSidebar, 1000);
  };

  window.registerEventHandlers = registerEventHandlers;
})();