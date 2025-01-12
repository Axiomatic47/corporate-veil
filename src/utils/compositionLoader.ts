import { Composition } from './compositionData';

export const loadCompositions = async (): Promise<Composition[]> => {
  try {
    const compositionsModule = import.meta.glob('/content/compositions/*.md', { eager: true });
    
    return Object.entries(compositionsModule).map(([path, module]: [string, any]) => {
      const { frontmatter, default: content } = module;
      return {
        id: parseInt(path.split('/').pop()?.split('-')[0] ?? '1'),
        title: frontmatter.title,
        description: frontmatter.description,
        collection_type: frontmatter.collection_type,
        section: frontmatter.section,
        content: content
      };
    });
  } catch (error) {
    console.error('Error loading compositions:', error);
    return [];
  }
};