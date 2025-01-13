import { Composition } from './compositionData';

export const loadCompositions = async (): Promise<Composition[]> => {
  try {
    const compositions: Composition[] = [];

    // Import all JSON files from the compositions directory
    const modules = import.meta.glob('/content/compositions/*.json', {
      eager: true,
      import: 'default'
    });

    for (const path in modules) {
      const data = modules[path] as any;

      // Process each section in the composition
      const sections = (data.sections || []).map((section: any, index: number) => ({
        id: index + 1,
        title: section.title,
        description: section.description,
        collection_type: data.collection_type,
        content: section[`content_level_3`], // Default to intermediate level
        content_level_1: section.content_level_1,
        content_level_3: section.content_level_3,
        content_level_5: section.content_level_5,
      }));

      // Add each section as a separate composition entry
      sections.forEach(section => {
        compositions.push({
          id: section.id,
          title: data.title,
          description: data.description,
          collection_type: data.collection_type,
          section: section.id,
          content: section.content,
          section_title: section.title,
          content_level_1: section.content_level_1,
          content_level_3: section.content_level_3,
          content_level_5: section.content_level_5,
        });
      });
    }

    // Sort by section number
    compositions.sort((a, b) => a.section - b.section);
    
    return compositions;
  } catch (error) {
    console.error('Error loading compositions:', error);
    throw error;
  }
};