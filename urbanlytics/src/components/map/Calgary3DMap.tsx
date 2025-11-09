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

const DEFAULT_CENTER = [51.0447, -114.0719];
const DEFAULT_ZOOM = 10.5;
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>';
const NAME_KEYS = ["name", "Name", "COMMUNITY", "COMM_NAME", "COMMUNITY_NAME"];
const GEOJSON_URL = "/data/Community_District_Boundaries_20251108.geojson";

// ---------- PANELS ----------
function TopRightPanel({ selectedMetric, onMetricChange }) {
  const metrics = [
    { key: METRIC_TYPES.PRICING, label: "Pricing" },
    { key: METRIC_TYPES.CRIME, label: "Crime" },
    { key: METRIC_TYPES.POLLUTION, label: "Pollution" },
    { key: METRIC_TYPES.TRANSIT, label: "Transit" },
  ];

  return (
    <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl p-4 shadow-xl w-60">
      <h3 className="text-sm font-semibold text-zinc-100 mb-3">
        Neighbourhood Analytics
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m) => (
          <button
            key={m.key}
            onClick={() => onMetricChange(m.key)}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedMetric === m.key
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BottomRightLegend({ selectedMetric }) {
  const legendItems =
    selectedMetric === METRIC_TYPES.CRIME
      ? [
          { color: "#16a34a", label: "Low crime" },
          { color: "#eab308", label: "Moderate crime" },
          { color: "#ef4444", label: "High crime" },
        ]
      : selectedMetric === METRIC_TYPES.POLLUTION
      ? [
          { color: "#22c55e", label: "Good AQI" },
          { color: "#f59e0b", label: "Moderate AQI" },
          { color: "#ef4444", label: "Poor AQI" },
        ]
      : selectedMetric === METRIC_TYPES.PRICING
      ? [
          { color: "#10b981", label: "Affordable" },
          { color: "#f59e0b", label: "Average" },
          { color: "#f43f5e", label: "Expensive" },
        ]
      : [
          { color: "#22d3ee", label: "Excellent transit" },
          { color: "#60a5fa", label: "Good transit" },
          { color: "#64748b", label: "Limited transit" },
        ];

  return (
    <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl p-4 shadow-xl w-56">
      <h4 className="text-xs font-semibold text-zinc-300 mb-2">
        {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Scale
      </h4>
      <div className="space-y-1">
        {legendItems.map((i, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span
              className="inline-block w-3 h-3 rounded"
              style={{ backgroundColor: i.color }}
            />
            <span className="text-zinc-400">{i.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- MAIN MAP ----------
export default function Calgary3DMap() {
  const [selectedMetric, setSelectedMetric] = useState(METRIC_TYPES.CRIME);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Initialize map
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapRef.current) return;

    const map = window.L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });
    mapRef.current = map;

    window.L.control.zoom({ position: "bottomleft" }).addTo(map);
    window.L.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(map);

    // Load GeoJSON
    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((gj) => {
        const layer = window.L.geoJSON(gj, {
          style: (feature) => {
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
        }).addTo(map);

        layerRef.current = layer;
        setTimeout(() => map.invalidateSize(), 300); // ✅ ensures correct sizing
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [leafletReady]);

  // Update polygons on metric change
  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.eachLayer((layer) => {
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
    });
  }, [selectedMetric]);

  // ---------- RENDER ----------
  return (
    <div className="relative bg-zinc-950 text-zinc-100 flex flex-col h-[calc(100vh-56px)]">
      {/* Map container must have fixed height to render properly */}
      <div
        ref={mapContainerRef}
        id="map"
        className="flex-1 w-full h-full min-h-[600px]"
      />

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
          <Loader className="animate-spin text-zinc-400 mb-3" size={32} />
          <p className="text-zinc-400">Loading map…</p>
        </div>
      )}

      {/* Overlay panels */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-end items-start p-4 pointer-events-auto">
          <TopRightPanel
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />
        </div>
        <div className="flex justify-end items-end p-4 pointer-events-auto">
          <BottomRightLegend selectedMetric={selectedMetric} />
        </div>
      </div>
    </div>
  );
}
