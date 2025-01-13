// CustomSidebar.js
(() => {
  const initSidebar = () => {
    // Wait for CMS API to be ready
    if (!window.CMS || !window.CMS.getState) {
      setTimeout(initSidebar, 100);
      return;
    }

    let currentEntries = [];
    let isProcessingAction = false;

    // Create sidebar elements
    const sidebar = document.createElement('div');
    sidebar.className = 'custom-sidebar';
    sidebar.innerHTML = `
      <h2>Sections</h2>
      <button id="add-section">Add Section</button>
      <div id="sections-list"></div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .custom-sidebar {
        position: fixed;
        left: 0;
        top: 48px;
        bottom: 0;
        width: 250px;
        background: #f5f5f5;
        border-right: 1px solid #ddd;
        padding: 20px;
        overflow-y: auto;
        z-index: 100;
      }

      .custom-sidebar h2 {
        margin: 0 0 16px 0;
        font-size: 18px;
      }

      #add-section {
        width: 100%;
        padding: 8px;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 16px;
        transition: background-color 0.2s;
      }

      #add-section:hover {
        background: #1976d2;
      }

      #add-section:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .section-item {
        padding: 12px;
        margin-bottom: 8px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        user-select: none;
        transition: all 0.2s;
      }

      .section-item:hover {
        background: #f0f0f0;
      }

      .section-item.active {
        background: #e3f2fd;
        border-color: #2196f3;
      }

      /* Main content adjustment */
      .css-1gj57a0-AppMainContainer {
        margin-left: 250px !important;
        width: calc(100% - 250px) !important;
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(sidebar);

    const createNewSection = async () => {
      if (isProcessingAction) return;
      isProcessingAction = true;

      try {
        const collections = window.CMS.getState().collections;
        const entries = collections.get('compositions')?.entries?.toJS() || [];
        const nextSection = entries.length > 0 ?
          Math.max(...entries.map(e => e.data.section || 0)) + 1 : 1;

        await window.CMS.store.dispatch({
          type: 'DRAFT_CREATE_NEW_ENTRY',
          payload: {
            collectionName: 'compositions',
            data: {
              collection_type: 'memorandum',
              section: nextSection,
              title: `New Section ${nextSection}`,
              description: '',
              content_level_1: '',
              content_level_3: '',
              content_level_5: ''
            }
          }
        });

        updateSectionsList();
      } catch (error) {
        console.error('Error creating new section:', error);
      } finally {
        isProcessingAction = false;
      }
    };

    const selectSection = async (entry) => {
      if (isProcessingAction) return;
      isProcessingAction = true;

      try {
        await window.CMS.store.dispatch({
          type: 'DRAFT_CREATE_FROM_ENTRY',
          payload: {
            collectionName: 'compositions',
            entry: entry
          }
        });

        // Update UI
        document.querySelectorAll('.section-item').forEach(item => {
          item.classList.toggle('active', item.dataset.slug === entry.slug);
        });
      } catch (error) {
        console.error('Error selecting section:', error);
      } finally {
        isProcessingAction = false;
      }
    };

    // Initialize add section button
    const addButton = sidebar.querySelector('#add-section');
    addButton.addEventListener('click', createNewSection);

    // Update sections list
    const updateSectionsList = () => {
      try {
        const collections = window.CMS.getState().collections;
        const entries = collections.get('compositions')?.entries?.toJS() || [];
        currentEntries = entries.sort((a, b) => (a.data.section || 0) - (b.data.section || 0));

        const sectionsList = sidebar.querySelector('#sections-list');
        sectionsList.innerHTML = '';

        currentEntries.forEach((entry) => {
          const section = document.createElement('div');
          section.className = 'section-item';
          section.dataset.slug = entry.slug;
          section.innerHTML = `
            <span class="section-title">${entry.data.title || 'Untitled Section'}</span>
          `;

          // Set active state if this is the current entry
          const currentEntry = window.CMS.getState().entryDraft?.get('entry');
          if (currentEntry && currentEntry.get('slug') === entry.slug) {
            section.classList.add('active');
          }

          section.addEventListener('click', () => selectSection(entry));
          sectionsList.appendChild(section);
        });

        addButton.disabled = isProcessingAction;
      } catch (error) {
        console.error('Error updating sections list:', error);
      }
    };

    // Subscribe to store changes once CMS is ready
    const unsubscribe = window.CMS.store.subscribe(() => {
      updateSectionsList();
    });

    // Initial sections load
    updateSectionsList();

    // Cleanup on page unload
    window.addEventListener('unload', () => {
      if (unsubscribe) unsubscribe();
    });
  };

  // Initialize when DecapCMS is ready
  window.addEventListener('load', () => {
    if (window.CMS) {
      window.CMS.registerEventListener({
        name: 'preSave',
        handler: async (args) => {
          console.log('Saving entry:', args);
        },
      });

      initSidebar();
    }
  });
})();