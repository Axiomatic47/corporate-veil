import CompositionCard from "@/components/CompositionCard";
import { compositionData } from "@/utils/compositionData";

// Combine memorandum and corrective compositions
const allCompositions = [...compositionData.memorandum, ...compositionData.corrective];

// Select the first three compositions for featured work
const featuredWorks = allCompositions.slice(0, 3).map(composition => ({
  id: composition.id,
  title: composition.title,
  description: composition.description,
  content: `This is the content for Section 1 of ${composition.title} at reading level 3. The content would adapt based on the selected reading level.`
}));

export const FeaturedWorkSection = () => {
  return (
    <section className="mt-32">
      <h2 className="text-4xl font-serif mb-12">Featured Work</h2>
      <div className="grid gap-12">
        {featuredWorks.map((work) => (
          <CompositionCard
            key={work.id}
            id={work.id}
            title={work.title}
            description={work.description}
            literacyLevel={3}
            onLiteracyChange={() => {}}
            content={work.content}
            showSlider={false}
          />
        ))}
      </div>
    </section>
  );
};