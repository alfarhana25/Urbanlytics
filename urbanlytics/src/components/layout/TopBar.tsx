"use client";

import { useEffect, useState } from "react";
import { Search, Moon, Sun } from "lucide-react";
import { useCommunityStore } from "@/app/stores/communityStore";
import { getCommunityData } from "@/app/utils/communityUtils";

type Theme = "light" | "dark";

const PALETTE = {
  beigeBg: "#F6F0E9",
  beigePanel: "#FBF7EF",
  beigeBorder: "#E6DCCD",
  ink: "#2B271F",
  inkSoft: "#5A5246",
  olive: "#6B8F71",
  oliveDark: "#3E5F43",
  oliveLight: "#A3B18A",
};

export default function TopBar() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<Theme>("light");

  const setCommunity = useCommunityStore((s) => s.setCommunity);
  const clearCommunity = useCommunityStore((s) => s.clearCommunity);

  // useEffect(() => {
  //   const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
  //   const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  //   const initial = saved ?? (prefersDark ? "dark" : "light");
  //   setTheme(initial);
  // }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      clearCommunity();
      return;
    }

    const data = getCommunityData(trimmed);
    if (data) {
      setCommunity(data);
      console.log("✅ Found community:", data.name);
    } else {
      console.warn("⚠️ No match found for:", trimmed);
      clearCommunity();
    }
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-6 backdrop-blur transition-colors duration-300"
      style={{
        background: theme === "dark" ? "rgba(24, 24, 24, 0.85)" : `linear-gradient(180deg, rgba(255,255,255,0.9), ${PALETTE.beigePanel})`,
        borderBottom: `1px solid ${theme === "dark" ? "#3E5F43" : PALETTE.beigeBorder}`,
        color: theme === "dark" ? "#F6F0E9" : PALETTE.ink,
      }}>
      {/* Left: Brand */}
      <h1 className="text-lg font-semibold tracking-tight" style={{ color: theme === "dark" ? "#FBF7EF" : PALETTE.oliveDark }}>
        Urbanlytics — Real-Time Risk Dashboard
      </h1>

      {/* Center: Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 pointer-events-none" style={{ color: theme === "dark" ? "#A3B18A" : "#6B8F71" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search neighbourhoods..."
          className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border outline-none transition-all"
          style={{
            backgroundColor: theme === "dark" ? "rgba(32,32,32,0.9)" : "#FFFFFFCC",
            borderColor: theme === "dark" ? "rgba(163,177,138,0.25)" : PALETTE.beigeBorder,
            color: theme === "dark" ? "#FBF7EF" : PALETTE.ink,
            boxShadow: theme === "light" ? `0 2px 4px rgba(62,95,67,0.08)` : "none",
          }}
        />
      </form>

      {/* Right: Nav + Theme toggle */}
      <div className="flex items-center gap-4">
        <nav
          className="hidden sm:flex gap-4 text-sm transition-colors"
          style={{
            color: theme === "dark" ? "#A3B18A" : PALETTE.oliveDark,
          }}></nav>

        {/* Theme toggle */}
        {/* <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-2 rounded-lg border transition-colors"
          style={{
            borderColor: theme === "dark" ? "rgba(163,177,138,0.25)" : PALETTE.beigeBorder,
            backgroundColor: theme === "dark" ? "rgba(45,45,45,0.6)" : "rgba(251,247,239,0.8)",
            color: theme === "dark" ? "#FBF7EF" : PALETTE.oliveDark,
          }}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button> */}
      </div>
    </header>
  );
}
