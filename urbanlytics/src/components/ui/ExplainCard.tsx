"use client";
import React from "react";
import { METRIC_TYPES } from "@/lib/risk";

export default function ExplainCard({ selected }: { selected: string }) {
  const items =
    selected === METRIC_TYPES.CRIME
      ? [
          { color: "#16a34a", label: "Low (<35)" },
          { color: "#eab308", label: "Medium (35–55)" },
          { color: "#ef4444", label: "High (>55)" },
        ]
      : selected === METRIC_TYPES.POLLUTION
      ? [
          { color: "#22c55e", label: "Good (<50)" },
          { color: "#f59e0b", label: "Moderate (50–100)" },
          { color: "#ef4444", label: "Poor (>100)" },
        ]
      : selected === METRIC_TYPES.PRICING
      ? [
          { color: "#10b981", label: "Affordable (<$1300)" },
          { color: "#f59e0b", label: "Moderate ($1300–1700)" },
          { color: "#f43f5e", label: "Expensive (>$1700)" },
        ]
      : [
          { color: "#22d3ee", label: "Excellent (≥80)" },
          { color: "#60a5fa", label: "Good (60–79)" },
          { color: "#64748b", label: "Limited (<60)" },
        ];

  return (
    <div className="absolute bottom-6 right-6 bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl shadow-lg">
      <h3 className="text-xs font-semibold text-zinc-300 mb-2 capitalize">
        {selected === METRIC_TYPES.TRANSIT ? "Transit Access" : selected}
      </h3>
      <div className="space-y-2">
        {items.map((i, k) => (
          <div key={k} className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded"
              style={{ backgroundColor: i.color }}
            />
            <span className="text-xs text-zinc-400">{i.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
