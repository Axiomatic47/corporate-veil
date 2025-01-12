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
      
      // Use a try-catch block for each file parsing to handle potential errors
      try {
        const { data: frontmatter, content: body } = matter(content, {
          // Configure gray-matter to work in browser environment
          engines: {
            yaml: {
              parse: (str: string) => {
                try {
                  // Simple YAML parsing for frontmatter
                  return str.split('\n').reduce((acc: any, line) => {
                    const [key, ...values] = line.split(':');
                    if (key && values.length) {
                      acc[key.trim()] = values.join(':').trim();
                    }
                    return acc;
                  }, {});
                } catch (e) {
                  console.error('Error parsing YAML:', e);
                  return {};
                }
              },
              stringify: (obj: object) => {
                return Object.entries(obj)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n');
              }
            }
          }
        });
        
        compositions.push({
          id,
          title: frontmatter.title || 'Untitled',
          description: frontmatter.description || '',
          collection_type: frontmatter.collection_type || 'memorandum',
          section: frontmatter.section || 1,
          content: body.trim()
        });
        
        id++;
      } catch (parseError) {
        console.error(`Error parsing file ${path}:`, parseError);
        // Continue with next file if one fails
        continue;
      }
    }

    // Sort compositions by section number
    compositions.sort((a, b) => a.section - b.section);
    
    console.log('Loaded compositions:', compositions);
    return compositions;
  } catch (error) {
    console.error('Error loading compositions:', error);
    throw error;
  }
};