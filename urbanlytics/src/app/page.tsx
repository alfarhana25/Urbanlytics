"use client";
import RiskMap from "@/components/map/RiskMap";
import TopBar from "@/components/layout/TopBar";

export default function HomePage() {
  return (
    <main className="h-dvh w-dvw overflow-hidden bg-zinc-950 text-neutral-100">
      <TopBar />
      <div className="pt-14 h-[calc(100vh-56px)] flex">
        {/* Map area fills all remaining height below TopBar */}
        <div className="flex-1 relative overflow-hidden">
          <RiskMap />
        </div>
      </div>
    </main>
  );
}
