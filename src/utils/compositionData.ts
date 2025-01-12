export interface Composition {
  id: number;
  title: string;
  description: string;
  collection_type: 'memorandum' | 'corrective';
  section: number;
  content?: string;
}

interface CompositionCollection {
  memorandum: Composition[];
  corrective: Composition[];
}

// This function will be used to load compositions from the content directory
const loadCompositions = async (): Promise<Composition[]> => {
  try {
    // In a real implementation, this would load from the content/compositions directory
    // For now, we'll return some mock data
    return [
      {
        id: 1,
        title: "The Nature of Corporate Personhood",
        description: "An exploration of fundamental principles underlying corporate personhood in constitutional law.",
        collection_type: "memorandum",
        section: 1
      },
      {
        id: 1,
        title: "Reform Proposals",
        description: "Examining contemporary proposals for reforming corporate constitutional rights and responsibilities.",
        collection_type: "corrective",
        section: 1
      }
    ];
  } catch (error) {
    console.error('Error loading compositions:', error);
    return [];
  }
};

// Filter compositions by collection type
const filterCompositions = (compositions: Composition[], type: 'memorandum' | 'corrective'): Composition[] => {
  return compositions.filter(comp => comp.collection_type === type);
};

// Initialize the composition data
const initializeCompositionData = async (): Promise<CompositionCollection> => {
  const allCompositions = await loadCompositions();
  return {
    memorandum: filterCompositions(allCompositions, 'memorandum'),
    corrective: filterCompositions(allCompositions, 'corrective')
  };
};

export const compositionData = await initializeCompositionData();