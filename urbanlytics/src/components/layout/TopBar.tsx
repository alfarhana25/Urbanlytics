"use client";

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-neutral-800 bg-zinc-950/80 backdrop-blur flex items-center justify-between px-4">
      <h1 className="font-semibold text-neutral-100">
        Urbanlytics — Real-Time Risk Dashboard
      </h1>
      <div className="text-sm text-neutral-400">
        Now · Risk legend · Explain risk
      </div>
    </header>
  );
}
