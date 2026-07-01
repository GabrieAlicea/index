export interface FrogBellyProps {
  bellyColor: string;
}

export function FrogBelly({ bellyColor }: FrogBellyProps) {
  return <ellipse cx={100} cy={158} rx={40} ry={44} fill={bellyColor} />;
}
