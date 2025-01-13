const PreviewComponent = createClass({
  getInitialState() {
    return {
      isCreating: false,
      sections: [],
      error: null,
      initialized: false
    };
  },

  componentDidMount() {
    this.mounted = true;
    this.waitForCMS();
  },

  componentWillUnmount() {
    this.mounted = false;
  },

  waitForCMS() {
    if (!this.mounted) return;

    if (CMS?.getBackend) {
      this.setState({ initialized: true }, () => {
        this.loadSections();
      });
    } else {
      console.warn('CMS backend not initialized yet, retrying...');
      setTimeout(() => this.waitForCMS(), 1000);
    }
  },

  loadSections() {
    const entry = this.props.entry;
    if (!entry) return;

    const data = entry.get('data');
    if (!data) return;

    const title = data.get('title');
    const collectionType = data.get('collection_type');

    if (!this.state.initialized) {
      console.warn('CMS not initialized yet');
      return;
    }

    CMS.getBackend()
      .listEntries({
        collection: 'compositions',
        page: 1,
        perPage: 100
      })
      .then(response => {
        if (!this.mounted) return;

        if (!response?.entries) {
          console.warn('No entries found');
          return;
        }

        const sections = response.entries
          .filter(e => {
            const entryData = e.data;
            return entryData && 
                   entryData.title === title && 
                   entryData.collection_type === collectionType;
          })
          .map(e => ({
            section: e.data.section,
            slug: e.slug
          }))
          .sort((a, b) => a.section - b.section);

        this.setState({ sections, error: null });
      })
      .catch(error => {
        console.error('Error loading sections:', error);
        this.setState({ error: 'Failed to load sections' });
      });
  },

  handleNewSection() {
    if (this.state.isCreating || !this.state.initialized) return;

    const entry = this.props.entry;
    if (!entry) return;

    this.setState({ isCreating: true });

    const data = entry.get('data');
    if (!data) {
      this.setState({ isCreating: false });
      return;
    }

    try {
      const title = data.get('title') || '';
      const description = data.get('description') || '';
      const collectionType = data.get('collection_type') || '';
      const currentSection = parseInt(data.get('section') || '0', 10);
      const newSection = currentSection + 1;

      const newEntryData = {
        title: title,
        description: description,
        collection_type: collectionType,
        section: newSection,
        body: '*This is the section content, which changes by selection of navigation bar links to the left*'
      };

      const frontmatter = `---
title: ${newEntryData.title}
description: ${newEntryData.description}
collection_type: ${newEntryData.collection_type}
section: ${newSection}
---
${newEntryData.body}`;

      CMS.getBackend()
        .createEntry('compositions', {
          data: newEntryData,
          raw: frontmatter
        })
        .then(newEntry => {
          if (this.mounted) {
            this.setState({ isCreating: false, error: null });
            this.loadSections();
            
            CMS.getBackend()
              .unpublishedEntry('compositions', newEntry.slug)
              .then(entry => {
                CMS.entry.set(entry);
              })
              .catch(error => {
                console.error('Error navigating to new entry:', error);
                this.setState({ error: 'Failed to navigate to new entry' });
              });
          }
        })
        .catch(error => {
          console.error('Error creating new section:', error);
          if (this.mounted) {
            this.setState({ 
              isCreating: false,
              error: 'Failed to create new section'
            });
          }
        });
    } catch (error) {
      console.error('Error processing new section:', error);
      if (this.mounted) {
        this.setState({ 
          isCreating: false,
          error: 'Error processing new section'
        });
      }
    }
  },

  handleSectionClick(slug) {
    if (!this.state.initialized) {
      this.setState({ error: 'CMS not initialized yet' });
      return;
    }

    CMS.getBackend()
      .unpublishedEntry('compositions', slug)
      .then(entry => {
        CMS.entry.set(entry);
      })
      .catch(error => {
        console.error('Error loading section:', error);
        this.setState({ error: 'Failed to load section' });
      });
  },

  render() {
    const entry = this.props.entry;
    if (!entry) return null;

    const data = entry.get('data');
    if (!data) return null;

    const currentSection = parseInt(data.get('section') || '0', 10);
    const collectionType = data.get('collection_type');
    const collectionTitle = collectionType === 'memorandum' ? 'Memorandum and Manifestation' : 'Corrective Measures';

    return h('div', { className: 'preview-container' },
      h('div', { className: 'sidebar' },
        h('div', { className: 'collection-title' }, collectionTitle),
        h('div', { className: 'composition-title' }, data.get('title')),
        this.state.error && h('div', { className: 'error-message' }, this.state.error),
        !this.state.initialized && h('div', { className: 'loading-message' }, 'Initializing CMS...'),
        h('button', {
          className: 'new-section-button',
          onClick: this.handleNewSection,
          disabled: this.state.isCreating || !this.state.initialized
        }, this.state.isCreating ? 'Creating...' : 'New Section'),
        h('div', { className: 'section-list' },
          this.state.sections.map(section =>
            h('button', {
              key: section.section,
              className: `section-button ${section.section === currentSection ? 'active' : ''}`,
              onClick: () => this.handleSectionClick(section.slug)
            }, `Section ${section.section}`)
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

window.PreviewComponent = PreviewComponent;