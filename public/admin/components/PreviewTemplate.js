const PreviewTemplate = createClass({
  render: function() {
    const {entry, entries} = this.props;
    const data = entry.get('data').toJS();
    const title = data.title || '';
    const description = data.description || '';
    const section = data.section || 1;
    const body = this.props.widgetFor('body');

    const allEntries = entries.get('compositions');
    const relatedSections = allEntries
      ? allEntries
          .filter(e => e.getIn(['data', 'title']) === title)
          .map(e => e.getIn(['data', 'section']))
          .sort()
          .toJS()
      : [];

    return h('div', {className: 'preview-container'},
      h('div', {className: 'flex'},
        h('nav', {className: 'w-64 bg-gray-800 p-4 min-h-screen'},
          h('h3', {className: 'text-white mb-4'}, 'Navigation'),
          h('div', {className: 'space-y-2'},
            relatedSections.map(sectionNum =>
              h('button', {
                key: sectionNum,
                className: `w-full p-2 text-left rounded ${section === sectionNum ? 'bg-white text-gray-800' : 'text-white hover:bg-gray-700'}`,
                onClick: () => {
                  const sectionEntry = allEntries.find(e => 
                    e.getIn(['data', 'title']) === title && 
                    e.getIn(['data', 'section']) === sectionNum
                  );
                  if (sectionEntry) {
                    CMS.entry.set(sectionEntry);
                  }
                }
              }, `Section ${sectionNum}`)
            ),
            h('button', {
              className: 'w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600',
              onClick: () => {
                const newSection = Math.max(...relatedSections, 0) + 1;
                CMS.entry.set('data', {...data, section: newSection});
              }
            }, 'New Section')
          )
        ),
        h('div', {className: 'flex-1 p-8'},
          h('h1', {className: 'text-4xl font-bold mb-4'}, title),
          h('div', {className: 'meta-info mb-6'},
            h('p', {className: 'text-lg mb-2'}, description),
            h('div', {className: 'flex gap-4'},
              h('span', {className: 'text-sm'}, `Section: ${section}`)
            )
          ),
          h('div', {className: 'content mt-8'}, body)
        )
      )
    );
  }
});

export default PreviewTemplate;