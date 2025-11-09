"use client";

import { useState } from "react";
import { Search, Settings, User } from "lucide-react";

export default function TopBar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", query);
    // later: trigger map filter or analytics query here
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800 text-white px-6 h-14 flex items-center justify-between">
      {/* Left section */}
      <h1 className="text-lg font-semibold tracking-tight">Urbanlytics — Real-Time Risk Dashboard</h1>

      {/* Center: Search bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search neighbourhoods..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {/* Right: Navigation and controls */}
      <div className="flex items-center gap-5 text-sm text-zinc-400">
        <nav className="hidden sm:flex gap-4">
          <button className="hover:text-white transition-colors">Now</button>
          <button className="hover:text-white transition-colors">Risk Legend</button>
          <button className="hover:text-white transition-colors">Explain Risk</button>
        </nav>

        {/* <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-zinc-800 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div> */}
      </div>
    </header>
  );
}
