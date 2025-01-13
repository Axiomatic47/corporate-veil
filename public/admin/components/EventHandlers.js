import React from 'react';
import AdminSidebar from './AdminSidebar.js';
import { createRoot } from 'react-dom/client';

const registerEventHandlers = () => {
  let currentEntries = [];
  let currentEntry = null;

  const initializeSidebar = async () => {
    try {
      console.log('Initializing sidebar...');
      const entries = await window.CMS.getEntries({ collection_name: 'compositions' });
      currentEntries = entries;

      // Remove any existing sidebar
      let existingSidebar = document.getElementById('admin-sidebar');
      if (existingSidebar) {
        existingSidebar.remove();
      }

      // Create new sidebar container
      const sidebarContainer = document.createElement('div');
      sidebarContainer.id = 'admin-sidebar';
      document.body.appendChild(sidebarContainer);

      // Adjust main content area
      const mainContent = document.querySelector('.css-1gj57a0-AppMainContainer');
      if (mainContent) {
        mainContent.style.marginLeft = '16rem';
        mainContent.style.width = 'calc(100% - 16rem)';
      }

      // Hide the "Previous Section Title" field if it exists
      const previousSectionField = document.querySelector('[data-field-name="previous_section"]');
      if (previousSectionField) {
        previousSectionField.style.display = 'none';
      }

      console.log('Rendering sidebar with entries:', entries);

      // Render sidebar using React 18's createRoot
      const root = createRoot(sidebarContainer);
      root.render(
        <React.StrictMode>
          <AdminSidebar
            sections={entries.map(entry => ({
              title: entry.data.title,
              section: entry.data.section
            }))}
            currentSection={currentEntry ? {
              title: currentEntry.data.title,
              section: currentEntry.data.section
            } : null}
            onSectionSelect={async (section) => {
              console.log('Section selected:', section);
              const selectedEntry = entries.find(e => e.data.title === section.title);
              if (selectedEntry) {
                await window.CMS.entry.select(selectedEntry);
              }
            }}
            onSectionsReorder={async (newOrder) => {
              try {
                console.log('Reordering sections:', newOrder);
                for (const item of newOrder) {
                  const entry = entries.find(e => e.data.title === item.title);
                  if (entry) {
                    entry.data.section = item.section;
                    await window.CMS.entry.persist(entry);
                  }
                }
                currentEntries = await window.CMS.getEntries({ collection_name: 'compositions' });
                initializeSidebar();
              } catch (error) {
                console.error('Error reordering sections:', error);
              }
            }}
          />
        </React.StrictMode>
      );
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
    }
  });
};

export default registerEventHandlers;