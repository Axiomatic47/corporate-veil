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

        // Ensure section numbers are valid
        if (data.section) {
          data.section = Math.min(Math.max(1, data.section), 4);
        }

        // Ensure reading levels are valid
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
          const titleField = document.querySelector('[name="title"]');
          if (titleField) titleField.setAttribute('readonly', true);
        }

      } catch (error) {
        console.error('Error in preSave handler:', error);
      }
      
      return entry;
    }
  });
};

export default registerEventHandlers;