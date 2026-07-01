const STRIPE_Y = [-9, -3, 3];

export function FlagBandana() {
  return (
    <g>
      <rect x={-24} y={-9} width={48} height={18} rx={4} fill="#FBF8F1" />
      {STRIPE_Y.map((y) => (
        <rect key={y} x={-24} y={y} width={48} height={3.6} fill="#E23E57" />
      ))}
      <path d="M-24,-9 L-8,-9 L-24,9 Z" fill="#2B2A5C" />
      <path
        d="M-18,0 l1.1,1.9 2.2,0 -1.8,1.3 0.7,2.1 -1.9,-1.3 -1.9,1.3 0.7,-2.1 -1.8,-1.3 2.2,0 Z"
        fill="#FBF8F1"
      />
    </g>
  );
}
