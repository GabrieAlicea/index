const ORLANDO_FALLBACK = { lat: 28.5383, lon: -81.3792 };

// Nominatim is OpenStreetMap's free geocoding API — no key required, but its
// usage policy requires a real User-Agent and caps unauthenticated use at
// ~1 request/second (https://operations.osmfoundation.org/policies/nominatim/).
// Fine for launch-scale traffic; move to a paid provider (Geoapify, MapTiler,
// or a self-hosted Nominatim instance) if booking volume grows enough to
// bump into that limit.
export async function geocodeAddress(address: {
  line1: string;
  city: string;
  state: string;
  postalCode: string;
}): Promise<{ lat: number; lon: number } | null> {
  const query = `${address.line1}, ${address.city}, ${address.state} ${address.postalCode}, USA`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Revvy/1.0 (mobile mechanic marketplace; support@revvy.com)",
      },
    });
    if (!res.ok) return null;

    const results = (await res.json()) as { lat: string; lon: string }[];
    const first = results[0];
    if (!first) return null;

    return { lat: parseFloat(first.lat), lon: parseFloat(first.lon) };
  } catch (err) {
    console.error("Nominatim geocoding failed:", err);
    return null;
  }
}

export function toPointWkt(coords: { lat: number; lon: number } | null): string {
  const point = coords ?? { lat: ORLANDO_FALLBACK.lat, lon: ORLANDO_FALLBACK.lon };
  return `POINT(${point.lon} ${point.lat})`;
}
