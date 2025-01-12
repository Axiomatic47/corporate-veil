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
    },
    {
      id: 2,
      title: "Legal Rights and Responsibilities",
      description: "Understanding the balance between corporate rights and their corresponding obligations to society.",
    },
    {
      id: 3,
      title: "Historical Evolution",
      description: "Tracing the development of corporate personhood through significant legal precedents and societal changes.",
    },
    {
      id: 4,
      title: "Constitutional Implications",
      description: "Analyzing the impact of corporate personhood on constitutional interpretation and application.",
    },
  ],
  corrective: [
    {
      id: 1,
      title: "Reform Proposals",
      description: "Examining contemporary proposals for reforming corporate constitutional rights and responsibilities.",
    },
    {
      id: 2,
      title: "Regulatory Framework",
      description: "Analysis of current regulatory mechanisms and their effectiveness in corporate governance.",
    },
    {
      id: 3,
      title: "Accountability Measures",
      description: "Exploring methods to enhance corporate accountability and transparency.",
    },
    {
      id: 4,
      title: "Future Directions",
      description: "Investigating emerging trends and potential future developments in corporate law reform.",
    },
  ],
};