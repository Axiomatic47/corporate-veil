import { Composition } from './compositionData';
import matter from 'gray-matter';

export const loadCompositions = async (): Promise<Composition[]> => {
  try {
    const modules = import.meta.glob('/content/compositions/*.md', { 
      query: '?raw',
      import: 'default'
    });
    
    const compositions: Composition[] = [];
    
    for (const path in modules) {
      const content = await modules[path]() as string;
      const { data: frontmatter, content: body } = matter(content);
      
      compositions.push({
        id: parseInt(path.split('/').pop()?.split('-')[0] ?? '1'),
        title: frontmatter.title,
        description: frontmatter.description,
        collection_type: frontmatter.collection_type,
        section: frontmatter.section,
        content: body
      });
    }

    return compositions;
  } catch (error) {
    console.error('Error loading compositions:', error);
    return [];
  }
};