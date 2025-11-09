"use client";

import { useEffect, useState } from "react";
import { Search, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export default function TopBar() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<Theme>("light");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
  }, []);

  // Apply theme to <html> and persist
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", query);
    // TODO: wire into your map/filter logic
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white border-b border-zinc-200 text-zinc-900
                       dark:bg-zinc-950/80 dark:border-zinc-800 dark:text-white px-6 h-14 flex items-center justify-between">
      {/* Left: Brand */}
      <h1 className="text-lg font-semibold tracking-tight">Urbanlytics — Real-Time Risk Dashboard</h1>

      {/* Center: Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search neighbourhoods..."
          className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border
                     bg-zinc-100 border-zinc-300 placeholder-zinc-500 text-zinc-900
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder-zinc-500 dark:text-white"
          aria-label="Search"
        />
      </form>

      {/* Right: Nav + Theme toggle */}
      <div className="flex items-center gap-4">
        <nav className="hidden sm:flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <button className="hover:text-zinc-900 dark:hover:text-white transition-colors">Now</button>
          <button className="hover:text-zinc-900 dark:hover:text-white transition-colors">Risk Legend</button>
          <button className="hover:text-zinc-900 dark:hover:text-white transition-colors">Explain Risk</button>
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-100
                     dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
