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
