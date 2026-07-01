import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FrogGrid } from "@/components/gallery/FrogGrid";

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50 dark:bg-midnight-900">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold text-canopy-700 dark:text-leaf-300 sm:text-4xl">
            Your pond
          </h1>
          <p className="mt-2 font-body text-charcoal-800/75 dark:text-mist-100/75">
            Every Coquí you&apos;ve saved, all in one place.
          </p>
        </div>
        <div className="mt-8">
          <FrogGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
