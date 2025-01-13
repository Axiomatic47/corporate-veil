'use strict';

const PreviewComponent = createClass({
  // Initialize with null timeouts to handle cleanup
  timeouts: [],

  getInitialState() {
    return {
      isCreating: false,
      sections: [],
      error: null,
      initialized: false
    };
  },

  componentDidMount() {
    this._isMounted = true;
    // Add timeout to collection for cleanup
    const timeout = setTimeout(() => this.initializePreview(), 1000);
    this.timeouts.push(timeout);
  },

  componentWillUnmount() {
    this._isMounted = false;
    // Clear all timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
  },

  initializePreview() {
    if (!this._isMounted) return;

    if (CMS?.getBackend && typeof CMS.getBackend === 'function') {
      this.setState({ initialized: true }, () => {
        this.loadSections();
      });
    } else {
      // Add timeout to collection for cleanup
      const timeout = setTimeout(() => this.initializePreview(), 1000);
      this.timeouts.push(timeout);
    }
  },

  async loadSections() {
    if (!this._isMounted || !this.state.initialized) return;

    const entry = this.props.entry;
    if (!entry?.get) return;

    const data = entry.get('data');
    if (!data?.get) return;

    try {
      const title = data.get('title');
      const collectionType = data.get('collection_type');

      // Ensure backend is available
      const backend = CMS.getBackend();
      if (!backend?.listEntries) {
        throw new Error('CMS backend not properly initialized');
      }

      const response = await backend.listEntries({
        collection: 'compositions',
        page: 1,
        perPage: 100
      });

      if (!this._isMounted) return;

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

      if (this._isMounted) {
        this.setState({ sections, error: null });
      }
    } catch (error) {
      console.error('Error loading sections:', error);
      if (this._isMounted) {
        this.setState({ error: 'Failed to load sections' });
      }
    }
  },

  async handleNewSection() {
    if (this.state.isCreating || !this.state.initialized) return;

    const entry = this.props.entry;
    if (!entry?.get) return;

    const data = entry.get('data');
    if (!data?.get) return;

    this.setState({ isCreating: true });

    try {
      const title = data.get('title') || '';
      const description = data.get('description') || '';
      const collectionType = data.get('collection_type') || '';
      const currentSection = parseInt(data.get('section') || '0', 10);
      const newSection = currentSection + 1;

      const newEntryData = {
        title,
        description,
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

      const backend = CMS.getBackend();
      const newEntry = await backend.createEntry('compositions', {
        data: newEntryData,
        raw: frontmatter
      });

      if (this._isMounted) {
        this.setState({ isCreating: false, error: null });
        await this.loadSections();

        try {
          const unpublishedEntry = await backend.unpublishedEntry('compositions', newEntry.slug);
          CMS.entry.set(unpublishedEntry);
        } catch (error) {
          console.error('Error navigating to new entry:', error);
          if (this._isMounted) {
            this.setState({ error: 'Failed to navigate to new entry' });
          }
        }
      }
    } catch (error) {
      console.error('Error creating new section:', error);
      if (this._isMounted) {
        this.setState({
          isCreating: false,
          error: 'Failed to create new section'
        });
      }
    }
  },

  async handleSectionClick(slug) {
    if (!this.state.initialized) {
      this.setState({ error: 'CMS not initialized yet' });
      return;
    }

    try {
      const backend = CMS.getBackend();
      const entry = await backend.unpublishedEntry('compositions', slug);
      CMS.entry.set(entry);
    } catch (error) {
      console.error('Error loading section:', error);
      if (this._isMounted) {
        this.setState({ error: 'Failed to load section' });
      }
    }
  },

  render() {
    const entry = this.props.entry;
    if (!entry?.get) return null;

    const data = entry.get('data');
    if (!data?.get) return null;

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
          onClick: () => this.handleNewSection(),
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

// Make component available globally
window.PreviewComponent = PreviewComponent;