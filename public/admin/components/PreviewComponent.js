(function() {
  const PreviewComponent = createClass({
    getInitialState() {
      return {
        sections: [],
        currentSection: 1,
        error: null,
        loading: true
      };
    },

    componentDidMount() {
      this.mounted = true;
      if (this.props.entry) {
        this.loadSections();
      }
    },

    componentWillUnmount() {
      this.mounted = false;
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
            slug: e.get('slug')
          }))
          .toJS()
          .sort((a, b) => a.section - b.section);

        if (this.mounted) {
          this.setState({
            sections,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error loading sections:', error);
        if (this.mounted) {
          this.setState({
            error: 'Failed to load sections',
            loading: false
          });
        }
      }
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
          
          // Update local state to reflect the new section
          this.setState(prevState => ({
            sections: [...prevState.sections, { section: newSection, slug: entry.get('slug') }]
          }));
        }
      } catch (error) {
        console.error('Error creating section:', error);
        this.setState({ error: 'Failed to create new section' });
      }
    },

    handleSectionClick(section) {
      const { entries } = this.props;
      if (!entries) return;

      try {
        const compositions = entries.get('compositions');
        const targetEntry = compositions.find(e => 
          e.getIn(['data', 'section']) === section
        );

        if (targetEntry && CMS?.entry?.set) {
          CMS.entry.set(targetEntry);
          // Update current section in state without clearing sections array
          this.setState({ currentSection: section });
        }
      } catch (error) {
        console.error('Error switching sections:', error);
        this.setState({ error: 'Failed to switch sections' });
      }
    },

    render() {
      const { entry } = this.props;
      if (!entry) return null;

      const data = entry.get('data');
      if (!data) return null;

      const currentSection = parseInt(data.get('section') || '1', 10);
      const collectionType = data.get('collection_type');
      const title = data.get('title');

      return h('div', { className: 'admin-layout' },
        h('div', { className: 'navigation-sidebar' },
          h('div', { className: 'sidebar-header' },
            h('h2', { className: 'collection-title' }, 
              collectionType === 'memorandum' ? 'Memorandum and Manifestation' : 'Corrective Measures'
            ),
            h('h3', { className: 'composition-title' }, title)
          ),
          h('div', { className: 'sections-container' },
            this.state.loading 
              ? h('div', { className: 'loading' }, 'Loading sections...')
              : h('div', { className: 'sections-list' },
                  h('button', {
                    className: 'new-section-button',
                    onClick: this.handleNewSection
                  }, '+ New Section'),
                  this.state.sections.map(section =>
                    h('button', {
                      key: section.section,
                      onClick: () => this.handleSectionClick(section.section),
                      className: `section-button ${section.section === currentSection ? 'active' : ''}`
                    }, `Section ${section.section}`)
                  )
                )
          )
        ),
        h('div', { className: 'content-area' },
          h('div', { className: 'content-header' },
            h('h1', {}, data.get('title'))
          ),
          h('div', { className: 'content-body' },
            this.props.widgetFor('body')
          )
        )
      );
    }
  });

  if (typeof CMS !== 'undefined') {
    CMS.registerPreviewTemplate('compositions', PreviewComponent);
  }
})();