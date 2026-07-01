import { useId } from "react";
import type { BodyPattern } from "@/types/frog";

export interface FrogBodyProps {
  bodyColor: string;
  pattern: BodyPattern;
}

const BODY_PATH =
  "M30,140 C30,80 65,40 100,40 C135,40 170,80 170,140 C170,185 140,210 100,210 C60,210 30,185 30,140 Z";

const SPOT_POSITIONS = [
  { cx: 62, cy: 90, r: 8 },
  { cx: 130, cy: 100, r: 7 },
  { cx: 100, cy: 70, r: 6 },
  { cx: 75, cy: 130, r: 6 },
  { cx: 125, cy: 140, r: 8 },
];

export function FrogBody({ bodyColor, pattern }: FrogBodyProps) {
  const clipId = useId();

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={BODY_PATH} />
        </clipPath>
      </defs>

      <path d={BODY_PATH} fill={bodyColor} />

      {pattern !== "solid" && (
        <g clipPath={`url(#${clipId})`}>
          {pattern === "spots" &&
            SPOT_POSITIONS.map((spot, i) => (
              <circle
                key={i}
                cx={spot.cx}
                cy={spot.cy}
                r={spot.r}
                fill="rgba(255,255,255,0.28)"
              />
            ))}
          {pattern === "stripes" &&
            [50, 80, 110, 140].map((x, i) => (
              <rect
                key={i}
                x={x}
                y={40}
                width={10}
                height={170}
                fill="rgba(11,61,36,0.12)"
                transform="skewX(-12)"
              />
            ))}
        </g>
      )}
    </g>
  );
}
