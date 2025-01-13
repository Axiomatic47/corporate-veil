import AdminSidebar from './AdminSidebar';
import { createRoot } from 'react-dom/client';

const registerEventHandlers = () => {
  let currentEntries = [];
  let currentEntry = null;
  
  const initializeSidebar = async () => {
    try {
      const entries = await CMS.getEntries({ collection_name: 'compositions' });
      currentEntries = entries;
      
      // Remove any existing sidebar
      let existingSidebar = document.getElementById('admin-sidebar');
      if (existingSidebar) {
        existingSidebar.remove();
      }
      
      // Create new sidebar container
      const sidebarContainer = document.createElement('div');
      sidebarContainer.id = 'admin-sidebar';
      document.body.insertBefore(sidebarContainer, document.body.firstChild);
      
      // Adjust main content area
      const mainContent = document.querySelector('.css-1gj57a0-AppMainContainer');
      if (mainContent) {
        mainContent.style.marginLeft = '16rem';
        mainContent.style.width = 'calc(100% - 16rem)';
      }

      // Hide the "Previous Section Title" field
      const previousSectionField = document.querySelector('[data-field-name="previous_section"]');
      if (previousSectionField) {
        previousSectionField.style.display = 'none';
      }
      
      // Render sidebar
      const root = createRoot(sidebarContainer);
      root.render(
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
            const selectedEntry = entries.find(e => e.data.title === section.title);
            if (selectedEntry) {
              await CMS.entry.select(selectedEntry);
            }
          }}
          onSectionsReorder={async (newOrder) => {
            try {
              for (const item of newOrder) {
                const entry = entries.find(e => e.data.title === item.title);
                if (entry) {
                  entry.data.section = item.section;
                  await CMS.entry.persist(entry);
                }
              }
              currentEntries = await CMS.getEntries({ collection_name: 'compositions' });
              initializeSidebar();
            } catch (error) {
              console.error('Error reordering sections:', error);
            }
          }}
        />
      );
    } catch (error) {
      console.error('Error initializing sidebar:', error);
    }
  };

  // Register event listeners
  CMS.registerEventListener({
    name: 'preInit',
    handler: function() {
      setTimeout(initializeSidebar, 1000);
    }
  });

  CMS.registerEventListener({
    name: 'entrySelected',
    handler: function(entry) {
      currentEntry = entry;
      initializeSidebar();
    }
  });
};

export default registerEventHandlers;