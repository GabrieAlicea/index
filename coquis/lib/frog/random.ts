export function pick<T>(options: readonly T[]): T {
  const option = options[Math.floor(Math.random() * options.length)];
  if (option === undefined) {
    throw new Error("pick() called with an empty options array");
  }
  return option;
}

/** Random integer in [min, max], inclusive. */
export function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}
