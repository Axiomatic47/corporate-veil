// PreviewComponent.js
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
      this.loadSections(this.props);
    }
  },

  componentDidUpdate(prevProps) {
    // Only reload if we have an entry and it's different from the previous one
    if (this.props.entry && this.props.entry !== prevProps.entry) {
      this.loadSections(this.props);
    }
  },

  loadSections(props) {
    if (!props.entry || !props.entries) return;

    try {
      const entry = props.entry;
      const data = entry.get('data');
      const title = data.get('title');
      const collectionType = data.get('collection_type');

      // Get all entries from the compositions collection
      const allEntries = props.entries.get('compositions');
      if (!allEntries) return;

      // Filter and sort sections
      const sections = allEntries
        .filter(e => {
          const entryData = e.get('data');
          return entryData &&
                 entryData.get('title') === title &&
                 entryData.get('collection_type') === collectionType;
        })
        .map(e => ({
          section: e.getIn(['data', 'section']),
          slug: e.get('slug')
        }))
        .toJS()
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

  handleNewSection() {
    const { entry } = this.props;
    if (!entry) return;

    try {
      const data = entry.get('data');
      const currentSection = parseInt(data.get('section') || '0', 10);

      // Create new entry data
      const newData = data.withMutations(map => {
        map.set('section', currentSection + 1);
      });

      // Update the entry in CMS
      if (CMS?.entry?.set) {
        const newEntry = entry.set('data', newData);
        CMS.entry.set(newEntry);
      }
    } catch (error) {
      console.error('Error creating section:', error);
      this.setState({ error: 'Failed to create new section' });
    }
  },

  handleSectionClick(slug) {
    const { entries } = this.props;
    if (!entries) return;

    try {
      // Find the entry with this slug
      const allEntries = entries.get('compositions');
      const targetEntry = allEntries.find(e => e.get('slug') === slug);

      if (targetEntry && CMS?.entry?.set) {
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
                onClick: () => this.handleNewSection()
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

// Register preview component
if (typeof CMS !== 'undefined') {
  CMS.registerPreviewTemplate('compositions', PreviewComponent);
}