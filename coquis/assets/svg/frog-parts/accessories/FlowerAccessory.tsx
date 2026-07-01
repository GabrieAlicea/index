const PETAL_ANGLES = [0, 72, 144, 216, 288];

export function FlowerAccessory() {
  return (
    <g>
      {PETAL_ANGLES.map((angle) => (
        <ellipse
          key={angle}
          cx={0}
          cy={-7}
          rx={5}
          ry={8}
          fill="#E23E57"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx={0} cy={0} r={5} fill="#F4B942" />
    </g>
  );
}
