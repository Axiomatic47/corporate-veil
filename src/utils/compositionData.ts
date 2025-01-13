import { create } from 'zustand';

export interface Composition {
  id: number;
  title: string;
  description: string;
  collection_type: 'memorandum' | 'corrective';
  section: number;
  section_title: string;
  content?: string;
  content_level_1: string;
  content_level_3: string;
  content_level_5: string;
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