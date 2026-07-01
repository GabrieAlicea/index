export interface FrogToesProps {
  toeColor: string;
}

const TOE_POSITIONS = [
  { cx: 52, cy: 202 },
  { cx: 78, cy: 214 },
  { cx: 122, cy: 214 },
  { cx: 148, cy: 202 },
];

export function FrogToes({ toeColor }: FrogToesProps) {
  return (
    <g>
      {TOE_POSITIONS.map((pos, i) => (
        <ellipse key={i} cx={pos.cx} cy={pos.cy} rx={11} ry={7} fill={toeColor} />
      ))}
    </g>
  );
}
