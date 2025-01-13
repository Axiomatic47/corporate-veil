(() => {
  const registerEventHandlers = () => {
    let currentEntries = [];
    let currentEntry = null;
    let currentReadingLevel = 3;
    let hasUnsavedChanges = false;
    let sidebarInitialized = false;

    const createReadingLevelSelector = () => {
      const container = document.createElement('div');
      container.className = 'p-4 bg-[#1A1F2C] border-b border-white/10';
      container.innerHTML = `
        <div class="reading-level-selector">
          <label class="block text-white mb-2">Reading Level:</label>
          <select class="w-full bg-[#2A2F3C] text-white p-2 rounded border border-white/10">
            <option value="1">Basic (Level 1)</option>
            <option value="3" selected>Intermediate (Level 3)</option>
            <option value="5">Advanced (Level 5)</option>
          </select>
        </div>
      `;

      const select = container.querySelector('select');
      select.value = currentReadingLevel;
      select.addEventListener('change', (e) => {
        currentReadingLevel = parseInt(e.target.value);
        updateFormFields();
      });

      return container;
    };

    const updateFormFields = () => {
      if (!currentEntry) return;

      const form = document.querySelector('form');
      if (!form) return;

      // Update title and content based on reading level
      ['title', 'content'].forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
          field.value = currentEntry.data[`${fieldName}_level_${currentReadingLevel}`] || '';
        }
      });
    };

    const attachFormListeners = () => {
      const form = document.querySelector('form');
      if (!form) return;

      form.addEventListener('change', () => {
        hasUnsavedChanges = true;
      });

      form.addEventListener('submit', () => {
        hasUnsavedChanges = false;
      });
    };

    const initializeSidebar = () => {
      try {
        console.log('Initializing sidebar...');

        // Create sidebar container
        let sidebarContainer = document.querySelector('.custom-admin-sidebar');
        if (!sidebarContainer) {
          sidebarContainer = document.createElement('div');
          sidebarContainer.className = 'custom-admin-sidebar w-64 fixed left-0 top-0 bottom-0 bg-[#1A1F2C] text-white';
          document.body.appendChild(sidebarContainer);
        }

        // Add reading level selector to main content
        const contentContainer = document.querySelector('.css-1gj57a0-AppMainContainer');
        if (contentContainer) {
          let selector = document.querySelector('.reading-level-selector');
          if (!selector) {
            selector = createReadingLevelSelector();
            contentContainer.insertBefore(selector, contentContainer.firstChild);
          }

          // Adjust main content positioning
          contentContainer.style.marginLeft = '16rem';
          contentContainer.style.width = 'calc(100% - 16rem)';
        }

        attachFormListeners();
        updateFormFields();
      } catch (error) {
        console.error('Error in initializeSidebar:', error);
      }
    };

    // Register the correct Decap CMS event handlers
    window.CMS.registerEventListener({
      name: 'mounted',
      handler: () => {
        console.log('CMS mounted');
        setTimeout(initializeSidebar, 1000);
      }
    });

    window.CMS.registerEventListener({
      name: 'beforeEnter',
      handler: () => {
        console.log('Before entering editor');
        if (hasUnsavedChanges) {
          return window.confirm('You have unsaved changes. Continue anyway?');
        }
        return true;
      }
    });

    window.CMS.registerEventListener({
      name: 'entryLoaded',
      handler: (entry) => {
        console.log('Entry loaded:', entry);
        currentEntry = entry;
        updateFormFields();
      }
    });

    // Handle beforeunload
    window.addEventListener('beforeunload', (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  };

  // Make it available globally
  window.registerEventHandlers = registerEventHandlers;
})();