const PreviewTemplate = createClass({
  render: function() {
    const {entry} = this.props;
    const title = entry.getIn(['data', 'title']);
    const description = entry.getIn(['data', 'description']);
    const collectionType = entry.getIn(['data', 'collection_type']);
    const section = entry.getIn(['data', 'section']);
    const body = this.props.widgetFor('body');

    return h('div', {className: 'prose dark:prose-invert max-w-none'},
      h('div', {className: 'preview-container'},
        h('h1', {className: 'text-4xl font-bold mb-4'}, title),
        h('div', {className: 'meta-info mb-6'},
          h('p', {className: 'text-lg mb-2'}, description),
          h('div', {className: 'flex gap-4'},
            h('span', {className: 'text-sm'}, `Collection: ${collectionType}`),
            h('span', {className: 'text-sm'}, `Section: ${section}`)
          )
        ),
        h('div', {className: 'content mt-8'}, body)
      )
    );
  }
});