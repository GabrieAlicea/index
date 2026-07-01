export interface SwatchOption {
  id: string;
  label: string;
  value: string;
}

export const BODY_COLOR_PALETTE: SwatchOption[] = [
  { id: "moss", label: "Moss", value: "#3F7D4E" },
  { id: "fern", label: "Fern", value: "#6FA96B" },
  { id: "canopy", label: "Canopy", value: "#1E7A45" },
  { id: "bark", label: "Bark", value: "#5A3F30" },
  { id: "coqui-brown", label: "Coquí Brown", value: "#8B5E3C" },
  { id: "flamboyan", label: "Flamboyán", value: "#E8542B" },
  { id: "orchid", label: "Orchid", value: "#B565A7" },
  { id: "hibiscus", label: "Hibiscus", value: "#E23E57" },
  { id: "sungold", label: "Sun Gold", value: "#F4B942" },
  { id: "stream", label: "Stream Blue", value: "#4FB3BF" },
];

export const BELLY_COLOR_PALETTE: SwatchOption[] = [
  { id: "cream", label: "Cream", value: "#FBF8F1" },
  { id: "mist", label: "Mist", value: "#EAF6EF" },
  { id: "dawn", label: "Dawn", value: "#FCE8C6" },
  { id: "blush", label: "Blush", value: "#F6D9D2" },
  { id: "stone", label: "Stone", value: "#E4DED0" },
];

export const EYE_COLOR_PALETTE: SwatchOption[] = [
  { id: "charcoal", label: "Charcoal", value: "#24261F" },
  { id: "bark", label: "Bark", value: "#3E2C23" },
  { id: "deep-canopy", label: "Deep Canopy", value: "#0B3D24" },
  { id: "midnight", label: "Midnight", value: "#10122B" },
  { id: "hibiscus", label: "Hibiscus", value: "#E23E57" },
];

export const TOE_COLOR_PALETTE: SwatchOption[] = [
  { id: "coqui-brown", label: "Coquí Brown", value: "#8B5E3C" },
  { id: "bark", label: "Bark", value: "#5A3F30" },
  { id: "sungold", label: "Sun Gold", value: "#F4B942" },
  { id: "canopy", label: "Canopy", value: "#1E7A45" },
];
