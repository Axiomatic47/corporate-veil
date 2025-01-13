// CustomSidebar.js

// Wait for CMS to be fully initialized
window.addEventListener('load', function() {
  if (window.CMS) {
    window.CMS.registerInitializer({
      // This will run when CMS is fully initialized
      init: function() {
        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
          .custom-sidebar {
            position: fixed;
            left: 0;
            top: 48px;
            bottom: 0;
            width: 250px;
            background: #1A1F2C;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            padding: 20px;
            overflow-y: auto;
            z-index: 100;
            color: white;
          }

          .custom-sidebar h2 {
            margin: 0 0 16px 0;
            font-size: 18px;
            color: white;
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

          .section-item {
            padding: 12px;
            margin-bottom: 8px;
            background: #252A37;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            cursor: pointer;
            color: white;
            transition: all 0.2s;
          }

          .section-item:hover {
            background: #2F3545;
          }

          .section-item.active {
            background: #3A4055;
            border-color: #2196f3;
          }

          /* Adjust main content area */
          .css-1gj57a0-AppMainContainer {
            margin-left: 250px !important;
            width: calc(100% - 250px) !important;
          }
        `;
        document.head.appendChild(styles);

        // Create and append sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'custom-sidebar';
        sidebar.innerHTML = `
          <h2>Sections</h2>
          <button id="add-section">Add Section</button>
          <div id="sections-list"></div>
        `;
        document.body.appendChild(sidebar);

        // Add section functionality
        const addButton = sidebar.querySelector('#add-section');
        addButton.addEventListener('click', async () => {
          try {
            const collections = window.CMS.getState().collections;
            const entries = collections.get('compositions')?.entries.toJS() || [];
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
          } catch (error) {
            console.error('Error creating new section:', error);
          }
        });

        // Update sections list
        const updateSections = () => {
          try {
            const collections = window.CMS.getState().collections;
            const entries = collections.get('compositions')?.entries?.toJS() || [];
            const sortedEntries = entries.sort((a, b) =>
              (a.data.section || 0) - (b.data.section || 0)
            );

            const sectionsList = sidebar.querySelector('#sections-list');
            sectionsList.innerHTML = sortedEntries.map(entry => `
              <div class="section-item" data-slug="${entry.slug}">
                ${entry.data.title || 'Untitled Section'}
              </div>
            `).join('');

            // Add click handlers
            sectionsList.querySelectorAll('.section-item').forEach(item => {
              item.addEventListener('click', async () => {
                try {
                  const entry = sortedEntries.find(e => e.slug === item.dataset.slug);
                  if (entry) {
                    // Save current entry if needed
                    const currentEntry = window.CMS.getState().entryDraft;
                    if (currentEntry && currentEntry.get('hasChanged')) {
                      await window.CMS.store.dispatch({
                        type: 'ENTRY_PERSIST',
                        payload: {
                          collectionName: 'compositions',
                          entryDraft: currentEntry.toJS(),
                          options: { raw: true }
                        }
                      });
                    }

                    // Load selected entry
                    await window.CMS.store.dispatch({
                      type: 'DRAFT_CREATE_FROM_ENTRY',
                      payload: {
                        collectionName: 'compositions',
                        entry: entry
                      }
                    });

                    // Update active state
                    document.querySelectorAll('.section-item').forEach(s =>
                      s.classList.toggle('active', s.dataset.slug === entry.slug)
                    );
                  }
                } catch (error) {
                  console.error('Error switching sections:', error);
                }
              });
            });
          } catch (error) {
            console.error('Error updating sections:', error);
          }
        };

        // Subscribe to store changes
        window.CMS.store.subscribe(updateSections);

        // Initial update
        updateSections();
      }
    });
  }
});