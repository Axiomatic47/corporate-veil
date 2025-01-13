(() => {
  const cmsConfig = {
    config: {
      local_backend: true,  // Enable local backend
      backend: {
        name: 'git-gateway',
        branch: 'main',
        local_backend: true
      },
      media_folder: 'public/uploads',
      public_folder: '/uploads',
      collections: [
        {
          name: 'compositions',
          label: 'Compositions',
          folder: 'content/compositions',
          create: true,
          slug: '{{slug}}',
          editor: {
            preview: false
          },
          fields: [
            {
              label: 'Collection Type',
              name: 'collection_type',
              widget: 'select',
              options: ['memorandum', 'corrective'],
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
            },
            // Hidden fields for different reading levels
            {
              label: 'Title Level 1',
              name: 'title_level_1',
              widget: 'hidden',
            },
            {
              label: 'Content Level 1',
              name: 'content_level_1',
              widget: 'hidden',
            },
            {
              label: 'Title Level 3',
              name: 'title_level_3',
              widget: 'hidden',
            },
            {
              label: 'Content Level 3',
              name: 'content_level_3',
              widget: 'hidden',
            },
            {
              label: 'Title Level 5',
              name: 'title_level_5',
              widget: 'hidden',
            },
            {
              label: 'Content Level 5',
              name: 'content_level_5',
              widget: 'hidden',
            }
          ]
        }
      ]
    }
  };

  // Make config available globally
  window.cmsConfig = cmsConfig;
})();