const registerEventHandlers = () => {
  CMS.registerEventListener({
    name: 'preSave',
    handler: async function(entry) {
      if (!entry) return entry;
      
      try {
        const data = typeof entry.get === 'function' 
          ? entry.get('data')?.toJS()
          : entry.data;

        if (!data) return entry;

        // Validate section number
        if (data.section) {
          data.section = Math.min(Math.max(1, data.section), 4);
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

  // Add form initialization handler
  CMS.registerEventListener({
    name: 'preInit',
    handler: function() {
      // Remove preview pane
      const previewPane = document.querySelector('.cms-editor-visual');
      if (previewPane) {
        previewPane.style.display = 'none';
      }

      // Enhance form layout
      const editor = document.querySelector('.cms-editor-visual');
      if (editor) {
        editor.style.maxWidth = '800px';
        editor.style.margin = '0 auto';
        editor.style.padding = '2rem';
      }
    }
  });
};

export default registerEventHandlers;