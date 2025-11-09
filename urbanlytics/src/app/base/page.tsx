"use client";

import RiskMap from "@/components/map/RiskMap";
import TopBar from "@/components/layout/TopBar";
import { AnalyticsSidebar } from "@/components/panels/LeftPanel";
import { useCommunityStore } from "@/app/stores/communityStore";

const PALETTE = {
  beigeBg: "#F6F0E9",
  beigePanel: "#FBF7EF",
  beigeBorder: "#E6DCCD",
  ink: "#2B271F",
  inkSoft: "#5A5246",
  olive: "#6B8F71",
  oliveDark: "#3E5F43",
};

export default function HomePage() {
  const selected = useCommunityStore((s) => s.selectedCommunity);

  return (
    <main className="h-dvh w-dvw overflow-hidden pt-14" style={{ backgroundColor: PALETTE.beigeBg, color: PALETTE.ink }}>
      <TopBar />

      {/* Main layout */}
      <div className="flex h-[calc(100dvh-3.5rem)] transition-all duration-500 ease-in-out">
        {/* ---- Sidebar ---- */}
        <aside
          className={`relative h-full transition-all duration-500 ease-in-out overflow-hidden
            ${selected ? "md:w-[450px] w-96" : "w-0"}
          `}
          style={{
            borderRight: `1px solid ${PALETTE.beigeBorder}`,
            background: selected ? `linear-gradient(180deg, #FFFFFF, ${PALETTE.beigePanel})` : undefined,
          }}>
          <div className={`h-full transition-transform duration-500 ease-in-out ${selected ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
            {selected && (
              <div className="h-full overflow-y-auto">
                <AnalyticsSidebar data={selected} />
              </div>
            )}
          </div>
        </aside>

        {/* ---- Map ---- */}
        <section
          className={`flex-1 relative overflow-hidden transition-all duration-500 ease-in-out ${selected ? "md:w-[calc(100%-450px)]" : "w-full"}`}
          style={{
            // subtle panel edge so the map sits nicely against beige
            boxShadow: selected ? `inset 12px 0 24px -24px rgba(62,95,67,0.25)` : undefined,
          }}>
          <RiskMap
            // If your RiskMap supports props, pass the palette so layers/controls match:
            // @ts-ignore – remove if you add these props in RiskMap
            colors={{
              background: PALETTE.beigeBg,
              border: PALETTE.beigeBorder,
              text: PALETTE.ink,
              accent: PALETTE.olive,
              accentDark: PALETTE.oliveDark,
              // Choropleth (low→high):
              choropleth: ["#A3B18A", "#6B8F71", "#3E5F43"],
              outline: "#C8D4C6",
            }}
          />
        </section>
      </div>
    </main>
  );
}
