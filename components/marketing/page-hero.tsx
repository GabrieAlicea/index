import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  align = "center",
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-grid relative overflow-hidden border-b border-white/8">
      <div className="bg-radial-fade absolute inset-0" aria-hidden="true" />
      <div
        className={cn(
          "relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        <Reveal className={align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"}>
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="text-balance mt-5 text-lg leading-relaxed text-text-muted">
              {description}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
