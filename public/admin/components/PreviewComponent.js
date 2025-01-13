const PreviewComponent = createClass({
  getInitialState() {
    return {
      isCreating: false
    };
  },

  componentDidMount() {
    this.mounted = true;
  },

  componentWillUnmount() {
    this.mounted = false;
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

      // Create new entry data
      const newEntryData = {
        title: `${title} - Section ${newSection}`,
        description: description,
        collection_type: collectionType,
        section: newSection,
        body: ''
      };

      // Use CMS API to create new entry
      CMS.getBackend()
        .createEntry('compositions', {
          data: newEntryData,
          raw: `---\ntitle: ${newEntryData.title}\ndescription: ${newEntryData.description}\ncollection_type: ${newEntryData.collection_type}\nsection: ${newSection}\n---\n`
        })
        .then(newEntry => {
          if (this.mounted) {
            this.setState({ isCreating: false });
            // Navigate to the new entry using CMS navigation
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

  render() {
    const entry = this.props.entry;
    if (!entry) return null;

    const data = entry.get('data');
    if (!data) return null;

    const currentSection = data.get('section');
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
        }, this.state.isCreating ? 'Creating...' : 'New Section')
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