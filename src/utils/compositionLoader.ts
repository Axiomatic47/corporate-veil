import { Composition } from './compositionData';
import matter from 'gray-matter';

export const loadCompositions = async (): Promise<Composition[]> => {
  try {
    // Import all markdown files from the compositions directory
    const modules = import.meta.glob('/content/compositions/*.md', { 
      eager: true,
      import: 'default',
      as: 'raw'
    });
    
    const compositions: Composition[] = [];
    
    for (const path in modules) {
      const content = modules[path] as string;
      const { data: frontmatter, content: body } = matter(content);
      
      // Extract the numeric ID from the filename (YYYY-MM-DD-title format)
      const filename = path.split('/').pop() || '';
      const id = parseInt(filename.split('-')[0]) || compositions.length + 1;
      
      compositions.push({
        id,
        title: frontmatter.title || 'Untitled',
        description: frontmatter.description || '',
        collection_type: frontmatter.collection_type || 'memorandum',
        section: frontmatter.section || 1,
        content: body.trim()
      });
    }

    console.log('Loaded compositions:', compositions);
    return compositions;
  } catch (error) {
    console.error('Error loading compositions:', error);
    return [];
  }
};