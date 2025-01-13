const cmsConfig = {
  config: {
    load_config_file: false,
    backend: {
      name: 'github',
      repo: 'Axiomatic47/corporate-veil',
      branch: 'main',
      base_url: 'https://api.netlify.com'
    },
    local_backend: {
      url: 'http://localhost:8081/api/v1'
    },
    media_folder: 'public/uploads',
    public_folder: '/uploads',
    publish_mode: 'simple',
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
          { label: 'Title', name: 'title', widget: 'string' },
          { label: 'Description', name: 'description', widget: 'text' },
          {
            label: 'Reading Level',
            name: 'reading_level',
            widget: 'select',
            options: ['1', '3', '5'],
            required: true
          },
          {
            label: 'Content Level 1',
            name: 'content_level_1',
            widget: 'markdown',
            required: true
          },
          {
            label: 'Content Level 3',
            name: 'content_level_3',
            widget: 'markdown',
            required: true
          },
          {
            label: 'Content Level 5',
            name: 'content_level_5',
            widget: 'markdown',
            required: true
          },
          {
            label: 'Title Level 1',
            name: 'title_level_1',
            widget: 'string',
            required: true
          },
          {
            label: 'Title Level 3',
            name: 'title_level_3',
            widget: 'string',
            required: true
          },
          {
            label: 'Title Level 5',
            name: 'title_level_5',
            widget: 'string',
            required: true
          }
        ],
        sortable_fields: ['title', 'section'],
        view_filters: [
          {
            label: 'Memorandum',
            field: 'collection_type',
            pattern: 'memorandum'
          },
          {
            label: 'Corrective',
            field: 'collection_type',
            pattern: 'corrective'
          }
        ]
      }
    ]
  }
};

export default cmsConfig;