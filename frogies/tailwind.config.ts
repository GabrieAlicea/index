import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canopy: { 900: "#0B3D24", 700: "#145C34", 500: "#1E7A45" },
        moss: { 500: "#3F7D4E", 300: "#7FAE7E" },
        fern: { 400: "#6FA96B" },
        leaf: { 300: "#A8D5A2", 100: "#DCEFD8" },
        bark: { 800: "#3E2C23", 600: "#5A3F30" },
        soil: { 600: "#6B4A34" },
        coqui: { 700: "#5C3B22", 500: "#8B5E3C", 300: "#C9A57A" },
        flamboyan: { 500: "#E8542B" },
        orchid: { 500: "#B565A7" },
        hibiscus: { 500: "#E23E57" },
        dawn: { 100: "#FCE8C6" },
        dusk: { 700: "#2B2A5C" },
        midnight: { 900: "#10122B" },
        stream: { 400: "#4FB3BF" },
        mist: { 100: "#EAF6EF" },
        firefly: { 400: "#FFD873" },
        sungold: { 500: "#F4B942" },
        cream: { 50: "#FBF8F1" },
        stone: { 200: "#E4DED0" },
        charcoal: { 800: "#24261F" },
        golden: { DEFAULT: "#F4B942", shimmer: "#FFE9A8" },
        albino: { DEFAULT: "#FDFBF7", blush: "#F6D9D2" },
      },
      fontFamily: {
        display: ["var(--font-fredoka)", "sans-serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.75rem",
        lg: "1.25rem",
        xl: "2rem",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(11,61,36,0.15)",
        lifted: "0 12px 32px -8px rgba(11,61,36,0.25)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.03)" },
        },
        blink: {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.1)" },
        },
        fireflyFloat: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0)" },
        },
        leafSway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        breathe: "breathe 3.2s ease-in-out infinite",
        blink: "blink 4.5s ease-in-out infinite",
        fireflyFloat: "fireflyFloat 3.6s ease-in-out infinite",
        leafSway: "leafSway 4.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
