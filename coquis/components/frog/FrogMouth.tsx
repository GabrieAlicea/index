export interface FrogMouthProps {
  /** -1 (frown) to 1 (big smile). */
  smile: number;
}

export function FrogMouth({ smile }: FrogMouthProps) {
  const mouthY = 178 + smile * 8;

  return (
    <path
      d={`M84,${mouthY} Q100,${mouthY + smile * 10} 116,${mouthY}`}
      fill="none"
      stroke="#3E2C23"
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}
