// /public/admin/components/CustomSidebar.js

const CustomSidebar = {
  init: function() {
    if (!window.CMS) {
      console.error('CMS not initialized');
      return;
    }

    let currentEntries = [];

    // Create and append sidebar
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
      }

      #add-section:hover {
        background: #1976d2;
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

    // Add sidebar to page
    document.body.appendChild(sidebar);

    // Initialize add section button
    const addButton = sidebar.querySelector('#add-section');
    addButton.addEventListener('click', async () => {
      const store = window.CMS.store;
      const collections = store.getState().collections;
      const entries = collections.get('compositions')?.entries?.toJS() || [];
      const nextSection = entries.length > 0 ? Math.max(...entries.map(e => e.data.section || 0)) + 1 : 1;

      store.dispatch({
        type: 'DRAFT_CREATE_NEW_ENTRY',
        payload: {
          collectionName: 'compositions',
          data: {
            collection_type: 'memorandum',
            section: nextSection,
            title: `Section ${nextSection}`,
            content_level_1: '',
            content_level_3: '',
            content_level_5: ''
          }
        }
      });
    });

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

        // Click handler - select section
        section.addEventListener('click', () => {
          document.querySelectorAll('.section-item').forEach(item => item.classList.remove('active'));
          section.classList.add('active');

          store.dispatch({
            type: 'SELECT_ENTRY',
            payload: {
              collection: 'compositions',
              slug: entry.slug
            }
          });
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
    };

    // Enable drag and drop reordering
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

    // Helper function for drag and drop
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

    // Update section numbers after reordering
    const updateSectionOrder = () => {
      const sections = Array.from(document.querySelectorAll('.section-item'));
      const store = window.CMS.store;

      sections.forEach((section, index) => {
        const entry = currentEntries[parseInt(section.dataset.index)];
        if (entry && entry.data.section !== index + 1) {
          store.dispatch({
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
      });
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