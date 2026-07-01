import { Header } from "@/components/layout/Header";
import { LinkButton } from "@/components/ui/LinkButton";

export default function CreatorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50 dark:bg-midnight-900">
      <Header />
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-semibold text-canopy-700 dark:text-leaf-300">
          The Frog Creator is hopping in soon
        </h1>
        <p className="mt-4 font-body text-charcoal-800/75 dark:text-mist-100/75">
          Coquí customization arrives in milestone M3. For now, head back and
          explore the rainforest.
        </p>
        <LinkButton href="/" variant="secondary" className="mt-8">
          Back to the pond
        </LinkButton>
      </main>
    </div>
  );
}
