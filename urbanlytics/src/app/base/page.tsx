"use client";

import RiskMap from "@/components/map/RiskMap";
import TopBar from "@/components/layout/TopBar";
import { AnalyticsSidebar } from "@/components/panels/LeftPanel";
import { useCommunityStore } from "@/app/stores/communityStore";

export default function HomePage() {
  const selected = useCommunityStore((s) => s.selectedCommunity);

  return (
    <main className="h-dvh w-dvw overflow-hidden bg-zinc-950 text-neutral-100 pt-14">
      <TopBar />

      {/* Main layout */}
      <div className="flex h-[calc(100dvh-3.5rem)] transition-all duration-500 ease-in-out">
        {/* ---- Sidebar ---- */}
        <aside
          className={`relative h-full border-r border-zinc-800 bg-zinc-950
            transition-all duration-500 ease-in-out overflow-hidden
            ${selected ? "md:w-[450px] w-96" : "w-0"}
          `}
        >
          <div
            className={`h-full transition-transform duration-500 ease-in-out ${
              selected ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          >
            {selected && (
              <div className="h-full overflow-y-auto">
                <AnalyticsSidebar data={selected} />
              </div>
            )}
          </div>
        </aside>

        {/* ---- Map ---- */}
        <section
          className={`flex-1 relative overflow-hidden transition-all duration-500 ease-in-out ${
            selected ? "md:w-[calc(100%-450px)]" : "w-full"
          }`}
        >
          <RiskMap />
        </section>
      </div>
    </main>
  );
}
