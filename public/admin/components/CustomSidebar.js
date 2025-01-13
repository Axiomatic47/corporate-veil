// /public/admin/components/CustomSidebar.js

const CustomSidebar = {
  init: function() {
    let currentEntries = [];
    let isProcessingAction = false;

    const createNewSection = async () => {
      if (isProcessingAction) return;
      isProcessingAction = true;

      try {
        const store = window.CMS.store;
        const collections = store.getState().collections;
        const entries = collections.get('compositions')?.entries?.toJS() || [];
        const nextSection = entries.length > 0 ?
          Math.max(...entries.map(e => e.data.section || 0)) + 1 : 1;

        // Save current form state if needed
        const currentEntry = store.getState().entryDraft;
        if (currentEntry && currentEntry.get('hasChanged')) {
          await store.dispatch({
            type: 'ENTRY_PERSIST',
            payload: {
              collectionName: 'compositions',
              entryDraft: currentEntry.toJS(),
              options: { raw: true }
            }
          });
        }

        // Create new entry
        await store.dispatch({
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

        // Select the new entry after a short delay
        setTimeout(() => {
          const newEntries = store.getState().collections.get('compositions')?.entries?.toJS() || [];
          const newEntry = newEntries.find(e => e.data.section === nextSection);
          if (newEntry) {
            store.dispatch({
              type: 'DRAFT_CREATE_FROM_ENTRY',
              payload: {
                collectionName: 'compositions',
                entry: newEntry
              }
            });
          }
        }, 500);
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
        const store = window.CMS.store;

        // Save current form state if needed
        const currentEntry = store.getState().entryDraft;
        if (currentEntry && currentEntry.get('hasChanged')) {
          await store.dispatch({
            type: 'ENTRY_PERSIST',
            payload: {
              collectionName: 'compositions',
              entryDraft: currentEntry.toJS(),
              options: { raw: true }
            }
          });
        }

        // Load selected entry
        await store.dispatch({
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

      .section-item.dragging {
        opacity: 0.5;
        background: #e0e0e0;
      }

      .section-item.active {
        background: #e3f2fd;
        border-color: #2196f3;
      }

      .drag-handle {
        margin-right: 8px;
        color: #999;
        cursor: grab;
      }

      .section-title {
        flex-grow: 1;
      }

      /* Main content adjustment */
      .css-1gj57a0-AppMainContainer {
        margin-left: 250px !important;
        width: calc(100% - 250px) !important;
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(sidebar);

    // Initialize add section button
    const addButton = sidebar.querySelector('#add-section');
    addButton.addEventListener('click', createNewSection);

    // Update sections list
    const updateSectionsList = () => {
      const store = window.CMS.store;
      const collections = store.getState().collections;
      const entries = collections.get('compositions')?.entries?.toJS() || [];
      currentEntries = entries.sort((a, b) => (a.data.section || 0) - (b.data.section || 0));

      const sectionsList = sidebar.querySelector('#sections-list');
      sectionsList.innerHTML = '';

      currentEntries.forEach((entry, index) => {
        const section = document.createElement('div');
        section.className = 'section-item';
        section.draggable = true;
        section.dataset.index = index;
        section.dataset.slug = entry.slug;
        section.innerHTML = `
          <span class="drag-handle">≡</span>
          <span class="section-title">${entry.data.title || 'Untitled Section'}</span>
        `;

        // Set active state if this is the current entry
        const currentSlug = store.getState().entryDraft?.get('entry')?.get('slug');
        if (currentSlug === entry.slug) {
          section.classList.add('active');
        }

        // Click handler
        section.addEventListener('click', (e) => {
          // Only handle click if not dragging
          if (!section.classList.contains('dragging')) {
            selectSection(entry);
          }
        });

        // Drag handlers
        section.addEventListener('dragstart', (e) => {
          section.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        section.addEventListener('dragend', () => {
          section.classList.remove('dragging');
          updateSectionOrder();
        });

        sectionsList.appendChild(section);
      });

      // Update add button state
      addButton.disabled = isProcessingAction;
    };

    // Set up drag and drop
    const sectionsList = sidebar.querySelector('#sections-list');
    sectionsList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const dragging = document.querySelector('.section-item.dragging');
      if (!dragging) return;

      const afterElement = getDragAfterElement(sectionsList, e.clientY);
      if (afterElement) {
        sectionsList.insertBefore(dragging, afterElement);
      } else {
        sectionsList.appendChild(dragging);
      }
    });

    const getDragAfterElement = (container, y) => {
      const draggableElements = [...container.querySelectorAll('.section-item:not(.dragging)')];
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

    const updateSectionOrder = async () => {
      if (isProcessingAction) return;
      isProcessingAction = true;

      try {
        const sections = Array.from(document.querySelectorAll('.section-item'));
        const store = window.CMS.store;

        for (const [index, section] of sections.entries()) {
          const entry = currentEntries[parseInt(section.dataset.index)];
          if (entry && entry.data.section !== index + 1) {
            await store.dispatch({
              type: 'ENTRY_PERSIST',
              payload: {
                collectionName: 'compositions',
                entryDraft: {
                  ...entry,
                  data: {
                    ...entry.data,
                    section: index + 1
                  }
                },
                options: { raw: true }
              }
            });
          }
        }
      } catch (error) {
        console.error('Error updating section order:', error);
      } finally {
        isProcessingAction = false;
        updateSectionsList();
      }
    };

    // Subscribe to store changes
    window.CMS.store.subscribe(() => {
      updateSectionsList();
    });

    // Initial sections load
    updateSectionsList();
  }
};

// Initialize when the script loads
if (window.CMS) {
  CustomSidebar.init();
} else {
  window.addEventListener('load', () => {
    CustomSidebar.init();
  });
}