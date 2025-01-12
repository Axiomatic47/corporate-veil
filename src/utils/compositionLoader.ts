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
    let id = 1;
    
    for (const path in modules) {
      const content = modules[path] as string;
      const { data: frontmatter, content: body } = matter(content);
      
      compositions.push({
        id,
        title: frontmatter.title || 'Untitled',
        description: frontmatter.description || '',
        collection_type: frontmatter.collection_type || 'memorandum',
        section: frontmatter.section || 1,
        content: body.trim()
      });
      
      id++;
    }

    // Sort compositions by section number
    compositions.sort((a, b) => a.section - b.section);
    
    console.log('Loaded compositions:', compositions);
    return compositions;
  } catch (error) {
    console.error('Error loading compositions:', error);
    throw error; // Let the error bubble up so we can see it in the console
  }
};