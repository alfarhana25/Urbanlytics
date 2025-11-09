"use client";
import React from "react";
import { METRIC_TYPES } from "@/lib/risk";

export default function LeftPanel({
  selectedMetric,
  onMetricChange,
}: {
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
}) {
  const metrics = [
    { key: METRIC_TYPES.PRICING, label: "Pricing" },
    { key: METRIC_TYPES.CRIME, label: "Crime" },
    { key: METRIC_TYPES.POLLUTION, label: "Pollution" },
    { key: METRIC_TYPES.TRANSIT, label: "Transit" },
  ];

  return (
    <div className="w-72 bg-zinc-950 border-r border-zinc-900 p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Neighbourhood Analytics
      </h1>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m) => (
          <button
            key={m.key}
            onClick={() => onMetricChange(m.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMetric === m.key
                ? "bg-blue-600 text-white"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
