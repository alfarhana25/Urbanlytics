"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";
import {
  METRIC_TYPES,
  deriveMetricBundle,
  metricValue,
  colorFor,
  intensityFor,
} from "@/lib/risk";
import Legend from "@/components/ui/ExplainCard";

const DEFAULT_CENTER = [51.0447, -114.0719];
const DEFAULT_ZOOM = 10.5;
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>';

const NAME_KEYS = ["name", "Name", "COMMUNITY", "COMM_NAME", "COMMUNITY_NAME"];
const LABEL_ZOOM_THRESHOLD = 14.5; // 👈 show labels after this zoom (increased for later appearance)

export default function Calgary3DMap({
  selectedMetric,
}: {
  selectedMetric: string;
}) {
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const labelLayerRef = useRef<any>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const geojsonUrl = "/data/Community_District_Boundaries_20251108.geojson";

  // Load Leaflet only once
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

  // Initialize map once
  useEffect(() => {
    if (!leafletReady) return;
    if (mapRef.current) return;

    const map = (window as any).L.map("map", {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });
    mapRef.current = map;

    (window as any).L.control.zoom({ position: "bottomleft" }).addTo(map);
    (window as any).L.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(map);

    fetch(geojsonUrl)
      .then((res) => res.json())
      .then((gj) => {
        const featureGroup = (window as any).L.featureGroup().addTo(map);
        const labelGroup = (window as any).L.layerGroup().addTo(map);

        const layer = (window as any).L.geoJSON(gj, {
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
          onEachFeature: (feature: any, lyr: any) => {
            const name =
              NAME_KEYS.reduce(
                (acc, k) => acc || feature.properties?.[k],
                ""
              ) || "Unknown";
            const bundle = deriveMetricBundle(name);

            lyr.bindPopup(
              `<b>${bundle.name}</b><br>${selectedMetric}: ${metricValue(
                bundle,
                selectedMetric
              )}`
            );

            // create label marker
            try {
              const center = lyr.getBounds().getCenter();
              const label = (window as any).L.marker(center, {
                icon: (window as any).L.divIcon({
                  className: "neighborhood-label",
                  html: `<div style="
                      font-weight:600;
                      font-size:11px;
                      color:#f5f5f5;
                      text-align:center;
                      text-shadow:0 0 4px rgba(0,0,0,0.9);
                      pointer-events:none;
                      white-space:nowrap;">${name}</div>`,
                }),
                interactive: false,
              });
              label.addTo(labelGroup);
            } catch {}
          },
        }).addTo(featureGroup);

        layerRef.current = layer;
        labelLayerRef.current = labelGroup;
        setLoading(false);

        // 👇 Hide labels until zoom threshold is met
        labelGroup.eachLayer((l: any) => l.remove());
        map.on("zoomend", () => {
          const currentZoom = map.getZoom();
          if (currentZoom >= LABEL_ZOOM_THRESHOLD) {
            if (!map.hasLayer(labelGroup)) map.addLayer(labelGroup);
          } else {
            if (map.hasLayer(labelGroup)) map.removeLayer(labelGroup);
          }
        });
      })
      .catch(() => setLoading(false));
  }, [leafletReady]);

  // Update fill colors when metric changes
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
          <Loader
            className="animate-spin text-zinc-400 mb-3"
            size={32}
          />
          <p className="text-zinc-400">Loading map...</p>
        </div>
      )}
      <div id="map" className="w-full h-full" />
      {leafletReady && <Legend selected={selectedMetric} />}
    </div>
  );
}