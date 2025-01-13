(() => {
  const registerEventHandlers = () => {
    let currentEntries = [];
    let currentEntry = null;
    let currentReadingLevel = 3;
    let hasUnsavedChanges = false;

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

    const initializeSidebar = () => {
      try {
        // Wait for the CMS container to be ready
        const cmsContainer = document.querySelector('.css-1gj57a0-AppMainContainer');
        if (!cmsContainer) {
          setTimeout(initializeSidebar, 100);
          return;
        }

        console.log('CMS container found, initializing sidebar...');

        // Add reading level selector
        let selector = document.querySelector('.reading-level-selector');
        if (!selector) {
          selector = createReadingLevelSelector();
          cmsContainer.insertBefore(selector, cmsContainer.firstChild);
        }

        // Add form change listeners
        const form = document.querySelector('form');
        if (form) {
          form.addEventListener('change', () => {
            hasUnsavedChanges = true;
          });

          form.addEventListener('submit', () => {
            hasUnsavedChanges = false;
          });
        }

        updateFormFields();
      } catch (error) {
        console.error('Error in initializeSidebar:', error);
      }
    };

    // Register correct Decap CMS event handlers
    try {
      console.log('Registering CMS event handlers...');

      // Listen for route changes
      window.CMS.registerEventListener({
        name: 'routeChange',
        handler: () => {
          console.log('Route changed, initializing sidebar...');
          setTimeout(initializeSidebar, 500);
        }
      });

      // Listen for entry changes
      window.CMS.registerEventListener({
        name: 'beforePublish',
        handler: () => {
          hasUnsavedChanges = false;
          return true;
        }
      });

    } catch (error) {
      console.error('Error registering event handlers:', error);
    }

    // Handle beforeunload
    window.addEventListener('beforeunload', (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // Initial setup
    setTimeout(initializeSidebar, 1000);
  };

  // Make it available globally
  window.registerEventHandlers = registerEventHandlers;
})();