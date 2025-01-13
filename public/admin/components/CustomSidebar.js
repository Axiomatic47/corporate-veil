(function() {
  const waitForCMS = (callback) => {
    const check = () => {
      if (window.CMS) {
        callback();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  };

  const waitForElement = (selector, callback) => {
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  };

  const initSidebar = () => {
    // Add styles first
    const styles = document.createElement('style');
    styles.textContent = `
      .nc-collectionPage {
        margin-left: 250px !important;
        width: calc(100% - 250px) !important;
      }

      #custom-sidebar {
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

      #custom-sidebar h2 {
        margin: 0 0 16px 0;
        font-size: 18px;
      }

      #add-section-btn {
        width: 100%;
        padding: 8px;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 16px;
      }

      .section-item {
        padding: 12px;
        margin-bottom: 8px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
      }

      .section-item.active {
        background: #e3f2fd;
        border-color: #2196f3;
      }
    `;
    document.head.appendChild(styles);

    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'custom-sidebar';
    sidebar.innerHTML = `
      <h2>Sections</h2>
      <button id="add-section-btn">Add Section</button>
      <div id="sections-list"></div>
    `;

    // Wait for the CMS root element
    waitForElement('#nc-root', (root) => {
      root.appendChild(sidebar);

      // Initialize functionality
      const addButton = document.getElementById('add-section-btn');
      const sectionsList = document.getElementById('sections-list');

      // Add section handler
      addButton.addEventListener('click', async () => {
        try {
          const currentEntries = window.CMS.getState().collections.get('compositions').entries;
          const nextSection = currentEntries.size + 1;

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
        } catch (error) {
          console.error('Error creating new section:', error);
        }
      });

      // Update sections list
      const updateSections = () => {
        const state = window.CMS.getState();
        const entries = state.collections.get('compositions')?.entries;

        if (!entries) return;

        const sortedEntries = entries.toJS()
          .sort((a, b) => (a.data.section || 0) - (b.data.section || 0));

        sectionsList.innerHTML = sortedEntries.map(entry => `
          <div class="section-item" data-slug="${entry.slug}">
            ${entry.data.title || 'Untitled Section'}
          </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.section-item').forEach(item => {
          item.addEventListener('click', async () => {
            const entry = sortedEntries.find(e => e.slug === item.dataset.slug);
            if (entry) {
              await window.CMS.store.dispatch({
                type: 'DRAFT_CREATE_FROM_ENTRY',
                payload: {
                  collectionName: 'compositions',
                  entry
                }
              });
            }
          });
        });
      };

      // Subscribe to store changes
      window.CMS.store.subscribe(updateSections);

      // Initial update
      updateSections();
    });
  };

  // Initialize when CMS is ready
  waitForCMS(() => {
    window.CMS.registerEventListener({
      name: 'preSave',
      handler: async () => {
        // Handle pre-save events if needed
      },
    });

    initSidebar();
  });
})();