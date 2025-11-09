// src/app/page.tsx
"use client";

import { useState } from "react";
import RiskMap from "@/components/map/RiskMap";
import TopBar from "@/components/layout/TopBar";
import { AnalyticsSidebar } from "@/components/panels/LeftPanel";
import brentwoodData from "@/data/communities/brentwood.json";
import type { UserProgress } from "@/lib/types";

export default function HomePage() {
  // --- Gamified progress state (temporary demo) ---
  const [progress, setProgress] = useState<UserProgress>({
    level: 3,
    xp: 120,
    nextXp: 200,
    streakDays: 4,
    quests: [
      { id: "open-crime", title: "Open Crime Heatmap", xp: 25, done: false, icon: "Shield" },
      { id: "toggle-3-metrics", title: "Toggle 3 key metrics", xp: 20, done: true, icon: "TrendingUp" },
      { id: "compare-2", title: "Compare with 2 communities", xp: 40, done: false, icon: "Target" },
    ],
    badges: [
      { id: "safety-scout", name: "Safety Scout", tier: "bronze", earned: true, icon: "Shield" },
      { id: "mobility-maven", name: "Mobility Maven", tier: "silver", earned: false, hint: "Check 3 transit metrics", icon: "Bus" },
      { id: "green-guardian", name: "Green Guardian", tier: "gold", earned: false, hint: "Explore all climate layers", icon: "Trees" },
    ],
  });

  // --- XP + quest handling ---
  const handleQuestToggle = (id: string, nextDone: boolean) => {
    setProgress((p) => {
      const quests = p.quests.map((q) => (q.id === id ? { ...q, done: nextDone } : q));
      const delta = nextDone ? p.quests.find((q) => q.id === id)?.xp ?? 0 : -(p.quests.find((q) => q.id === id)?.xp ?? 0);
      let xp = p.xp + delta;
      let level = p.level;
      let nextXp = p.nextXp;

      while (xp >= nextXp) {
        xp -= nextXp;
        level += 1;
        nextXp = Math.round(nextXp * 1.2);
      }

      return { ...p, quests, xp, level, nextXp };
    });
  };

  const handleCompareReward = () => {
    const compareQuest = progress.quests.find((q) => q.id === "compare-2" && !q.done);
    if (compareQuest) handleQuestToggle(compareQuest.id, true);
  };

  return (
    <main className="h-dvh w-dvw overflow-hidden bg-zinc-950 text-neutral-100 pt-14">
      {/* Top navigation bar */}
      <TopBar />

      {/* Layout: Sidebar + Map */}
      <div className="flex h-[calc(100dvh-3.5rem)]">
        {/* Left analytics/gamified panel */}
        <div className="hidden md:block w-96 lg:w-[450px] shrink-0 overflow-y-auto border-r border-zinc-800">
          <AnalyticsSidebar data={brentwoodData} progress={progress} onQuestToggle={handleQuestToggle} onClaimCompareReward={handleCompareReward} />
        </div>

        {/* Main interactive map area */}
        <div className="flex-1 relative overflow-hidden">
          <RiskMap />
        </div>
      </div>
    </main>
  );
}
