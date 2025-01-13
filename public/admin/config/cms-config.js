(() => {
  const cmsConfig = {
    config: {
      load_config_file: false,
      local_backend: true,
      backend: {
        name: 'github',
        repo: 'Axiomatic47/corporate-veil',
        branch: 'main',
        auth_endpoint: 'auth'
      },
      publish_mode: 'editorial_workflow',
      media_folder: 'public/uploads',
      public_folder: '/uploads',
      editor: {
        preview: false
      },
      collections: [
        {
          name: 'compositions',
          label: 'Compositions',
          folder: 'content/compositions',
          create: true,
          sortable_fields: ['section'],
          sort: 'section',
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