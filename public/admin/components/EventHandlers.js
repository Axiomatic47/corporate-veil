import AdminSidebar from './AdminSidebar';
import useFormState from './FormStateManager';

const registerEventHandlers = () => {
  let currentEntries = [];
  
  const initializeSidebar = async (collection) => {
    const entries = await CMS.getEntries({ collection_name: 'compositions' });
    currentEntries = entries;
    
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'admin-sidebar';
    document.body.insertBefore(sidebarContainer, document.body.firstChild);
    
    const mainContent = document.querySelector('.css-1gj57a0-AppMainContainer');
    if (mainContent) {
      mainContent.style.marginLeft = '16rem';
    }
  };

  CMS.registerEventListener({
    name: 'preSave',
    handler: async function(entry) {
      if (!entry) return entry;
      
      try {
        const data = typeof entry.get === 'function' 
          ? entry.get('data')?.toJS()
          : entry.data;

        if (!data) return entry;

        // Validate section number is positive
        if (data.section) {
          data.section = Math.max(1, data.section);
        }

        // Validate reading level
        if (data.reading_level) {
          const validLevels = ['1', '3', '5'];
          if (!validLevels.includes(data.reading_level)) {
            data.reading_level = '3';
          }
        }

        // Check for duplicate entries
        const entries = await CMS.getEntries({ collection_name: 'compositions' });
        const existingEntry = entries.find(e => {
          const entryData = typeof e.get === 'function'
            ? e.get('data')?.toJS()
            : e.data;
          return entryData?.title === data.title && 
                 entryData?.section === data.section &&
                 entryData?.collection_type === data.collection_type;
        });
        
        if (existingEntry) {
          throw new Error('A composition with this title, section, and type already exists.');
        }

        // Validate previous section exists if specified
        if (data.previous_section) {
          const previousSectionExists = entries.some(e => {
            const entryData = typeof e.get === 'function'
              ? e.get('data')?.toJS()
              : e.data;
            return entryData?.title === data.previous_section &&
                   entryData?.collection_type === data.collection_type;
          });

          if (!previousSectionExists) {
            throw new Error('The specified previous section does not exist.');
          }
        }

        // Auto-generate titles if not provided
        if (!data.title_level_1) {
          data.title_level_1 = data.title;
        }
        if (!data.title_level_3) {
          data.title_level_3 = data.title;
        }
        if (!data.title_level_5) {
          data.title_level_5 = data.title;
        }

      } catch (error) {
        console.error('Error in preSave handler:', error);
        throw error;
      }
      
      return entry;
    }
  });

  CMS.registerEventListener({
    name: 'preInit',
    handler: function() {
      // Remove preview pane
      const previewPane = document.querySelector('.cms-editor-visual');
      if (previewPane) {
        previewPane.style.display = 'none';
      }

      // Initialize sidebar after a short delay to ensure DOM is ready
      setTimeout(() => {
        initializeSidebar();
      }, 500);

      // Enhance form layout
      const editor = document.querySelector('.cms-editor-visual');
      if (editor) {
        editor.style.maxWidth = '800px';
        editor.style.margin = '0 auto';
        editor.style.padding = '2rem';
      }

      // Add unsaved changes warning
      window.addEventListener('beforeunload', (e) => {
        const form = document.querySelector('form');
        if (form && form.dirty) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
  });

  // Handle form changes
  CMS.registerEventListener({
    name: 'change',
    handler: function(e) {
      const form = document.querySelector('form');
      if (form) {
        form.dirty = true;
      }
    }
  });
};

export default registerEventHandlers;
