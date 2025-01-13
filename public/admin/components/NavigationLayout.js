// /public/admin/components/NavigationLayout.js

const NavigationLayout = {
  id: "navigation-layout",
  label: "Navigation",
  pattern: /.*/,

  init: function(opts) {
    const { collection, actions } = opts;

    // Create sidebar container
    const sidebar = document.createElement('div');
    sidebar.id = 'custom-navigation';
    sidebar.style.cssText = `
      position: fixed;
      left: 0;
      top: 48px;
      bottom: 0;
      width: 250px;
      background: #f5f5f5;
      border-right: 1px solid #ddd;
      padding: 20px;
      overflow-y: auto;
    `;

    // Add sections list
    const refreshSections = async () => {
      // Get entries from the store
      const entries = await opts.api.listEntries({
        collection: collection.get('name')
      });

      // Sort entries by section number
      const sortedEntries = entries.entries.sort((a, b) =>
        (a.data.section || 0) - (b.data.section || 0)
      );

      // Create sections HTML
      const sectionsHtml = sortedEntries.map(entry => `
        <div class="section-item" data-id="${entry.slug}" draggable="true">
          <span style="margin-right: 8px;">≡</span>
          ${entry.data.title}
        </div>
      `).join('');

      sidebar.innerHTML = `
        <h2 style="margin-bottom: 16px;">Sections</h2>
        <button style="width: 100%; padding: 8px; margin-bottom: 16px; background: #2196f3; color: white; border: none; border-radius: 4px;">
          Add Section
        </button>
        <div id="sections-list" style="space-y-2">
          ${sectionsHtml}
        </div>
      `;

      // Add click handlers
      const sectionItems = sidebar.querySelectorAll('.section-item');
      sectionItems.forEach(item => {
        item.addEventListener('click', () => {
          const entry = sortedEntries.find(e => e.slug === item.dataset.id);
          if (entry) {
            actions.navigateToEntry(entry.collection, entry.slug);
          }
        });

        // Style section items
        item.style.cssText = `
          padding: 8px;
          margin-bottom: 8px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        `;
      });
    };

    // Initial render
    refreshSections();

    // Subscribe to changes
    opts.store.subscribe(refreshSections);

    // Add to document
    document.body.appendChild(sidebar);

    // Adjust main content
    const mainContent = document.querySelector('[class*="AppMainContainer"]');
    if (mainContent) {
      mainContent.style.marginLeft = '250px';
      mainContent.style.width = 'calc(100% - 250px)';
    }

    return `
      <div>
        ${opts.children}
      </div>
    `;
  }
};

CMS.registerLayout(NavigationLayout);