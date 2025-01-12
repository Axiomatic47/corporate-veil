import CompositionCard from "@/components/CompositionCard";

const featuredWorks = [
  {
    id: 1,
    title: "The Nature of Corporate Personhood",
    description: "An analysis of the fundamental principles underlying corporate personhood in constitutional law.",
    content: "This is the content for Section 1 of The Nature of Corporate Personhood at reading level 3. The content would adapt based on the selected reading level."
  },
  {
    id: 2,
    title: "Corporate Rights and Responsibilities",
    description: "Examining the balance between corporate rights and societal obligations.",
    content: "This is the content for Section 1 of Corporate Rights and Responsibilities at reading level 3. The content would adapt based on the selected reading level."
  },
  {
    id: 3,
    title: "Future of Corporate Law",
    description: "Exploring emerging trends and potential reforms in corporate constitutional law.",
    content: "This is the content for Section 1 of Future of Corporate Law at reading level 3. The content would adapt based on the selected reading level."
  },
];

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