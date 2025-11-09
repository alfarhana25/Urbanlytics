"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";
import { METRIC_TYPES, deriveMetricBundle, metricValue, colorFor, intensityFor } from "@/lib/risk";
import Legend from "@/components/ui/ExplainCard";

const DEFAULT_CENTER = [51.0447, -114.0719];
const DEFAULT_ZOOM = 10.5;
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>';

const NAME_KEYS = ["name", "Name", "COMMUNITY", "COMM_NAME", "COMMUNITY_NAME"];

export default function Calgary3DMap({ selectedMetric }: { selectedMetric: string }) {
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const geojsonUrl = "/data/Community_District_Boundaries_20251108.geojson";

  // Load Leaflet once
  useEffect(() => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(css);

    const js = document.createElement("script");
    js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    js.onload = () => setLeafletReady(true);
    document.body.appendChild(js);
  }, []);

  // Initialize the map only once
  useEffect(() => {
    if (!leafletReady) return;
    if (mapRef.current) return;

    const map = window.L.map("map", {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });
    mapRef.current = map;

    window.L.control.zoom({ position: "bottomleft" }).addTo(map);
    window.L.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(map);

    fetch(geojsonUrl)
      .then((res) => res.json())
      .then((gj) => {
        const layer = window.L.geoJSON(gj, {
          style: (feature: any) => {
            const name =
              NAME_KEYS.reduce(
                (acc, k) => acc || feature.properties?.[k],
                ""
              ) || "Unknown";
            const bundle = deriveMetricBundle(name);
            const val = metricValue(bundle, selectedMetric);
            return {
              color: "#0ea5e9",
              weight: 1.2,
              fillColor: colorFor(val, selectedMetric),
              fillOpacity: intensityFor(val, selectedMetric),
            };
          },
          onEachFeature: (feature: any, layer: any) => {
            const name =
              NAME_KEYS.reduce(
                (acc, k) => acc || feature.properties?.[k],
                ""
              ) || "Unknown";
            const bundle = deriveMetricBundle(name);
            layer.bindPopup(
              `<b>${bundle.name}</b><br>${selectedMetric}: ${metricValue(
                bundle,
                selectedMetric
              )}`
            );
          },
        }).addTo(map);

        layerRef.current = layer;
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [leafletReady]);

  // Update polygon colors when metric changes (no re-init)
  useEffect(() => {
    if (!layerRef.current) return;

    layerRef.current.eachLayer((layer: any) => {
      const feature = layer.feature;
      const name =
        NAME_KEYS.reduce(
          (acc, k) => acc || feature.properties?.[k],
          ""
        ) || "Unknown";
      const bundle = deriveMetricBundle(name);
      const val = metricValue(bundle, selectedMetric);

      layer.setStyle({
        fillColor: colorFor(val, selectedMetric),
        fillOpacity: intensityFor(val, selectedMetric),
      });

      // update popup text
      layer.bindPopup(
        `<b>${bundle.name}</b><br>${selectedMetric}: ${metricValue(
          bundle,
          selectedMetric
        )}`
      );
    });
  }, [selectedMetric]);

  return (
    <div className="flex-1 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
          <Loader className="animate-spin mx-auto mb-3 text-zinc-400" size={32} />
          <p className="text-zinc-400">Loading map...</p>
        </div>
      )}
      <div id="map" className="w-full h-full" />
      {leafletReady && <Legend selected={selectedMetric} />}
    </div>
  );
}
