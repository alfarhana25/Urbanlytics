#!/usr/bin/env bash
set -euo pipefail

# Ensure we're at the project root and src/ exists
if [ ! -d "src" ]; then
  echo "❌ 'src/' not found. Run this from your Next.js project root (with a src folder)."
  exit 1
fi

echo "✅ Building Urbanlytics file structure..."

# --- Directories ---
mkdir -p src/app
mkdir -p src/app/api/tiles/risk
mkdir -p src/app/api/route/safe
mkdir -p src/app/api/incidents/recent
mkdir -p src/components/map
mkdir -p src/components/panels
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/providers
mkdir -p src/lib

# --- Root page ---
cat > src/app/page.tsx <<'EOF'
"use client";
import RiskMap from "@/components/map/RiskMap";
import LeftPanel from "@/components/panels/LeftPanel";
import TopBar from "@/components/layout/TopBar";

export default function HomePage() {
  return (
    <main className="h-dvh w-dvw overflow-hidden">
      <TopBar />
      <div className="flex h-[calc(100vh-56px)]">
        <LeftPanel />
        <div className="flex-1">
          <RiskMap />
        </div>
      </div>
    </main>
  );
}
EOF

# --- Top Bar (Urbanlytics branding) ---
cat > src/components/layout/TopBar.tsx <<'EOF'
"use client";
export default function TopBar() {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4">
      <h1 className="font-semibold">Urbanlytics — Real-Time Risk Dashboard</h1>
      <div className="text-sm text-neutral-500">Now · Risk legend · Explain risk</div>
    </header>
  );
}
EOF

# --- Left Panel ---
cat > src/components/panels/LeftPanel.tsx <<'EOF'
"use client";
import LayerToggles from "@/components/ui/LayerToggles";
import SafeRouteForm from "@/components/panels/SafeRouteForm";
import ExplainCard from "@/components/ui/ExplainCard";

export default function LeftPanel() {
  return (
    <aside className="w-[32vw] max-w-[520px] min-w-[320px] h-full border-r p-3 hidden md:flex flex-col gap-3">
      <LayerToggles />
      <SafeRouteForm />
      <ExplainCard />
    </aside>
  );
}
EOF

# --- Safe Route Form ---
cat > src/components/panels/SafeRouteForm.tsx <<'EOF'
"use client";
import { useState } from "react";

export default function SafeRouteForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [safer, setSafer] = useState(true);

  const onRoute = async () => {
    const url = `/api/route/safe?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&mode=${safer ? "safer" : "fastest"}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Route:", data);
    alert(`Mock: ETA ${data.etaMin} min · Risk ${data.riskScore}`);
  };

  return (
    <section className="border rounded-lg p-3">
      <h2 className="font-medium mb-2">SafeRoute</h2>
      <div className="flex flex-col gap-2">
        <input className="border rounded px-2 py-1" placeholder="From (lng,lat or place)" value={from} onChange={e=>setFrom(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="To (lng,lat or place)" value={to} onChange={e=>setTo(e.target.value)} />
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={safer} onChange={e=>setSafer(e.target.checked)} />
          Prefer safer path (vs fastest)
        </label>
        <button onClick={onRoute} className="border rounded px-3 py-1 hover:bg-neutral-50">Route</button>
      </div>
    </section>
  );
}
EOF

# --- UI: Toggles ---
cat > src/components/ui/LayerToggles.tsx <<'EOF'
"use client";
import { useState } from "react";

export default function LayerToggles() {
  const [crime, setCrime] = useState(true);
  const [traffic, setTraffic] = useState(true);
  const [weather, setWeather] = useState(true);

  // In a real app, lift these to context/store for the map to read
  return (
    <section className="border rounded-lg p-3">
      <h2 className="font-medium mb-2">Layers</h2>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={crime} onChange={e=>setCrime(e.target.checked)} /> Crime
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={traffic} onChange={e=>setTraffic(e.target.checked)} /> Traffic
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={weather} onChange={e=>setWeather(e.target.checked)} /> Weather
      </label>
    </section>
  );
}
EOF

# --- UI: Legend / Explainability ---
cat > src/components/ui/ExplainCard.tsx <<'EOF'
"use client";
export default function ExplainCard() {
  return (
    <section className="border rounded-lg p-3 text-sm">
      <h2 className="font-medium mb-2">Explainability</h2>
      <p>Select a hex on the map to view a breakdown like:</p>
      <ul className="list-disc ml-5 mt-2">
        <li>62/100 High — 45% crime, 35% traffic, 20% weather</li>
        <li>Night multiplier +20%</li>
      </ul>
    </section>
  );
}
EOF

# --- Map component (Mapbox + Deck.gl hook-in placeholder) ---
cat > src/components/map/RiskMap.tsx <<'EOF'
"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { getHexagonLayer } from "@/lib/deckLayers";
import { MAPBOX_TOKEN } from "@/lib/mapbox";

export default function RiskMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN || "";
    const map = new mapboxgl.Map({
      container: "risk-map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-114.0719, 51.0447], // Calgary
      zoom: 10.5,
      pitch: 60,
      bearing: -17.6,
      antialias: true,
    });
    mapRef.current = map;

    const overlay = new MapboxOverlay({ interleaved: true });
    map.addControl(overlay);

    map.on("load", async () => {
      // DEM + 3D buildings
      map.addSource("mapbox-dem", { type: "raster-dem", url: "mapbox://mapbox.mapbox-terrain-dem-v1" });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.4 });
      map.addLayer({
        id: "sky",
        type: "sky",
        paint: { "sky-type": "atmosphere", "sky-atmosphere-sun-intensity": 15 }
      });

      // Fetch mock risk bins (server can return GeoJSON points for HexagonLayer)
      const res = await fetch("/api/tiles/risk?z=10&x=0&y=0");
      const data = await res.json();

      // Deck.gl hex layer
      const hex = getHexagonLayer(data.features || data.points || []);
      overlay.setProps({ layers: [hex] });
    });

    return () => map.remove();
  }, []);

  return <div id="risk-map" className="h-full w-full" />;
}
EOF

# --- lib: deck.gl layer helper ---
cat > src/lib/deckLayers.ts <<'EOF'
import { HexagonLayer } from "@deck.gl/aggregation/typed";

type Pt = { longitude: number; latitude: number; weight?: number };

export function getHexagonLayer(points: Pt[]) {
  return new HexagonLayer<Pt>({
    id: "risk-hex",
    data: points,
    getPosition: d => [d.longitude, d.latitude],
    getElevationWeight: d => d.weight ?? 1,
    elevationScale: 50,
    extruded: true,
    radius: 300,
    coverage: 0.9,
    pickable: true,
  });
}
EOF

# --- lib: risk helpers ---
cat > src/lib/risk.ts <<'EOF'
export type RiskInputs = {
  crime_rate_norm: number;
  traffic_sev_norm: number;
  weather_risk_norm: number;
  time_of_day: "day" | "evening" | "night";
  lighting: "well-lit" | "unknown" | "poorly-lit";
};

export function scoreRisk(i: RiskInputs) {
  const base =
    0.45 * i.crime_rate_norm +
    0.35 * i.traffic_sev_norm +
    0.20 * i.weather_risk_norm;

  const tom = i.time_of_day === "day" ? 0.9 : i.time_of_day === "evening" ? 1.0 : 1.2;
  const lm = i.lighting === "well-lit" ? 0.95 : i.lighting === "poorly-lit" ? 1.1 : 1.0;

  const r = 100 * base * tom * lm;
  return Math.max(0, Math.min(100, r));
}
EOF

# --- lib: mapbox token ---
cat > src/lib/mapbox.ts <<'EOF'
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
EOF

# --- providers (placeholder for React Query, etc.) ---
cat > src/providers/QueryProvider.tsx <<'EOF'
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export default function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
EOF

# --- API routes (mock JSON so UI works immediately) ---
cat > src/app/api/tiles/risk/route.ts <<'EOF'
import { NextResponse } from "next/server";

export async function GET() {
  const points = [
    { longitude: -114.0719, latitude: 51.0447, weight: 0.6 },
    { longitude: -114.06, latitude: 51.05, weight: 0.8 },
    { longitude: -114.09, latitude: 51.05, weight: 0.4 },
    { longitude: -114.08, latitude: 51.02, weight: 0.7 },
    { longitude: -114.10, latitude: 51.06, weight: 0.5 },
  ];
  return NextResponse.json({ points });
}
EOF

cat > src/app/api/route/safe/route.ts <<'EOF'
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const mode = searchParams.get("mode") || "safer";

  return NextResponse.json({
    from, to, mode,
    etaMin: mode === "safer" ? 18 : 15,
    riskScore: mode === "safer" ? 32 : 48,
    polyline: "_mock_polyline_",
  });
}
EOF

cat > src/app/api/incidents/recent/route.ts <<'EOF'
import { NextResponse } from "next/server";

export async function GET() {
  const features = [
    { type: "Feature", geometry: { type: "Point", coordinates: [-114.07, 51.045] }, properties: { type: "collision", severity: 2 } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-114.09, 51.05] }, properties: { type: "break-in", severity: 3 } },
  ];
  return NextResponse.json({ type: "FeatureCollection", features });
}
EOF

# --- Optional: Calgary3DMap placeholder ---
cat > src/components/map/Calgary3DMap.tsx <<'EOF'
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
EOF

echo "✅ Done.

Next steps:
1) npm i @deck.gl/core @deck.gl/aggregation @deck.gl/mapbox mapbox-gl @tanstack/react-query
2) echo 'NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here' > .env.local
3) npm run dev
"
