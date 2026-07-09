"use client";

import dynamic from "next/dynamic";

import type { MapMarker } from "@/components/maps/leaflet-map";

// Leaflet touches `window`/`document` on init, so it can only ever run
// client-side — dynamic-import with ssr disabled rather than relying on
// "use client" alone, which still SSRs the initial markup for hydration.
const LeafletMap = dynamic(
  () => import("@/components/maps/leaflet-map").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-text-faint">
        Loading map…
      </div>
    ),
  }
);

export function MapView({
  markers,
  height,
  zoom,
  className,
}: {
  markers: MapMarker[];
  height?: string;
  zoom?: number;
  className?: string;
}) {
  return <LeafletMap markers={markers} height={height} zoom={zoom} className={className} />;
}

export type { MapMarker };
