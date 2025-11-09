export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800 text-white px-6 h-14 flex items-center justify-between">
      <h1 className="text-lg font-semibold">
        Urbanlytics — Real-Time Risk Dashboard
      </h1>
      <nav className="text-sm text-zinc-400">
        Now · Risk legend · Explain risk
      </nav>
    </header>
  );
}
