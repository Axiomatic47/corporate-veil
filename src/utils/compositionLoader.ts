// compositionLoader.ts
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
      console.log('Loading composition data:', data); // Debug log

      // Process each section in the composition
      const sections = (data.sections || []).map((section: any, index: number) => {
        console.log('Processing section:', section); // Debug log
        return {
          id: index + 1,
          title: data.title,
          description: data.description,
          collection_type: data.collection_type,
          section: index + 1, // Match section number to index + 1
          section_title: section.title,
          content_level_1: section.content_level_1,
          content_level_3: section.content_level_3,
          content_level_5: section.content_level_5,
        };
      });

      // Add processed sections to compositions array
      compositions.push(...sections);
    }

    console.log('Final compositions array:', compositions); // Debug log

    // Sort by section number
    return compositions.sort((a, b) => a.section - b.section);
  } catch (error) {
    console.error('Error loading compositions:', error);
    throw error;
  }
};