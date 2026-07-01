import type { TimeOfDay } from "@/types/environment";

const STAR_POSITIONS = [
  { left: "12%", top: "10%", size: 3, delay: "0s" },
  { left: "24%", top: "22%", size: 2, delay: "0.4s" },
  { left: "38%", top: "8%", size: 2, delay: "1.1s" },
  { left: "55%", top: "16%", size: 3, delay: "0.7s" },
  { left: "70%", top: "9%", size: 2, delay: "1.6s" },
  { left: "85%", top: "20%", size: 3, delay: "0.2s" },
];

export interface CelestialLayerProps {
  timeOfDay: TimeOfDay;
}

export function CelestialLayer({ timeOfDay }: CelestialLayerProps) {
  if (timeOfDay === "day") {
    return (
      <div
        aria-hidden="true"
        className="motion-safe:animate-pulse absolute right-[12%] top-[8%] h-14 w-14 rounded-pill bg-sungold-500 shadow-lifted"
      />
    );
  }

  if (timeOfDay === "dusk") {
    return (
      <div
        aria-hidden="true"
        className="absolute right-[15%] top-[38%] h-16 w-16 rounded-pill bg-flamboyan-500 opacity-90 shadow-lifted"
      />
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-[14%] top-[10%] h-10 w-10 rounded-pill bg-mist-100/90 shadow-soft" />
      {STAR_POSITIONS.map((star, i) => (
        <div
          key={i}
          className="motion-safe:animate-pulse absolute rounded-pill bg-cream-50"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}
