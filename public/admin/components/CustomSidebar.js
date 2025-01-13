// Save as /public/admin/components/CustomSidebar.js

class CustomSidebar {
  constructor({ collection, onSelectEntry }) {
    this.collection = collection;
    this.onSelectEntry = onSelectEntry;
  }

  createElement() {
    const container = document.createElement('div');
    container.className = 'custom-sidebar';
    container.innerHTML = `
      <div class="sidebar-header">
        <h2>Sections</h2>
        <button class="add-section">Add New Section</button>
      </div>
      <div class="sections-list"></div>
    `;

    // Add event listeners
    const addButton = container.querySelector('.add-section');
    addButton.addEventListener('click', this.handleAddSection.bind(this));

    // Initial render
    this.renderSections(container);

    return container;
  }

  async renderSections(container) {
    const sectionsList = container.querySelector('.sections-list');
    const entries = await window.CMS.getEntries({ collection: this.collection });

    sectionsList.innerHTML = '';

    entries
      .sort((a, b) => a.data.section - b.data.section)
      .forEach(entry => {
        const section = document.createElement('div');
        section.className = 'section-item';
        section.draggable = true;
        section.innerHTML = `
          <span class="drag-handle">≡</span>
          <span class="title">${entry.data.title}</span>
        `;

        section.addEventListener('click', () => this.onSelectEntry(entry));
        section.addEventListener('dragstart', () => section.classList.add('dragging'));
        section.addEventListener('dragend', () => {
          section.classList.remove('dragging');
          this.updateSectionOrder(sectionsList);
        });

        sectionsList.appendChild(section);
    });
  }

  async handleAddSection() {
    const entries = await window.CMS.getEntries({ collection: this.collection });
    const maxSection = Math.max(...entries.map(e => e.data.section), 0);

    const newEntry = {
      data: {
        title: 'New Section',
        collection_type: 'memorandum',
        section: maxSection + 1,
        content_level_1: '',
        content_level_3: '',
        content_level_5: ''
      }
    };

    await window.CMS.createEntry('compositions', newEntry);
    this.renderSections(this.container);
  }

  async updateSectionOrder(sectionsList) {
    const sections = Array.from(sectionsList.children);
    const entries = await window.CMS.getEntries({ collection: this.collection });

    sections.forEach((section, index) => {
      const entry = entries.find(e => e.data.title === section.querySelector('.title').textContent);
      if (entry && entry.data.section !== index + 1) {
        entry.data.section = index + 1;
        window.CMS.updateEntry('compositions', entry);
      }
    });
  }
}

// Register the custom sidebar
CMS.registerWidget('custom-sidebar', CustomSidebar);