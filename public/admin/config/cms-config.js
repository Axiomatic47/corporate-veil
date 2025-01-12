const cmsConfig = {
  config: {
    load_config_file: false,
    backend: {
      name: 'proxy',
      branch: 'main',
      proxy_url: 'http://localhost:8081/api/v1'
    },
    local_backend: true,
    media_folder: 'public/uploads',
    public_folder: '/uploads',
    publish_mode: 'simple',
    collections: [
      {
        name: 'compositions',
        label: 'Compositions',
        folder: 'content/compositions',
        create: true,
        slug: '{{year}}-{{month}}-{{day}}-{{slug}}',
        fields: [
          { label: 'Title', name: 'title', widget: 'string' },
          { label: 'Description', name: 'description', widget: 'text' },
          {
            label: 'Collection Type',
            name: 'collection_type',
            widget: 'select',
            options: ['memorandum', 'corrective'],
            required: true
          },
          { label: 'Section', name: 'section', widget: 'number', default: 1 },
          { label: 'Content', name: 'body', widget: 'markdown' }
        ],
        sortable_fields: ['title', 'description'],
        view_groups: [
          {
            label: 'Collection Type',
            field: 'collection_type',
            groups: [
              { label: 'Memorandum', value: 'memorandum' },
              { label: 'Corrective', value: 'corrective' }
            ]
          }
        ],
        preview: true,
        publish: true
      }
    ],
    display_url: window.location.origin,
    site_url: window.location.origin
  }
};

export default cmsConfig;