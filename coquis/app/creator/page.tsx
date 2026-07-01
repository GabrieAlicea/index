import { Header } from "@/components/layout/Header";
import { LinkButton } from "@/components/ui/LinkButton";
import { FrogRenderer } from "@/components/frog/FrogRenderer";
import { DEFAULT_FROG_CONFIG } from "@/lib/frog/frogConfig";

export default function CreatorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50 dark:bg-midnight-900">
      <Header />
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <FrogRenderer config={DEFAULT_FROG_CONFIG} className="w-56 sm:w-64" />

        <h1 className="mt-4 font-display text-4xl font-semibold text-canopy-700 dark:text-leaf-300">
          Say hello to your Coquí
        </h1>
        <p className="mt-4 font-body text-charcoal-800/75 dark:text-mist-100/75">
          Full color, pattern, and accessory customization hops in with
          milestone M3. For now, this little one is just breathing and
          blinking in its default colors.
        </p>
        <LinkButton href="/" variant="secondary" className="mt-8">
          Back to the pond
        </LinkButton>
      </main>
    </div>
  );
}
