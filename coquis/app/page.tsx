import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-midnight-900">
      <Header />
      <main>
        <HeroSection />
        <FeatureHighlights />
      </main>
      <Footer />
    </div>
  );
}
