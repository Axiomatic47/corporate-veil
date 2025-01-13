// PreviewComponent.js
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

    try {
      const data = entry.get('data');
      const title = data.get('title');
      const description = data.get('description');
      const collectionType = data.get('collection_type');
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
section: ${newEntryData.section}
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
                if (entry && CMS.entry) {
                  CMS.entry.set(entry);
                }
              })
              .catch(error => {
                console.error('Error loading new entry:', error);
                this.setState({ error: 'Failed to load new entry' });
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
      console.error('Error in handleNewSection:', error);
      this.setState({ 
        isCreating: false,
        error: 'Failed to create new section'
      });
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
        if (entry && CMS.entry) {
          CMS.entry.set(entry);
        }
      })
      .catch(error => {
        console.error('Error switching sections:', error);
        this.setState({ error: 'Failed to switch sections' });
      });
  },

  render() {
    const entry = this.props.entry;
    if (!entry) return null;

    const data = entry.get('data');
    if (!data) return null;

    const collectionTitle = data.get('collection_type') === 'memorandum' 
      ? 'Memorandum and Manifestation' 
      : 'Corrective Measures';

    return h('div', { className: 'w-64 min-h-screen bg-[#1A1F2C] text-white p-6' },
      h('div', { className: 'space-y-4' },
        h('div', null,
          h('h2', { className: 'text-lg font-medium mb-1' }, collectionTitle),
          h('p', { className: 'text-sm text-gray-400' }, data.get('title'))
        ),
        this.state.error && h('div', { className: 'text-red-500 text-sm' }, this.state.error),
        !this.state.initialized && h('div', { className: 'text-gray-400 text-sm' }, 'Initializing CMS...'),
        h('button', {
          className: `w-full px-3 py-2 rounded-md text-sm ${
            this.state.isCreating ? 'bg-gray-700 text-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`,
          onClick: this.handleNewSection,
          disabled: this.state.isCreating || !this.state.initialized
        }, this.state.isCreating ? 'Creating...' : 'New Section'),
        h('nav', { className: 'space-y-2 mt-4' },
          this.state.sections.map(section =>
            h('button', {
              key: section.section,
              onClick: () => this.handleSectionClick(section.slug),
              className: `w-full px-3 py-2 rounded-md text-sm ${
                parseInt(data.get('section')) === section.section
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }, `Section ${section.section}`)
          )
        )
      )
    );
  }
});

// Register the preview component
if (typeof CMS !== 'undefined') {
  CMS.registerPreviewTemplate('compositions', PreviewComponent);
}