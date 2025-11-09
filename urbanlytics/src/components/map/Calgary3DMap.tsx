"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "@/lib/mapbox";

export default function Calgary3DMap() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN || "";
    const map = new mapboxgl.Map({
      container: ref.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-114.0719, 51.0447],
      zoom: 12.5,
      pitch: 60,
      bearing: -17.6,
      antialias: true,
    });
    map.on("load", () => {
      map.addSource("mapbox-dem", { type: "raster-dem", url: "mapbox://mapbox.mapbox-terrain-dem-v1" });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.4 });
      map.addLayer({ id: "sky", type: "sky", paint: { "sky-type": "atmosphere" } });
    });
    return () => map.remove();
  }, []);
  return <div ref={ref} className="h-full w-full" />;
}
