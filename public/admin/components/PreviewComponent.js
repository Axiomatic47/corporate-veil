// PreviewComponent.js
const PreviewComponent = createClass({
  getInitialState() {
    return {
      sections: [],
      error: null,
      loading: true,
      initialized: false
    };
  },

  componentDidMount() {
    // Initialize when mounted
    this.initialize();
  },

  async initialize() {
    if (this.props.entry) {
      try {
        await this.loadSections();
        this.setState({ initialized: true });
      } catch (error) {
        console.error('Initialization error:', error);
        this.setState({ error: 'Failed to initialize preview' });
      }
    }
  },

  componentDidUpdate(prevProps) {
    // Reload sections if entry changes
    if (this.props.entry && this.props.entry !== prevProps.entry) {
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

      // Use entries prop instead of fetch
      const entries = this.props.entries.get('compositions');
      if (!entries) {
        throw new Error('No entries found');
      }

      const sections = entries
        .filter(e => {
          const entryData = e.get('data');
          return entryData.get('title') === title && 
                 entryData.get('collection_type') === collectionType;
        })
        .map(e => ({
          section: e.get('data').get('section'),
          slug: e.get('slug')
        }))
        .sort((a, b) => a.section - b.section)
        .toJS();

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

  handleNewSection() {
    if (!this.state.initialized) return;
    
    const entry = this.props.entry;
    if (!entry) return;

    try {
      const data = entry.get('data');
      const currentSection = parseInt(data.get('section') || '0', 10);
      const newSection = currentSection + 1;

      // Create new entry data
      const newData = data.withMutations(map => {
        map.set('section', newSection);
      });

      // Update the entry
      this.props.entry = this.props.entry.set('data', newData);
      
      // Notify CMS
      if (CMS.entry && typeof CMS.entry.set === 'function') {
        CMS.entry.set(this.props.entry);
      }
    } catch (error) {
      console.error('Error creating new section:', error);
      this.setState({ error: 'Failed to create new section' });
    }
  },

  handleSectionClick(sectionSlug) {
    if (!this.state.initialized) return;

    try {
      // Find the entry with matching slug
      const targetEntry = this.props.entries
        .get('compositions')
        .find(e => e.get('slug') === sectionSlug);

      if (targetEntry && CMS.entry && typeof CMS.entry.set === 'function') {
        CMS.entry.set(targetEntry);
      }
    } catch (error) {
      console.error('Error switching sections:', error);
      this.setState({ error: 'Failed to switch sections' });
    }
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
                onClick: () => this.handleNewSection(),
                disabled: !this.state.initialized
              }, 'New Section'),
              h('div', { className: 'section-list' },
                this.state.sections.map(section =>
                  h('button', {
                    key: section.section,
                    className: `section-button ${section.section === currentSection ? 'active' : ''}`,
                    onClick: () => this.handleSectionClick(section.slug)
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
if (typeof CMS !== 'undefined') {
  CMS.registerPreviewTemplate('compositions', PreviewComponent);
}