// /public/admin/components/CustomSidebar.js

const CustomSidebar = {
  init: function() {
    if (!window.CMS) {
      console.error('CMS not initialized');
      return;
    }

    // Wait for CMS to be ready
    window.CMS.registerEventListener({
      name: 'preSave',
      handler: () => {
        refreshSidebar();
        return true;
      },
    });

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
        padding: 8px;
        margin-bottom: 8px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
      }

      .section-item:hover {
        background: #f0f0f0;
      }

      .section-item.dragging {
        opacity: 0.5;
      }

      .css-1gj57a0-AppMainContainer {
        margin-left: 250px !important;
        width: calc(100% - 250px) !important;
      }
    `;

    document.head.appendChild(styles);

    // Add sidebar after a delay to ensure CMS is loaded
    setTimeout(() => {
      document.body.appendChild(sidebar);

      // Initialize handlers
      initializeHandlers(sidebar);

      // Initial refresh
      refreshSidebar();

      // Adjust main content area
      const mainContent = document.querySelector('[class*="AppMainContainer"]');
      if (mainContent) {
        mainContent.style.marginLeft = '250px';
        mainContent.style.width = 'calc(100% - 250px)';
      }
    }, 1000);

    function initializeHandlers(sidebar) {
      const addButton = sidebar.querySelector('#add-section');
      const sectionsList = sidebar.querySelector('#sections-list');

      // Add section button handler
      addButton.addEventListener('click', () => {
        window.CMS.store.dispatch({
          type: 'DRAFT_CREATE_NEW_ENTRY',
          payload: {
            collectionName: 'compositions',
            data: {
              collection_type: 'memorandum',
              title: 'New Section',
              section: getNextSectionNumber()
            }
          }
        });
      });

      // Drag and drop handlers
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
    }

    function refreshSidebar() {
      const sectionsList = document.querySelector('#sections-list');
      if (!sectionsList) return;

      const collections = window.CMS.store.getState().collections;
      if (!collections) return;

      const entries = collections.get('compositions')?.entries?.toJS() || [];
      const sortedEntries = entries.sort((a, b) =>
        (a.data.section || 0) - (b.data.section || 0)
      );

      sectionsList.innerHTML = '';
      sortedEntries.forEach((entry, index) => {
        const section = document.createElement('div');
        section.className = 'section-item';
        section.draggable = true;
        section.dataset.slug = entry.slug;
        section.innerHTML = `
          <span style="margin-right: 8px;">≡</span>
          ${entry.data.title || 'Untitled'}
        `;

        section.addEventListener('click', () => {
          window.CMS.store.dispatch({
            type: 'SELECT_ENTRY',
            payload: {
              collection: 'compositions',
              slug: entry.slug
            }
          });
        });

        section.addEventListener('dragstart', () => section.classList.add('dragging'));
        section.addEventListener('dragend', () => {
          section.classList.remove('dragging');
          updateSectionOrder();
        });

        sectionsList.appendChild(section);
      });
    }

    function getNextSectionNumber() {
      const collections = window.CMS.store.getState().collections;
      if (!collections) return 1;

      const entries = collections.get('compositions')?.entries?.toJS() || [];
      return Math.max(...entries.map(e => e.data.section || 0), 0) + 1;
    }

    function getDragAfterElement(container, y) {
      const draggableElements = [
        ...container.querySelectorAll('.section-item:not(.dragging)')
      ];

      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function updateSectionOrder() {
      const sectionsList = document.querySelector('#sections-list');
      if (!sectionsList) return;

      const sections = Array.from(sectionsList.querySelectorAll('.section-item'));
      sections.forEach((section, index) => {
        const entry = window.CMS.store.getState().collections
          .getIn(['compositions', 'entries'])
          .find(e => e.get('slug') === section.dataset.slug);

        if (entry && entry.getIn(['data', 'section']) !== index + 1) {
          window.CMS.store.dispatch({
            type: 'DRAFT_CREATE_FROM_ENTRY',
            payload: {
              collectionName: 'compositions',
              entry: entry.setIn(['data', 'section'], index + 1).toJS()
            }
          });
        }
      });
    }
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