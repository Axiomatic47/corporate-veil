(() => {
  const cmsConfig = {
    config: {
      local_backend: true,
      backend: {
        name: 'git-gateway',
        branch: 'main'
      },
      media_folder: 'public/uploads',
      public_folder: '/uploads',
      collections: [
        {
          name: 'compositions',
          label: 'Compositions',
          folder: 'content/compositions',
          create: true,
          identifier_field: 'title',
          fields: [
            {
              label: 'Collection Type',
              name: 'collection_type',
              widget: 'select',
              options: [
                { label: 'Memorandum', value: 'memorandum' },
                { label: 'Corrective', value: 'corrective' }
              ],
              required: true
            },
            {
              label: 'Section',
              name: 'section',
              widget: 'number',
              value_type: 'int',
              min: 1,
              required: true
            },
            {
              label: 'Title',
              name: 'title',
              widget: 'string',
              required: true
            },
            {
              label: 'Description',
              name: 'description',
              widget: 'text',
              required: true
            },
            {
              label: 'Content',
              name: 'content',
              widget: 'markdown',
              required: true
            }
          ]
        }
      ]
    }
  };

  // Make config available globally
  window.cmsConfig = cmsConfig;
})();