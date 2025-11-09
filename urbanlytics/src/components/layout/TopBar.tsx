export default function TopBar() {
  return (
    <header className="topbar w-full bg-zinc-950 border-b border-zinc-800 text-white px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold">Urbanlytics — Real-Time Risk Dashboard</h1>
      <nav className="text-sm text-zinc-400">Now · Risk legend · Explain risk</nav>
    </header>
  );
}
