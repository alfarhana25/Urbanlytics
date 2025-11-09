"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";
import { METRIC_TYPES, deriveMetricBundle, metricValue, colorFor, intensityFor } from "@/lib/risk";
import { getCommunityData } from "@/app/utils/communityUtils";
import { useCommunityStore } from "@/app/stores/communityStore";
import communitiesData from "@/data/communities/urbanlytics_communities.json";

const DEFAULT_CENTER = [51.0447, -114.0719];
const DEFAULT_ZOOM = 10.5;
const TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>';
const NAME_KEYS = ["name", "Name", "COMMUNITY", "COMM_NAME", "COMMUNITY_NAME"];
const GEOJSON_URL = "/data/Community_District_Boundaries_20251108.geojson";

const PALETTE = {
  beigeBg: "#F6F0E9",
  beigePanel: "#FBF7EF",
  beigeBorder: "#E6DCCD",
  ink: "#2B271F",
  inkSoft: "#5A5246",
  olive: "#6B8F71",
  oliveDark: "#3E5F43",
  oliveLight: "#A3B18A",
  oliveTint: "#DDE6D7",
};

function TopRightPanel({ selectedMetric, onMetricChange }: { selectedMetric: string; onMetricChange: (m: string) => void }) {
  const metrics = [
    { key: METRIC_TYPES.PRICING, label: "Pricing" },
    { key: METRIC_TYPES.CRIME, label: "Crime" },
    { key: METRIC_TYPES.POLLUTION, label: "Pollution" },
  ];
  return (
    <div className="backdrop-blur-md border rounded-xl p-4 shadow-xl w-60" style={{ backgroundColor: `${PALETTE.beigePanel}E6`, borderColor: PALETTE.beigeBorder }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: PALETTE.ink }}>
        Neighbourhood Analytics
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m) => {
          const isSelected = selectedMetric === m.key;
          return (
            <button
              key={m.key}
              onClick={() => onMetricChange(m.key)}
              className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
              style={{
                backgroundColor: isSelected ? PALETTE.olive : PALETTE.oliveTint,
                color: isSelected ? PALETTE.beigePanel : PALETTE.inkSoft,
                border: `1px solid ${isSelected ? PALETTE.oliveDark : PALETTE.beigeBorder}`,
              }}>
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BottomRightLegend({ selectedMetric }: { selectedMetric: string }) {
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
      : [
          { color: "#10b981", label: "Affordable" },
          { color: "#f59e0b", label: "Average" },
          { color: "#f43f5e", label: "Expensive" },
        ];
  return (
    <div className="backdrop-blur-md border rounded-xl p-4 shadow-xl w-56" style={{ backgroundColor: `${PALETTE.beigePanel}E6`, borderColor: PALETTE.beigeBorder }}>
      <h4 className="text-xs font-semibold mb-2" style={{ color: PALETTE.inkSoft }}>
        {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Scale
      </h4>
      <div className="space-y-1">
        {legendItems.map((i, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: i.color }} />
            <span style={{ color: PALETTE.inkSoft }}>{i.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const getNameFromFeature = (feature: any) => NAME_KEYS.reduce((acc, k) => acc || feature?.properties?.[k], "") || "Unknown";

export default function Calgary3DMap() {
  const [selectedMetric, setSelectedMetric] = useState(METRIC_TYPES.CRIME);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);
  const selectedLayerRef = useRef<any>(null);

  const [leafletReady, setLeafletReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const setCommunity = useCommunityStore((s) => s.setCommunity);

  // Load Leaflet
  useEffect(() => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(css);

    const js = document.createElement("script");
    js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    js.onload = () => setLeafletReady(true);
    document.body.appendChild(js);
  }, []);

  // Base style (no animation)
  const baseStyleFor = (feature: any) => {
    const name = getNameFromFeature(feature);
    const bundle = deriveMetricBundle(name);
    const val = metricValue(bundle, selectedMetric);
    return {
      color: "#0ea5e9",
      weight: 1.2,
      fillColor: colorFor(val, selectedMetric),
      fillOpacity: intensityFor(val, selectedMetric),
    };
  };

  // Helpers to toggle CSS class on selected path
  const applySelectedClass = (layer: any) => {
    const path: SVGPathElement | null = layer?._path || null;
    if (!path) return;
    path.classList.add("pulse-selected");
    // enforce stroke color for contrast
    layer.setStyle({ color: PALETTE.oliveDark });
    if (layer.bringToFront) layer.bringToFront();
  };

  const clearSelectedClass = (layer: any) => {
    const path: SVGPathElement | null = layer?._path || null;
    if (!path) return;
    path.classList.remove("pulse-selected");
    layer.setStyle(baseStyleFor(layer.feature));
  };

  // Init map + GeoJSON
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapRef.current) return;

    const map = (mapRef.current = (window as any).L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER as any,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    }));

    (window as any).L.control.zoom({ position: "bottomleft" }).addTo(map);
    (window as any).L.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(map);

    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((gj) => {
        const geo = (geoJsonLayerRef.current = (window as any).L.geoJSON(gj, {
          style: (feature: any) => baseStyleFor(feature),
          onEachFeature: (feature: any, layer: any) => {
            const name = getNameFromFeature(feature);

            layer.on("click", () => {
              const data = getCommunityData(name);
              if (data) setCommunity(data);

              if (selectedLayerRef.current && selectedLayerRef.current !== layer) {
                clearSelectedClass(selectedLayerRef.current);
              }
              selectedLayerRef.current = layer;
              applySelectedClass(layer);
            });

            layer.on("mouseover", function () {
              if (selectedLayerRef.current === this) return; // keep pulse styling
              this.setStyle({
                weight: 2,
                color: "#3b82f6",
                fillOpacity: Math.min(0.9, (this.options.fillOpacity ?? 0.6) + 0.15),
              });
            });

            layer.on("mouseout", function () {
              if (selectedLayerRef.current === this) return; // keep pulse styling
              this.setStyle(baseStyleFor(this.feature));
            });
          },
        }).addTo(map));

        setTimeout(() => map.invalidateSize(), 300);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      if (selectedLayerRef.current) clearSelectedClass(selectedLayerRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletReady]);

  // Restyle (but don’t kill the pulse) when metric changes
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer: any) => {
      if (layer === selectedLayerRef.current) return; // CSS handles pulse; we only refresh color on it below
      layer.setStyle(baseStyleFor(layer.feature));
    });

    if (selectedLayerRef.current) {
      // refresh base color for selected layer; CSS animation overlays on top
      const layer = selectedLayerRef.current;
      const base = baseStyleFor(layer.feature);
      layer.setStyle({ ...base, color: PALETTE.oliveDark });
      applySelectedClass(layer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMetric]);

  return (
    <div className="relative bg-zinc-100 text-zinc-950 flex flex-col h-[calc(100vh-56px)]">
      {/* Global CSS for the pulse animation */}
      <style jsx global>{`
        /* Apply to the SVG path of the selected polygon */
        .pulse-selected {
          animation: breatheFill 1.8s ease-in-out infinite;
          /* The stroke color is set from JS for consistency with theme */
          filter: drop-shadow(0 0 6px rgba(63, 95, 67, 0.55));
          transition: fill-opacity 0.25s ease, stroke-width 0.25s ease;
        }
        @keyframes breatheFill {
          0% {
            fill-opacity: 0.45;
            stroke-width: 1.2;
          }
          50% {
            fill-opacity: 0.85;
            stroke-width: 3;
          }
          100% {
            fill-opacity: 0.45;
            stroke-width: 1.2;
          }
        }
      `}</style>

      <div ref={mapContainerRef} id="map" className="flex-1 w-full h-full min-h-[600px]" />

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
          <Loader className="animate-spin text-zinc-400 mb-3" size={32} />
          <p className="text-zinc-400">Loading map…</p>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-end items-start pointer-events-auto p-5">
          <TopRightPanel selectedMetric={selectedMetric} onMetricChange={setSelectedMetric} />
        </div>
        <div className="flex justify-end items-end p-4 pointer-events-auto">
          <BottomRightLegend selectedMetric={selectedMetric} />
        </div>
      </div>
    </div>
  );
}
