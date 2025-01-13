'use strict';

const PreviewComponent = createClass({
  getInitialState() {
    return {
      sections: [],
      error: null,
      loading: true
    };
  },

  componentDidMount() {
    // Log mount for debugging
    console.log('PreviewComponent mounted');
    this.initializePreview();
  },

  componentDidUpdate(prevProps) {
    if (this.props.entry !== prevProps.entry) {
      this.initializePreview();
    }
  },

  initializePreview() {
    const { entry, entries } = this.props;
    console.log('Initializing preview with entry:', entry?.toJS());
    console.log('Available entries:', entries?.toJS());

    if (!entry || !entries) {
      console.log('Missing required props');
      return;
    }

    this.loadSections();
  },

  loadSections() {
    const { entry, entries } = this.props;
    if (!entry || !entries) return;

    try {
      console.log('Loading sections...');
      const data = entry.get('data');
      const title = data.get('title');
      const collectionType = data.get('collection_type');

      console.log('Current entry data:', { title, collectionType });

      const compositions = entries.get('compositions');
      if (!compositions) {
        console.log('No compositions found');
        return;
      }

      const sections = compositions
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

      console.log('Loaded sections:', sections);

      this.setState({
        sections,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading sections:', error);
      this.setState({
        error: error.message,
        loading: false
      });
    }
  },

  handleNewSection() {
    console.log('Creating new section...');
    const { entry } = this.props;
    if (!entry) return;

    try {
      const data = entry.get('data');
      const currentSection = parseInt(data.get('section') || '0', 10);
      const newSection = currentSection + 1;

      console.log('Creating section:', newSection);

      const newData = data.withMutations(map => {
        map.set('section', newSection);
      });

      const newEntry = entry.set('data', newData);
      
      if (CMS?.entry?.set) {
        CMS.entry.set(newEntry);
        console.log('New section created successfully');
      } else {
        throw new Error('CMS entry API not available');
      }
    } catch (error) {
      console.error('Error creating new section:', error);
      this.setState({ error: 'Failed to create new section: ' + error.message });
    }
  },

  handleSectionClick(slug) {
    console.log('Switching to section:', slug);
    const { entries } = this.props;
    if (!entries) return;

    try {
      const compositions = entries.get('compositions');
      const targetEntry = compositions.find(e => e.get('slug') === slug);

      if (targetEntry && CMS?.entry?.set) {
        CMS.entry.set(targetEntry);
        console.log('Section switched successfully');
      } else {
        throw new Error('Target section not found');
      }
    } catch (error) {
      console.error('Error switching sections:', error);
      this.setState({ error: 'Failed to switch sections: ' + error.message });
    }
  },

  render() {
    console.log('Rendering preview component...');
    const { entry } = this.props;
    if (!entry) return null;

    const data = entry.get('data');
    if (!data) return null;

    const currentSection = parseInt(data.get('section') || '0', 10);
    const collectionType = data.get('collection_type');
    const collectionTitle = collectionType === 'memorandum' 
      ? 'Memorandum and Manifestation' 
      : 'Corrective Measures';

    console.log('Render data:', {
      currentSection,
      collectionType,
      sections: this.state.sections
    });

    return h('div', { className: 'preview-container' },
      h('div', { className: 'sidebar' },
        h('div', { className: 'collection-title' }, collectionTitle),
        h('div', { className: 'composition-title' }, data.get('title')),
        this.state.error && h('div', { className: 'error-message' }, this.state.error),
        this.state.loading 
          ? h('div', { className: 'loading-message' }, 'Loading sections...')
          : h('div', { className: 'controls-container' },
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
        h('div', { className: 'markdown-content' }, this.props.widgetFor('body'))
      )
    );
  }
});

// Register the preview component
CMS.registerPreviewTemplate('compositions', PreviewComponent);