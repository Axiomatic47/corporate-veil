const registerEventHandlers = () => {
  CMS.registerEventListener({
    name: 'preSave',
    handler: async function(entry) {
      if (!entry) return entry;
      
      try {
        // Handle both Immutable.js and regular objects
        const data = typeof entry.get === 'function' 
          ? entry.get('data')?.toJS()
          : entry.data;

        if (!data || !data.title) return entry;

        const entries = await CMS.getEntries({ collection_name: 'compositions' });
        const existingEntry = entries.find(e => {
          const entryData = typeof e.get === 'function'
            ? e.get('data')?.toJS()
            : e.data;
          return entryData?.title === data.title && entryData?.section === 1;
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