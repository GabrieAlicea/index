export interface LeafProps {
  className?: string;
}

export function Leaf({ className }: LeafProps) {
  return (
    <svg
      viewBox="0 0 64 96"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M32 2C10 18 4 46 16 72c6 13 12 18 16 22 4-4 10-9 16-22C60 46 54 18 32 2Z"
        fill="currentColor"
      />
      <path
        d="M32 8C32 8 32 60 32 92"
        stroke="rgba(11,61,36,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
