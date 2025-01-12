import { create } from 'zustand';

export interface Composition {
  id: number;
  title: string;
  description: string;
  collection_type: 'memorandum' | 'corrective';
  section: number;
  content?: string;
}

interface CompositionStore {
  memorandum: Composition[];
  corrective: Composition[];
  initialized: boolean;
  setCompositions: (compositions: Composition[]) => void;
  refreshCompositions: () => Promise<void>;
}

export const useCompositionStore = create<CompositionStore>((set) => ({
  memorandum: [],
  corrective: [],
  initialized: false,
  setCompositions: (compositions) => {
    const memorandum = compositions.filter(comp => comp.collection_type === 'memorandum');
    const corrective = compositions.filter(comp => comp.collection_type === 'corrective');
    set({ memorandum, corrective, initialized: true });
  },
  refreshCompositions: async () => {
    const { loadCompositions } = await import('./compositionLoader');
    try {
      const compositions = await loadCompositions();
      set(state => ({
        ...state,
        memorandum: compositions.filter(comp => comp.collection_type === 'memorandum'),
        corrective: compositions.filter(comp => comp.collection_type === 'corrective'),
      }));
    } catch (error) {
      console.error('Failed to refresh compositions:', error);
      throw error;
    }
  }
}));

// Export compositionData as a computed value from the store
export const compositionData = {
  get memorandum() {
    return useCompositionStore.getState().memorandum;
  },
  get corrective() {
    return useCompositionStore.getState().corrective;
  }
};

export const initializeCompositionData = async (): Promise<void> => {
  const { loadCompositions } = await import('./compositionLoader');
  try {
    const compositions = await loadCompositions();
    useCompositionStore.getState().setCompositions(compositions);
  } catch (error) {
    console.error('Failed to initialize composition data:', error);
    throw error;
  }
};