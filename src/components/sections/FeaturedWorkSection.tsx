import CompositionCard from "@/components/CompositionCard";
import { compositionData } from "@/utils/compositionData";

// Specify which compositions should be featured by their IDs and collection names
const featuredWorksConfig = [
  { id: 1, collection: 'corrective' }, // Reform Proposals
  { id: 1, collection: 'memorandum' }, // The Nature of Corporate Personhood
  { id: 2, collection: 'memorandum' }  // Legal Rights and Responsibilities
];

export const FeaturedWorkSection = () => {
  // Map the configuration to actual composition data
  const featuredWorks = featuredWorksConfig.map(config => {
    const collection = compositionData[config.collection];
    const composition = collection.find(comp => comp.id === config.id);
    
    if (!composition) {
      console.error(`Composition not found for id ${config.id} in ${config.collection}`);
      return null;
    }

    return {
      ...composition,
      collection: config.collection,
      content: `This is the content for Section 1 of ${composition.title} at reading level 3. The content would adapt based on the selected reading level.`
    };
  }).filter(Boolean);

  return (
    <section className="mt-32">
      <h2 className="text-4xl font-serif mb-12">Featured Work</h2>
      <div className="grid gap-12">
        {featuredWorks.map((work) => (
          work && (
            <CompositionCard
              key={`${work.collection}-${work.id}`}
              id={work.id}
              title={work.title}
              description={work.description}
              literacyLevel={3}
              onLiteracyChange={() => {}}
              content={work.content}
              showSlider={false}
              collection={work.collection}
            />
          )
        ))}
      </div>
    </section>
  );
};