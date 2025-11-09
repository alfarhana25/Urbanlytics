"use client";

import TopBar from "@/components/layout/TopBar";
import LeftPanel from "@/components/panels/LeftPanel";
import RiskMap from "@/components/map/RiskMap";

export default function ExplorePage() {
  return (
    <main className="h-dvh w-dvw overflow-hidden bg-[#05070f]">
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
