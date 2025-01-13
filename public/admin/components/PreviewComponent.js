const PreviewComponent = createClass({
  getInitialState() {
    return {
      sections: [],
      currentSection: null,
      readingLevel: 3,
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

  loadSections() {
    const { entry, entries } = this.props;
    if (!entry || !entries) return;

    try {
      const data = entry.get('data');
      const title = data.get('title');
      const collectionType = data.get('collection_type');
      const readingLevel = parseInt(data.get('reading_level') || '3', 10);

      const compositions = entries.get('compositions');
      if (!compositions) return;

      const sections = compositions
        .filter(e => {
          const entryData = e.get('data');
          return entryData &&
                 entryData.get('title') === title &&
                 entryData.get('collection_type') === collectionType;
        })
        .map(e => ({
          section: e.getIn(['data', 'section']),
          content: this.getContentForLevel(e, readingLevel),
          title: this.getTitleForLevel(e, readingLevel),
          slug: e.get('slug')
        }))
        .toJS()
        .sort((a, b) => a.section - b.section);

      this.setState({
        sections,
        readingLevel,
        currentSection: sections[0],
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading sections:', error);
      this.setState({
        error: 'Failed to load sections',
        loading: false
      });
    }
  },

  getContentForLevel(entry, level) {
    return entry.getIn(['data', `content_level_${level}`]) || '';
  },

  getTitleForLevel(entry, level) {
    return entry.getIn(['data', `title_level_${level}`]) || '';
  },

  handleReadingLevelChange(level) {
    this.setState({ readingLevel: level }, this.loadSections);
  },

  handleNewSection() {
    const { entry } = this.props;
    if (!entry) return;

    try {
      const data = entry.get('data');
      const currentSection = parseInt(data.get('section') || '0', 10);
      const newSection = currentSection + 1;

      const newData = data.set('section', newSection);
      
      if (CMS?.entry?.set) {
        const newEntry = entry.set('data', newData);
        CMS.entry.set(newEntry);
      }
    } catch (error) {
      console.error('Error creating section:', error);
      this.setState({ error: 'Failed to create new section' });
    }
  },

  render() {
    const { entry } = this.props;
    if (!entry) return null;

    const data = entry.get('data');
    if (!data) return null;

    const collectionType = data.get('collection_type');
    const collectionTitle = collectionType === 'memorandum'
      ? 'Memorandum and Manifestation'
      : 'Corrective Measures';

    return h('div', { className: 'admin-layout' },
      h('div', { className: 'navigation-sidebar' },
        h('div', { className: 'sidebar-header' },
          h('h2', { className: 'collection-title' }, collectionTitle),
          h('h3', { className: 'composition-title' }, data.get('title'))
        ),
        h('div', { className: 'reading-level-selector' },
          h('label', {}, 'Reading Level:'),
          h('select', {
            value: this.state.readingLevel,
            onChange: (e) => this.handleReadingLevelChange(parseInt(e.target.value, 10))
          },
            h('option', { value: 1 }, 'Level 1'),
            h('option', { value: 3 }, 'Level 3'),
            h('option', { value: 5 }, 'Level 5')
          )
        ),
        h('div', { className: 'sections-container' },
          this.state.loading 
            ? h('div', { className: 'loading' }, 'Loading sections...')
            : h('div', { className: 'sections-list' },
                h('button', {
                  className: 'new-section-button',
                  onClick: () => this.handleNewSection()
                }, '+ New Section'),
                this.state.sections.map(section =>
                  h('button', {
                    key: section.section,
                    onClick: () => this.setState({ currentSection: section }),
                    className: `section-button ${
                      this.state.currentSection && 
                      section.section === this.state.currentSection.section 
                        ? 'active' 
                        : ''
                    }`
                  }, section.title || `Section ${section.section}`)
                )
              )
        )
      ),
      h('div', { className: 'content-area' },
        h('div', { className: 'content-header' },
          h('h1', {}, this.state.currentSection?.title || '')
        ),
        h('div', { className: 'content-body' },
          this.state.currentSection?.content || 'Select a section to view content'
        )
      )
    );
  }
});

CMS.registerPreviewTemplate('compositions', PreviewComponent);