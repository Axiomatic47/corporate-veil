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
  const compositions = await loadCompositions();
  useCompositionStore.getState().setCompositions(compositions);
};