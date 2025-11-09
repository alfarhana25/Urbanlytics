"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader } from "lucide-react";
import { METRIC_TYPES } from "@/lib/risk"; // we won't use colorFor/intensityFor now
import { getCommunityData } from "@/app/utils/communityUtils";
import { useCommunityStore } from "@/app/stores/communityStore";
import communitiesData from "@/data/communities/urbanlytics_communities.json";

const DEFAULT_CENTER = [51.0447, -114.0719];
const DEFAULT_ZOOM = 10.5;
const NAME_KEYS = ["name", "Name", "COMMUNITY", "COMM_NAME", "COMMUNITY_NAME"];
const GEOJSON_URL = "/data/Community_District_Boundaries_20251108.geojson";

// --- Basemaps (colorful options) ---
const BASEMAPS = {
  voyager: {
    id: "voyager",
    label: "Carto Voyager",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
    labelsUrl: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
    attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  osm: {
    id: "osm",
    label: "OSM Standard",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    labelsUrl: null as string | null,
    attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  positron: {
    id: "positron",
    label: "Carto Positron",
    url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    labelsUrl: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
    attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
} as const;

const PALETTE = {
  beigePanel: "#FBF7EF",
  beigeBorder: "#E6DCCD",
  ink: "#2B271F",
  inkSoft: "#5A5246",
  olive: "#6B8F71",
  oliveDark: "#3E5F43",
  oliveLight: "#A3B18A",
  oliveTint: "#DDE6D7",
};

// ---------- small helpers ----------
const normName = (s: string) => (s ?? "").toLowerCase().trim();
const getNameFromFeature = (feature: any) => NAME_KEYS.reduce((acc, k) => acc || feature?.properties?.[k], "") || "Unknown";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const scale01 = (val: number, min: number, max: number) => (!isFinite(val) || !isFinite(min) || !isFinite(max) || max <= min ? 0.5 : clamp01((val - min) / (max - min)));

// Green → Yellow → Red
function colorGYR(t: number) {
  t = clamp01(t);
  if (t <= 0.5) {
    const k = t / 0.5; // #10b981 → #f59e0b
    const r = Math.round(16 + (245 - 16) * k);
    const g = Math.round(185 + (158 - 185) * k);
    const b = Math.round(129 + (11 - 129) * k);
    return `rgb(${r},${g},${b})`;
  }
  const k = (t - 0.5) / 0.5; // #f59e0b → #f43f5e
  const r = Math.round(245 + (244 - 245) * k);
  const g = Math.round(158 + (63 - 158) * k);
  const b = Math.round(11 + (94 - 11) * k);
  return `rgb(${r},${g},${b})`;
}

// Try to pull a metric value out of your JSON record
type MetricSemantics = "cost" | "afford" | "score"; // cost: higher=worse, afford: higher=better
function extractMetricValue(rec: any, metric: string): { value: number | null; kind: MetricSemantics } {
  if (!rec) return { value: null, kind: "score" };

  const fromList = (arr: any[], matcher: (l: string) => boolean) => {
    if (!Array.isArray(arr)) return null;
    const m = arr.find((x) => matcher(String(x?.label || "").toLowerCase()));
    return typeof m?.score === "number" && isFinite(m.score) ? m.score : null;
  };

  // CRIME: look for "Crime" in primary/secondary metrics
  if (metric === METRIC_TYPES.CRIME) {
    const v = fromList(rec.primaryMetrics, (l) => l.includes("crime")) ?? fromList(rec.secondaryMetrics, (l) => l.includes("crime")) ?? rec?.metrics?.crime ?? rec?.crime ?? rec?.crimeScore ?? null;
    return { value: typeof v === "number" ? v : null, kind: "cost" };
  }

  // POLLUTION: "Air Quality"/"AQI"/"Pollution"
  if (metric === METRIC_TYPES.POLLUTION) {
    const v =
      fromList(rec.primaryMetrics, (l) => l.includes("air quality") || l.includes("aqi") || l.includes("pollution")) ??
      fromList(rec.secondaryMetrics, (l) => l.includes("air quality") || l.includes("aqi") || l.includes("pollution")) ??
      rec?.metrics?.aqi ??
      rec?.metrics?.pollution ??
      rec?.aqi ??
      rec?.pollution ??
      null;
    return { value: typeof v === "number" ? v : null, kind: "cost" }; // higher = worse AQI
  }

  // PRICING: prefer "Cost of Living" (affordability-like), else pricing/price fields (cost-like)
  if (metric === METRIC_TYPES.PRICING) {
    const costOfLiving =
      fromList(rec.primaryMetrics, (l) => l.includes("cost of living") || l.includes("afford")) ??
      fromList(rec.secondaryMetrics, (l) => l.includes("cost of living") || l.includes("afford")) ??
      rec?.metrics?.affordability ??
      rec?.affordabilityScore ??
      null;
    if (typeof costOfLiving === "number") return { value: costOfLiving, kind: "afford" }; // higher = better

    const priceScore = rec?.metrics?.pricing ?? rec?.pricing ?? fromList(rec.primaryMetrics, (l) => l.includes("pricing") || l.includes("price")) ?? fromList(rec.secondaryMetrics, (l) => l.includes("pricing") || l.includes("price")) ?? null;
    if (typeof priceScore === "number" && priceScore <= 100) return { value: priceScore, kind: "cost" };

    const rawPrice = rec?.avgPrice ?? rec?.medianPrice ?? rec?.housePrice ?? null;
    if (typeof rawPrice === "number") return { value: rawPrice, kind: "cost" };

    return { value: null, kind: "score" };
  }

  return { value: null, kind: "score" };
}

function TopRightPanel({ selectedMetric, onMetricChange, basemap, onBasemapChange }: { selectedMetric: string; onMetricChange: (m: string) => void; basemap: keyof typeof BASEMAPS; onBasemapChange: (b: keyof typeof BASEMAPS) => void }) {
  const metrics = [
    { key: METRIC_TYPES.PRICING, label: "Pricing" },
    { key: METRIC_TYPES.CRIME, label: "Crime" },
    { key: METRIC_TYPES.POLLUTION, label: "Pollution" },
  ];

  return (
    <div className="backdrop-blur-md border rounded-xl p-4 shadow-xl w-64 space-y-3" style={{ backgroundColor: `${PALETTE.beigePanel}E6`, borderColor: PALETTE.beigeBorder }}>
      <h3 className="text-sm font-semibold" style={{ color: PALETTE.ink }}>
        Neighbourhood Analytics
      </h3>

      {/* Metric chips */}
      <div className="grid grid-cols-3 gap-2">
        {metrics.map((m) => {
          const isSelected = selectedMetric === m.key;
          return (
            <button
              key={m.key}
              onClick={() => onMetricChange(m.key)}
              className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
              style={{
                backgroundColor: isSelected ? PALETTE.olive : PALETTE.oliveTint,
                color: isSelected ? "#fff" : PALETTE.inkSoft,
                border: `1px solid ${isSelected ? PALETTE.oliveDark : PALETTE.beigeBorder}`,
              }}>
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Basemap selector */}
      <div className="pt-1">
        <p className="text-[11px] font-semibold mb-1" style={{ color: PALETTE.inkSoft }}>
          Basemap
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(BASEMAPS) as Array<keyof typeof BASEMAPS>).map((key) => {
            const isActive = basemap === key;
            return (
              <button
                key={key}
                onClick={() => onBasemapChange(key)}
                className="text-[11px] px-2 py-1 rounded-md transition-colors"
                style={{
                  backgroundColor: isActive ? PALETTE.oliveLight : PALETTE.beigePanel,
                  color: isActive ? PALETTE.ink : PALETTE.inkSoft,
                  border: `1px solid ${isActive ? PALETTE.oliveDark : PALETTE.beigeBorder}`,
                }}>
                {BASEMAPS[key].label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BottomRightLegend({ selectedMetric }: { selectedMetric: string }) {
  const legendItems =
    selectedMetric === METRIC_TYPES.CRIME
      ? [
          { color: "#16a34a", label: "Low crime" },
          { color: "#eab308", label: "Moderate" },
          { color: "#ef4444", label: "High crime" },
        ]
      : selectedMetric === METRIC_TYPES.POLLUTION
      ? [
          { color: "#22c55e", label: "Good AQI" },
          { color: "#f59e0b", label: "Moderate" },
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

export default function Calgary3DMap() {
  const [selectedMetric, setSelectedMetric] = useState(METRIC_TYPES.CRIME);
  const [selectedBasemap, setSelectedBasemap] = useState<keyof typeof BASEMAPS>("voyager");

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);
  const selectedLayerRef = useRef<any>(null);
  const baseTileRef = useRef<any>(null);
  const labelTileRef = useRef<any>(null);

  const [leafletReady, setLeafletReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const setCommunity = useCommunityStore((s) => s.setCommunity);

  // Build a name → record map and metric domains from your JSON
  const { byName, domains } = useMemo(() => {
    const by: Record<string, any> = {};
    (communitiesData as any[]).forEach((rec: any) => {
      const key = normName(rec?.name || rec?.Name || rec?.COMMUNITY || rec?.COMM_NAME || rec?.COMMUNITY_NAME || "") || null;
      if (key) by[key] = rec;
    });

    const metrics = [METRIC_TYPES.CRIME, METRIC_TYPES.POLLUTION, METRIC_TYPES.PRICING] as const;
    const dom: Record<string, { min: number; max: number }> = {};

    metrics.forEach((m) => {
      let min = Infinity;
      let max = -Infinity;
      Object.values(by).forEach((rec: any) => {
        const { value } = extractMetricValue(rec, m);
        if (typeof value === "number" && isFinite(value)) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });

      if (!isFinite(min) || !isFinite(max) || max <= min) {
        // safe fallbacks; wide for pricing to accommodate raw $ values if present
        dom[m] = m === METRIC_TYPES.PRICING ? { min: 0, max: 1_000_000 } : { min: 0, max: 100 };
      } else {
        dom[m] = { min, max };
      }
    });

    return { byName: by, domains: dom };
  }, []);

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

  // Style per feature — uses communitiesData
  const styleForFeature = (feature: any) => {
    const name = getNameFromFeature(feature);
    const rec = byName[normName(name)];
    let { value, kind } = extractMetricValue(rec, selectedMetric);

    // If not found in your JSON, render neutral mid (won't crash)
    if (value == null) {
      value = 50;
      kind = "score";
      // console.warn("[Map] No communitiesData match or metric missing for:", name);
    }

    const { min, max } = domains[selectedMetric] || { min: 0, max: 100 };
    let t = scale01(Number(value), min, max);

    // Semantics:
    // - Crime/Pollution are "cost": higher = worse → redder (no inversion)
    // - Pricing:
    //    * If we detected "afford" (Cost of Living; higher=more affordable) → invert so affordable=green
    //    * If it's cost-like (price/expensive index, raw $) → no inversion (higher=red)
    if (selectedMetric === METRIC_TYPES.PRICING && kind === "afford") {
      t = 1 - t;
    }

    return {
      color: "#ffffff",
      weight: 1.2,
      fillColor: colorGYR(t),
      fillOpacity: 0.68,
    };
  };

  // (re)apply basemap
  const applyBasemap = () => {
    if (!mapRef.current || !(window as any).L) return;
    const L = (window as any).L;

    if (baseTileRef.current) {
      mapRef.current.removeLayer(baseTileRef.current);
      baseTileRef.current = null;
    }
    if (labelTileRef.current) {
      mapRef.current.removeLayer(labelTileRef.current);
      labelTileRef.current = null;
    }

    const def = BASEMAPS[selectedBasemap];
    baseTileRef.current = L.tileLayer(def.url, { attribution: def.attr }).addTo(mapRef.current);
    if (def.labelsUrl) {
      labelTileRef.current = L.tileLayer(def.labelsUrl, {
        attribution: def.attr,
        pane: "overlayPane",
        opacity: 0.85,
      }).addTo(mapRef.current);
    }
  };

  // Init map + GeoJSON
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapRef.current) return;

    const L = (window as any).L;
    const map = (mapRef.current = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER as any,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    }));

    L.control.zoom({ position: "bottomleft" }).addTo(map);
    applyBasemap();

    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((gj) => {
        const geo = (geoJsonLayerRef.current = L.geoJSON(gj, {
          style: styleForFeature,
          onEachFeature: (feature: any, layer: any) => {
            const name = getNameFromFeature(feature);
            layer.bindTooltip(name, { sticky: true, direction: "top", offset: [0, -6] });

            layer.on("click", () => {
              const data = getCommunityData(name);
              if (data) setCommunity(data);

              if (selectedLayerRef.current && selectedLayerRef.current !== layer) {
                const prev = selectedLayerRef.current;
                const p: SVGPathElement | null = prev?._path || null;
                if (p) p.classList.remove("pulse-selected");
                prev.setStyle(styleForFeature(prev.feature));
              }
              selectedLayerRef.current = layer;

              const p: SVGPathElement | null = layer?._path || null;
              if (p) p.classList.add("pulse-selected");
              layer.setStyle({ color: PALETTE.oliveDark, weight: 2.2 });
              if (layer.bringToFront) layer.bringToFront();
            });

            layer.on("mouseover", function () {
              if (selectedLayerRef.current === this) return;
              this.setStyle({
                weight: 2,
                color: "#ffffff",
                fillOpacity: 0.9,
              });
            });

            layer.on("mouseout", function () {
              if (selectedLayerRef.current === this) return;
              this.setStyle(styleForFeature(this.feature));
            });
          },
        }).addTo(map));

        setTimeout(() => map.invalidateSize(), 300);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      if (selectedLayerRef.current) {
        const prev = selectedLayerRef.current;
        const p: SVGPathElement | null = prev?._path || null;
        if (p) p.classList.remove("pulse-selected");
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletReady]);

  // Recolor polygons when metric changes (keep pulse)
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer: any) => {
      if (layer === selectedLayerRef.current) return;
      layer.setStyle(styleForFeature(layer.feature));
    });

    if (selectedLayerRef.current) {
      const layer = selectedLayerRef.current;
      layer.setStyle({ ...styleForFeature(layer.feature), color: PALETTE.oliveDark, weight: 2.2 });
      const p: SVGPathElement | null = layer?._path || null;
      if (p) p.classList.add("pulse-selected");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMetric]);

  // Swap basemap on selection change
  useEffect(() => {
    if (!mapRef.current) return;
    applyBasemap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBasemap]);

  return (
    <div className="relative bg-zinc-100 text-zinc-950 flex flex-col h-[calc(100vh-56px)]">
      {/* Global CSS for tiles & pulse */}
      <style jsx global>{`
        #map .leaflet-tile {
          filter: saturate(1.05) contrast(1.03);
        }
        .pulse-selected {
          animation: breatheFill 1.8s ease-in-out infinite;
          filter: drop-shadow(0 0 6px rgba(63, 95, 67, 0.55));
          transition: fill-opacity 0.25s ease, stroke-width 0.25s ease;
        }
        @keyframes breatheFill {
          0% {
            fill-opacity: 0.55;
            stroke-width: 1.2;
          }
          50% {
            fill-opacity: 0.95;
            stroke-width: 3;
          }
          100% {
            fill-opacity: 0.55;
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

      {/* UI chrome */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-end items-start pointer-events-auto p-5">
          <TopRightPanel selectedMetric={selectedMetric} onMetricChange={setSelectedMetric} basemap={selectedBasemap} onBasemapChange={setSelectedBasemap} />
        </div>
        <div className="flex justify-end items-end p-4 pointer-events-auto">
          <BottomRightLegend selectedMetric={selectedMetric} />
        </div>
      </div>
    </div>
  );
}
