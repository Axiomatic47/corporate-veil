import { useEffect, useState } from "react";
import CompositionCard from "@/components/CompositionCard";
import { useCompositionStore } from "@/utils/compositionData";

export const FeaturedWorkSection = () => {
  const { memorandum, corrective, initialized, refreshCompositions } = useCompositionStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!initialized) {
          await refreshCompositions();
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading composition data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [initialized, refreshCompositions]);

  if (isLoading) {
    return <div>Loading featured works...</div>;
  }

  // Get the first composition from each collection type
  const featuredWorks = [
    memorandum[0],
    corrective[0]
  ].filter(Boolean); // Remove any undefined values

  return (
    <section className="mt-32">
      <h2 className="text-4xl font-serif mb-12">Featured Work</h2>
      <div className="grid gap-12">
        {featuredWorks.map((work) => (
          work && (
            <CompositionCard
              key={`${work.collection_type}-${work.id}`}
              id={work.id}
              title={work.title}
              description={work.description}
              literacyLevel={3}
              onLiteracyChange={() => {}}
              content={work.content}
              showSlider={false}
              collection={work.collection_type}
            />
          )
        ))}
      </div>
    </section>
  );
};