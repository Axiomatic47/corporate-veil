const PreviewComponent = createClass({
  getInitialState() {
    return {
      isCreating: false,
      sections: []
    };
  },

  componentDidMount() {
    this.mounted = true;
    this.loadSections();
  },

  componentWillUnmount() {
    this.mounted = false;
  },

  loadSections() {
    const entry = this.props.entry;
    if (!entry) return;

    const data = entry.get('data');
    if (!data) return;

    const title = data.get('title');
    const collectionType = data.get('collection_type');

    // Get all entries for the same composition
    CMS.getBackend()
      .entries('compositions')
      .then(entries => {
        if (!this.mounted) return;

        const sections = entries
          .filter(e => {
            const entryData = e.data;
            return entryData.title === title && 
                   entryData.collection_type === collectionType;
          })
          .map(e => ({
            section: e.data.section,
            slug: e.slug
          }))
          .sort((a, b) => a.section - b.section);

        this.setState({ sections });
      })
      .catch(error => {
        console.error('Error loading sections:', error);
      });
  },

  handleNewSection() {
    if (this.state.isCreating) return;

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

      // Create new entry data with all fields from the current section
      const newEntryData = {
        title: title,
        description: description,
        collection_type: collectionType,
        section: newSection,
        body: '*This is the section content, which changes by selection of navigation bar links to the left*'
      };

      // Create the frontmatter string
      const frontmatter = `---
title: ${newEntryData.title}
description: ${newEntryData.description}
collection_type: ${newEntryData.collection_type}
section: ${newSection}
---
${newEntryData.body}`;

      // Create new entry
      CMS.getBackend()
        .createEntry('compositions', {
          data: newEntryData,
          raw: frontmatter
        })
        .then(newEntry => {
          if (this.mounted) {
            this.setState({ isCreating: false });
            this.loadSections();
            // Navigate to the new entry
            CMS.getBackend()
              .unpublishedEntry('compositions', newEntry.slug)
              .then(entry => {
                CMS.entry.set(entry);
              });
          }
        })
        .catch(error => {
          console.error('Error creating new section:', error);
          if (this.mounted) {
            this.setState({ isCreating: false });
          }
        });
    } catch (error) {
      console.error('Error processing new section:', error);
      if (this.mounted) {
        this.setState({ isCreating: false });
      }
    }
  },

  handleSectionClick(slug) {
    CMS.getBackend()
      .unpublishedEntry('compositions', slug)
      .then(entry => {
        CMS.entry.set(entry);
      })
      .catch(error => {
        console.error('Error loading section:', error);
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
        h('button', {
          className: 'new-section-button',
          onClick: this.handleNewSection,
          disabled: this.state.isCreating
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

// Register the preview component globally
window.PreviewComponent = PreviewComponent;