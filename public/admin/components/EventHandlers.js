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
        <label class="block text-white mb-2">Reading Level:</label>
        <select class="w-full bg-[#2A2F3C] text-white p-2 rounded border border-white/10">
          <option value="1">Basic (Level 1)</option>
          <option value="3" selected>Intermediate (Level 3)</option>
          <option value="5">Advanced (Level 5)</option>
        </select>
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

      // Get all the form fields
      const fields = document.querySelectorAll('input, textarea');
      fields.forEach(field => {
        const name = field.getAttribute('name');
        if (name) {
          const value = currentEntry.data[`${name}_level_${currentReadingLevel}`] || '';
          field.value = value;
        }
      });
    };

    const handleFormChange = () => {
      hasUnsavedChanges = true;
    };

    const attachFormListeners = () => {
      const form = document.querySelector('form');
      if (form) {
        form.addEventListener('change', handleFormChange);
        form.addEventListener('submit', () => {
          hasUnsavedChanges = false;
        });
      }
    };

    const initializeSidebar = async () => {
      try {
        console.log('Initializing sidebar...');

        // Prevent multiple initializations
        if (sidebarInitialized) {
          const existingSidebar = document.getElementById('custom-admin-sidebar');
          if (existingSidebar) {
            existingSidebar.remove();
          }
        }

        const entries = await window.CMS.getEntries({ collection_name: 'compositions' });
        currentEntries = entries;

        const sidebarContainer = document.createElement('div');
        sidebarContainer.id = 'custom-admin-sidebar';

        const nav = document.createElement('nav');
        nav.className = 'w-64 min-h-screen bg-[#1A1F2C] text-white p-6 fixed left-0 top-0';

        const title = document.createElement('h2');
        title.className = 'text-lg font-medium text-white mb-1';
        title.textContent = 'Memorandum and Manifestation';
        nav.appendChild(title);

        const subtitle = document.createElement('p');
        subtitle.className = 'text-sm text-white/60 mb-6';
        subtitle.textContent = 'Understanding Corporate Personhood';
        nav.appendChild(subtitle);

        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'space-y-2';

        entries.forEach(entry => {
          const button = document.createElement('button');
          button.className = `w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            currentEntry?.data?.title === entry.data.title
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:bg-white/5 hover:text-white'
          }`;
          button.textContent = entry.data.title;
          button.onclick = async () => {
            if (hasUnsavedChanges) {
              const confirm = window.confirm('You have unsaved changes. Do you want to proceed without saving?');
              if (!confirm) return;
            }
            try {
              await window.CMS.entry.select(entry);
              hasUnsavedChanges = false;
            } catch (error) {
              console.error('Error selecting entry:', error);
            }
          };
          buttonsContainer.appendChild(button);
        });

        nav.appendChild(buttonsContainer);
        sidebarContainer.appendChild(nav);
        document.body.appendChild(sidebarContainer);

        // Add reading level selector
        const mainContent = document.querySelector('.css-1gj57a0-AppMainContainer');
        if (mainContent) {
          mainContent.style.marginLeft = '16rem';
          mainContent.style.width = 'calc(100% - 16rem)';

          const readingLevelSelector = createReadingLevelSelector();
          mainContent.insertBefore(readingLevelSelector, mainContent.firstChild);
        }

        sidebarInitialized = true;
        attachFormListeners();
        updateFormFields();
      } catch (error) {
        console.error('Error initializing sidebar:', error);
      }
    };

    // Register event listeners
    window.CMS.registerEventListener({
      name: 'preSave',
      handler: () => {
        hasUnsavedChanges = false;
        return true;
      }
    });

    window.CMS.registerEventListener({
      name: 'init',
      handler: () => {
        console.log('CMS initialized');
        setTimeout(initializeSidebar, 1000);
      }
    });

    window.CMS.registerEventListener({
      name: 'entriesLoaded',
      handler: () => {
        console.log('Entries loaded');
        initializeSidebar();
      }
    });

    window.CMS.registerEventListener({
      name: 'entrySelected',
      handler: (entry) => {
        console.log('Entry selected:', entry);
        currentEntry = entry;
        initializeSidebar();
        updateFormFields();
      }
    });

    // Handle page unload
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