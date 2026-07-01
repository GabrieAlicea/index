const FEATURES = [
  {
    title: "Customize",
    description:
      "Pick your Coquí's colors, patterns, eyes, and accessories — from tiny hats to Puerto Rican flag flair.",
  },
  {
    title: "Name",
    description:
      "Generate a name and a personality — favorite weather, favorite food, energy, curiosity, and more.",
  },
  {
    title: "Release",
    description:
      "Set your frog free into a living rainforest pond with rain, fireflies, and a day-night cycle.",
  },
  {
    title: "Learn",
    description:
      "Every frog teaches you something real about coquíes, El Yunque, and Puerto Rican culture.",
  },
] as const;

export function FeatureHighlights() {
  return (
    <section
      id="highlights"
      className="mx-auto max-w-5xl scroll-mt-8 px-6 py-20"
    >
      <h2 className="text-center font-display text-3xl font-semibold text-canopy-700 dark:text-leaf-300 sm:text-4xl">
        How Frogies works
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg bg-cream-50 p-6 shadow-soft dark:bg-charcoal-800"
          >
            <h3 className="font-display text-xl font-semibold text-canopy-700 dark:text-leaf-300">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm font-body text-charcoal-800/75 dark:text-mist-100/75">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
