"use client";

import * as React from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  color?: "primary" | "success" | "warning";
};

const COLOR_HEX: Record<NonNullable<MapMarker["color"]>, string> = {
  primary: "#2E6BFF",
  success: "#2ECC71",
  warning: "#F5A623",
};

function markerIcon(color: NonNullable<MapMarker["color"]> = "primary") {
  return L.divIcon({
    className: "revvy-map-marker",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${COLOR_HEX[color]};border:3px solid #08090D;box-shadow:0 0 0 2px ${COLOR_HEX[color]}66;"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export function LeafletMap({
  markers,
  height = "100%",
  zoom = 13,
  className,
}: {
  markers: MapMarker[];
  height?: string;
  zoom?: number;
  className?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<L.Map | null>(null);
  const markersLayerRef = React.useRef<L.LayerGroup | null>(null);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] = markers[0]
      ? [markers[0].lat, markers[0].lng]
      : [28.5383, -81.3792]; // Orlando, our launch metro

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markers.forEach((m) => {
      L.marker([m.lat, m.lng], { icon: markerIcon(m.color) })
        .bindPopup(m.label ?? "")
        .addTo(layer);
    });

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [markers]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height, width: "100%", borderRadius: "inherit" }}
    />
  );
}
