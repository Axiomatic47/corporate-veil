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

      const titleField = document.querySelector('input[name="title"]');
      const contentField = document.querySelector('textarea[name="content"]');

      if (titleField && contentField) {
        titleField.value = currentEntry.data[`title_level_${currentReadingLevel}`] || '';
        contentField.value = currentEntry.data[`content_level_${currentReadingLevel}`] || '';
      }
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
        const entries = await window.CMS.getEntries({ collection_name: 'compositions' });
        currentEntries = entries;

        let existingSidebar = document.getElementById('admin-sidebar');
        if (existingSidebar) {
          existingSidebar.remove();
        }

        const sidebarContainer = document.createElement('div');
        sidebarContainer.id = 'admin-sidebar';
        document.body.appendChild(sidebarContainer);

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

        entries.forEach(entry => {
          const button = document.createElement('button');
          button.className = `w-full text-left px-3 py-2 rounded-md text-sm transition-colors mb-2 ${
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
          nav.appendChild(button);
        });

        sidebarContainer.appendChild(nav);

        const mainContent = document.querySelector('.css-1gj57a0-AppMainContainer');
        if (mainContent) {
          mainContent.style.marginLeft = '16rem';
          mainContent.style.width = 'calc(100% - 16rem)';

          // Add reading level selector at the top of the main content
          const readingLevelSelector = createReadingLevelSelector();
          mainContent.insertBefore(readingLevelSelector, mainContent.firstChild);
        }

        // Attach form listeners for unsaved changes detection
        attachFormListeners();

        // Update form fields for initial load
        updateFormFields();
      } catch (error) {
        console.error('Error initializing sidebar:', error);
      }
    };

    // Register event listeners
    window.CMS.registerEventListener({
      name: 'preInit',
      handler: function() {
        console.log('PreInit event fired');
        setTimeout(initializeSidebar, 1000);
      }
    });

    window.CMS.registerEventListener({
      name: 'entrySelected',
      handler: function(entry) {
        console.log('Entry selected:', entry);
        currentEntry = entry;
        initializeSidebar();
        updateFormFields();
      }
    });

    // Handle page unload with unsaved changes
    window.addEventListener('beforeunload', (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  };

  // Check if we're in a module environment
  if (typeof exports !== 'undefined') {
    exports.default = registerEventHandlers;
  } else if (typeof window !== 'undefined') {
    // If not in a module environment, attach to window
    window.registerEventHandlers = registerEventHandlers;
  }
})();