const PreviewTemplate = createClass({
  render: function() {
    const {entry} = this.props;
    return h('div', {className: 'prose dark:prose-invert max-w-none'},
      h('h1', {className: 'text-4xl font-bold'}, entry.getIn(['data', 'title'])),
      h('div', {className: 'mt-4'}, entry.getIn(['data', 'description'])),
      h('div', {className: 'mt-4'}, 
        h('strong', {}, 'Collection Type: '), 
        entry.getIn(['data', 'collection_type'])
      ),
      h('div', {className: 'mt-4'}, 
        h('strong', {}, 'Section: '), 
        entry.getIn(['data', 'section'])
      ),
      h('div', {className: 'mt-8'}, this.props.widgetFor('body'))
    );
  }
});