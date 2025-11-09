"use client";

import LeftPanel from "@/components/panels/LeftPanel";
import RiskMap from "@/components/map/RiskMap";
import TopBar from "@/components/layout/TopBar";

export default function ExplorePage() {
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

