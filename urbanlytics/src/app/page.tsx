"use client";
import RiskMap from "@/components/map/RiskMap";
import LeftPanel from "@/components/panels/LeftPanel";
import TopBar from "@/components/layout/TopBar";

export default function HomePage() {
  return (
    <main className="h-dvh w-dvw overflow-hidden">
      <TopBar />
      <div className="flex h-[calc(100vh-56px)]">
        <div className="flex-1">
          <RiskMap />
        </div>
      </div>
    </main>
  );
}
