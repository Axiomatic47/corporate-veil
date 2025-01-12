import { Composition } from './compositionData';

const parseFrontMatter = (content: string): { data: any; content: string } => {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return {
      data: {},
      content: content.trim()
    };
  }

  const [, frontMatter, body] = match;
  const data = frontMatter.split('\n').reduce((acc: Record<string, any>, line) => {
    const [key, ...values] = line.split(':');
    if (key && values.length) {
      const value = values.join(':').trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
      // Handle number values
      acc[key.trim()] = /^\d+$/.test(value) ? parseInt(value, 10) : value;
    }
    return acc;
  }, {});

  return {
    data,
    content: body.trim()
  };
};

export const loadCompositions = async (): Promise<Composition[]> => {
  try {
    const modules = import.meta.glob('/content/compositions/*.md', { 
      eager: true,
      import: 'default',
      as: 'string'
    });

    const compositions: Composition[] = [];
    let id = 1;

    for (const path in modules) {
      const content = modules[path] as string;
      
      try {
        const { data: frontmatter, content: body } = parseFrontMatter(content);
        
        compositions.push({
          id,
          title: frontmatter.title || 'Untitled',
          description: frontmatter.description || '',
          collection_type: frontmatter.collection_type || 'memorandum',
          section: frontmatter.section || 1,
          content: body
        });
        
        id++;
      } catch (parseError) {
        console.error(`Error parsing file ${path}:`, parseError);
        continue;
      }
    }

    // Sort compositions by section number
    compositions.sort((a, b) => a.section - b.section);
    
    return compositions;
  } catch (error) {
    console.error('Error loading compositions:', error);
    throw error;
  }
};