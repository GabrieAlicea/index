import { Leaf } from "@/assets/svg/environment/Leaf";

interface LeafPlacement {
  left: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
  color: string;
  rotate: string;
}

const LEAVES: LeafPlacement[] = [
  { left: "4%", top: "-6%", size: 90, duration: "4.6s", delay: "0s", color: "text-canopy-700", rotate: "-8deg" },
  { left: "14%", top: "-10%", size: 60, duration: "3.8s", delay: "0.6s", color: "text-moss-500", rotate: "6deg" },
  { left: "82%", top: "-8%", size: 100, duration: "5.2s", delay: "0.2s", color: "text-canopy-500", rotate: "10deg" },
  { left: "92%", top: "-4%", size: 64, duration: "4.1s", delay: "0.9s", color: "text-fern-400", rotate: "-4deg" },
  { left: "48%", top: "-12%", size: 70, duration: "4.4s", delay: "0.4s", color: "text-moss-300", rotate: "2deg" },
];

export function LeafSway() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-visible" aria-hidden="true">
      {LEAVES.map((leaf, i) => (
        <div
          key={i}
          className={`motion-safe:animate-leafSway absolute origin-top ${leaf.color}`}
          style={{
            left: leaf.left,
            top: leaf.top,
            width: leaf.size,
            height: leaf.size * 1.5,
            animationDuration: leaf.duration,
            animationDelay: leaf.delay,
            transform: `rotate(${leaf.rotate})`,
          }}
        >
          <Leaf className="h-full w-full drop-shadow-soft" />
        </div>
      ))}
    </div>
  );
}
