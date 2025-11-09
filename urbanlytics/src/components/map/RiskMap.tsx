"use client";
import React, { useState } from "react";
import Sidebar from "@/components/panels/LeftPanel";
import MapView from "@/components/map/Calgary3DMap";
import { METRIC_TYPES } from "@/lib/risk";

export default function RiskMap() {
  const [selectedMetric, setSelectedMetric] = useState(METRIC_TYPES.CRIME);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
      />
      <MapView selectedMetric={selectedMetric} />
    </div>
  );
}
