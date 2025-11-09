"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function CalgaryNeighborhoodsMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-114.0719, 51.0447],
      zoom: 10,
      pitch: 0,
    });

    map.on("load", () => {
      // Add community borders from Calgary Open Data
      map.addSource("neighborhoods", {
        type: "geojson",
        data: "https://data.calgary.ca/resource/tp6c-g2iy.geojson",
      });

      // Outline each neighborhood
      map.addLayer({
        id: "neighborhood-outline",
        type: "line",
        source: "neighborhoods",
        paint: {
          "line-color": "#0070f3",
          "line-width": 2,
        },
      });

      // Fill each neighborhood with a light shade
      map.addLayer({
        id: "neighborhood-fill",
        type: "fill",
        source: "neighborhoods",
        paint: {
          "fill-color": "#88c9ff",
          "fill-opacity": 0.3,
        },
      });

      // Add labels (community names)
      map.addLayer({
        id: "neighborhood-labels",
        type: "symbol",
        source: "neighborhoods",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 12,
          "text-offset": [0, 0.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#333333",
        },
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="w-full h-screen" />;
}
