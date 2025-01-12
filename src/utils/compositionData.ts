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

export const compositionData: CompositionCollection = {
  memorandum: [],
  corrective: []
};

// Filter compositions by collection type
const filterCompositions = (compositions: Composition[], type: 'memorandum' | 'corrective'): Composition[] => {
  return compositions.filter(comp => comp.collection_type === type);
};

// Function to initialize the composition data
export const initializeCompositionData = async (): Promise<void> => {
  const { loadCompositions } = await import('./compositionLoader');
  const allCompositions = await loadCompositions();
  compositionData.memorandum = filterCompositions(allCompositions, 'memorandum');
  compositionData.corrective = filterCompositions(allCompositions, 'corrective');
};

// Initialize the data when the module is imported
initializeCompositionData().catch(console.error);