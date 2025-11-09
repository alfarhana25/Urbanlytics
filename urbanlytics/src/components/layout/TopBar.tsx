"use client";
export default function TopBar() {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4">
      <h1 className="font-semibold">Urbanlytics — Real-Time Risk Dashboard</h1>
      <div className="text-sm text-neutral-500">Now · Risk legend · Explain risk</div>
    </header>
  );
}
