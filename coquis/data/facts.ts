export interface Fact {
  category: "Coquí" | "Rainforest" | "Culture";
  text: string;
}

export const FACTS: Fact[] = [
  {
    category: "Coquí",
    text: 'The coquí is named after the two-note call the males make — "co-KEE" — which locals hear as their own name.',
  },
  {
    category: "Coquí",
    text: "Unlike most frogs, coquís skip the tadpole stage entirely — their eggs hatch directly into tiny froglets.",
  },
  {
    category: "Coquí",
    text: "There are over a dozen coquí species in Puerto Rico, and most exist nowhere else on Earth.",
  },
  {
    category: "Rainforest",
    text: "El Yunque National Forest is the only tropical rainforest in the U.S. National Forest System.",
  },
  {
    category: "Rainforest",
    text: "El Yunque can receive over 200 inches of rain a year — more than four times the rainiest U.S. city.",
  },
  {
    category: "Culture",
    text: 'The coquí\'s song is such a beloved part of Puerto Rican identity that "¡Soy de aquí, como el coquí!" — "I\'m from here, like the coquí!" — is a common expression of pride.',
  },
];
