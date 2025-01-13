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

      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const safeTitle = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newSlug = timestamp + '-' + safeTitle + '-section-' + newSection;

      const newContent = [
        '---',
        'title: ' + title + ' - Section ' + newSection,
        'description: ' + description,
        'collection_type: ' + collectionType,
        'section: ' + newSection,
        '---'
      ].join('\n');

      fetch('/api/v1/compositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: newSlug,
          path: 'content/compositions/' + newSlug + '.md',
          raw: newContent
        })
      })
      .then(() => {
        window.location.href = '/admin/#/collections/compositions/entries/' + newSlug;
      })
      .catch(error => {
        console.error('Error creating section:', error);
        alert('Failed to create new section. Please try again.');
        if (this.mounted) {
          this.setState({ isCreating: false });
        }
      });
    } catch (error) {
      console.error('Error processing new section:', error);
      alert('Failed to process new section. Please try again.');
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

export default PreviewComponent;