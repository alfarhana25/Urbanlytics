// src/app/page.tsx
"use client";

import RiskMap from "@/components/map/RiskMap";
import TopBar from "@/components/layout/TopBar";
import { AnalyticsSidebar } from "@/components/panels/LeftPanel";
import brentwoodData from "@/data/communities/brentwood.json";

export default function HomePage() {
  return (
    <main className="h-dvh w-dvw overflow-hidden bg-zinc-950 text-neutral-100 pt-14">
      <TopBar />
      <div className="flex h-[calc(100dvh-3.5rem)]">
        {/* Left analytics panel (fixed width) */}
        <div className="hidden md:block w-96 lg:w-[450px] shrink-0 overflow-y-auto border-r border-zinc-800">
          <AnalyticsSidebar data={brentwoodData} />
        </div>

        {/* Map area fills remaining space */}
        <div className="flex-1 relative overflow-hidden">
          <RiskMap />
        </div>
      </div>
    </main>
  );
}
