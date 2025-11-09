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
