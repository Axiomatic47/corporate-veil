export interface Composition {
  id: number;
  title: string;
  description: string;
}

interface CompositionCollection {
  memorandum: Composition[];
  corrective: Composition[];
}

export const compositionData: CompositionCollection = {
  memorandum: [
    {
      id: 1,
      title: "The Nature of Corporate Personhood",
      description: "An exploration of fundamental principles underlying corporate personhood in constitutional law.",
    }
  ],
  corrective: [
    {
      id: 1,
      title: "Reform Proposals",
      description: "Examining contemporary proposals for reforming corporate constitutional rights and responsibilities.",
    }
  ],
};