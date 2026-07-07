export type ServiceItem = {
  name: string;
  fromPrice: number | null; // in whole dollars, null = quote only
};

export type ServiceCategory = {
  slug: string;
  name: string;
  icon:
    | "oil"
    | "brakes"
    | "battery"
    | "tires"
    | "electronics"
    | "wrench"
    | "roadside";
  tagline: string;
  description: string;
  fromPrice: number;
  durationMinutes: [number, number];
  services: ServiceItem[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "maintenance",
    name: "Maintenance",
    icon: "oil",
    tagline: "Keep it running right",
    description:
      "Routine maintenance performed in your driveway with OEM-spec fluids and parts, backed by a written warranty.",
    fromPrice: 89,
    durationMinutes: [30, 60],
    services: [
      { name: "Oil Change (Synthetic)", fromPrice: 89 },
      { name: "Spark Plug Replacement", fromPrice: 149 },
      { name: "Belt Replacement", fromPrice: 129 },
      { name: "Radiator Service", fromPrice: 179 },
      { name: "Coolant Flush", fromPrice: 119 },
      { name: "Transmission Fluid Service", fromPrice: 169 },
      { name: "Differential Service", fromPrice: 149 },
      { name: "Tire Rotation", fromPrice: 49 },
    ],
  },
  {
    slug: "brakes-suspension",
    name: "Brakes & Suspension",
    icon: "brakes",
    tagline: "Stop and handle with confidence",
    description:
      "Pad, rotor, and full suspension work — every job includes a multi-point safety inspection.",
    fromPrice: 149,
    durationMinutes: [45, 120],
    services: [
      { name: "Brake Pad & Rotor Replacement", fromPrice: 149 },
      { name: "Brake Fluid Bleed", fromPrice: 99 },
      { name: "Suspension Inspection & Repair", fromPrice: 179 },
      { name: "Control Arm Replacement", fromPrice: 219 },
      { name: "Ball Joint Replacement", fromPrice: 189 },
      { name: "Tie Rod Replacement", fromPrice: 159 },
      { name: "Wheel Bearing Replacement", fromPrice: 199 },
    ],
  },
  {
    slug: "battery-electrical",
    name: "Battery & Electrical",
    icon: "battery",
    tagline: "Diagnose it right the first time",
    description:
      "Computer diagnostics, charging-system repair, and electrical troubleshooting from ASE-certified techs.",
    fromPrice: 99,
    durationMinutes: [20, 90],
    services: [
      { name: "Battery Replacement", fromPrice: 119 },
      { name: "Alternator Replacement", fromPrice: 259 },
      { name: "Starter Replacement", fromPrice: 249 },
      { name: "Full Diagnostics Scan", fromPrice: 99 },
      { name: "Lights & Sensor Repair", fromPrice: 89 },
      { name: "Electrical Repair", fromPrice: null },
      { name: "Battery Load Testing", fromPrice: 39 },
    ],
  },
  {
    slug: "tires-wheels",
    name: "Tires & Wheels",
    icon: "tires",
    tagline: "Grip you can trust",
    description: "Tire replacement, balancing, and rotation — mounted curbside, no shop wait.",
    fromPrice: 129,
    durationMinutes: [30, 75],
    services: [
      { name: "Tire Replacement (per tire)", fromPrice: 129 },
      { name: "Tire Balancing", fromPrice: 59 },
      { name: "Flat Tire Repair", fromPrice: 49 },
      { name: "Wheel Alignment Check", fromPrice: 69 },
    ],
  },
  {
    slug: "audio-electronics",
    name: "Audio & Electronics",
    icon: "electronics",
    tagline: "Upgrade your ride",
    description:
      "Custom installs — speakers, amps, dash cams, remote start, and full infotainment upgrades.",
    fromPrice: 119,
    durationMinutes: [45, 180],
    services: [
      { name: "Speaker Installation", fromPrice: 119 },
      { name: "Radio / Head Unit Installation", fromPrice: 149 },
      { name: "Dash Camera Installation", fromPrice: 99 },
      { name: "Subwoofer & Amplifier Install", fromPrice: 199 },
      { name: "Reverse Camera Installation", fromPrice: 139 },
      { name: "GPS Installation", fromPrice: 129 },
      { name: "CarPlay / Android Auto Retrofit", fromPrice: 179 },
      { name: "Remote Starter Installation", fromPrice: 219 },
      { name: "12V Accessory Installation", fromPrice: 79 },
      { name: "Winch Installation", fromPrice: 249 },
      { name: "LED Lighting Installation", fromPrice: 99 },
      { name: "Custom Electronics", fromPrice: null },
    ],
  },
  {
    slug: "custom-repair",
    name: "Custom Repair",
    icon: "wrench",
    tagline: "Anything else, quoted fair",
    description:
      "Describe the issue and photos — a certified mechanic sends a fixed quote before any work (or dispatch) happens.",
    fromPrice: 0,
    durationMinutes: [30, 240],
    services: [{ name: "Custom Repair Quote", fromPrice: null }],
  },
  {
    slug: "roadside-assistance",
    name: "Roadside Assistance",
    icon: "roadside",
    tagline: "Stuck? We're close by",
    description: "Lockouts, jump starts, flats, and fuel delivery — average arrival under 30 minutes.",
    fromPrice: 59,
    durationMinutes: [15, 45],
    services: [
      { name: "Lockout Service", fromPrice: 59 },
      { name: "Jump Start", fromPrice: 49 },
      { name: "Flat Tire Change", fromPrice: 59 },
      { name: "Battery Testing", fromPrice: 39 },
      { name: "Emergency Fuel Delivery", fromPrice: 69 },
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return SERVICE_CATEGORIES.find((c) => c.slug === slug);
}
