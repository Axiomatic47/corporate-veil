const PreviewComponent = createClass({
  getInitialState() {
    return {
      sections: [],
      error: null,
      loading: true
    };
  },

  componentDidMount() {
    if (this.props.entry) {
      this.loadSections();
    }
  },

  componentDidUpdate(prevProps) {
    if (this.props.entry !== prevProps.entry) {
      this.loadSections();
    }
  },

  async loadSections() {
    const entry = this.props.entry;
    if (!entry) return;

    try {
      this.setState({ loading: true });

      const data = entry.get('data');
      const title = data.get('title');
      const collectionType = data.get('collection_type');

      const response = await fetch('/__api/collections/entries/compositions');
      const entries = await response.json();

      const sections = entries
        .filter(e =>
          e.data.title === title &&
          e.data.collection_type === collectionType
        )
        .map(e => ({
          section: e.data.section,
          slug: e.slug
        }))
        .sort((a, b) => a.section - b.section);

      this.setState({
        sections,
        error: null,
        loading: false
      });
    } catch (error) {
      console.error('Error loading sections:', error);
      this.setState({
        error: 'Failed to load sections',
        loading: false
      });
    }
  },

  handleCreateSection() {
    const entry = this.props.entry;
    if (!entry) return;

    const data = entry.get('data');
    const currentSection = parseInt(data.get('section') || '0', 10);

    const newData = {
      title: data.get('title'),
      description: data.get('description'),
      collection_type: data.get('collection_type'),
      section: currentSection + 1,
      body: '*This is the section content, which changes by selection of navigation bar links to the left*'
    };

    CMS.entry.set({ data: newData });
  },

  handleSectionClick(section) {
    const entry = this.props.entry;
    if (!entry) return;

    const data = entry.get('data');
    const newData = data.set('section', section);
    CMS.entry.set({ data: newData });
  },

  render() {
    const entry = this.props.entry;
    if (!entry) return null;

    const data = entry.get('data');
    if (!data) return null;

    const currentSection = parseInt(data.get('section') || '0', 10);
    const collectionType = data.get('collection_type');
    const collectionTitle = collectionType === 'memorandum'
      ? 'Memorandum and Manifestation'
      : 'Corrective Measures';

    return h('div', { className: 'preview-container' },
      h('div', { className: 'sidebar' },
        h('div', { className: 'collection-title' }, collectionTitle),
        h('div', { className: 'composition-title' }, data.get('title')),
        this.state.error && h('div', { className: 'error-message' }, this.state.error),
        this.state.loading
          ? h('div', { className: 'loading-message' }, 'Loading sections...')
          : h('div', null,
              h('button', {
                className: 'new-section-button',
                onClick: this.handleCreateSection
              }, 'New Section'),
              h('div', { className: 'section-list' },
                this.state.sections.map(section =>
                  h('button', {
                    key: section.section,
                    className: `section-button ${section.section === currentSection ? 'active' : ''}`,
                    onClick: () => this.handleSectionClick(section.section)
                  }, `Section ${section.section}`)
                )
              )
            )
      ),
      h('div', { className: 'preview-content' },
        h('h1', {}, data.get('title')),
        h('div', {}, this.props.widgetFor('body'))
      )
    );
  }
});

// Register the preview component
CMS.registerPreviewTemplate('compositions', PreviewComponent);