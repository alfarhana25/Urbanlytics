// src/app/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, memo, type CSSProperties, type ReactNode } from "react";

// -----------------------------
// Static data
// -----------------------------
const strataLayers = [
  { label: "Safety", description: "Live crime scoring for every block, refreshed nightly." },
  { label: "Affordability", description: "Monitor rent shifts, home prices, and tax deltas in context." },
  { label: "Climate", description: "Overlay flood plains, heat islands, and air-quality corridors." },
  { label: "Mobility", description: "Explore transit reach, bike safety, and accessibility gaps." },
] as const;

const vignetteFacts = [
  { metric: "±45%", caption: "Safety swing between the safest and riskiest neighbourhoods" },
  { metric: "12M+", caption: "Daily records ingested from civic, mobility, and open-data feeds" },
  { metric: "8x", caption: "Speed-up teams gain when comparing neighbourhood dashboards" },
] as const;

const heatSignals = [
  { city: "Tokyo", value: "Shinjuku rent spike", position: { x: 68, y: 36 } },
  { city: "Nairobi", value: "Kilimani safety gains", position: { x: 55, y: 58 } },
  { city: "São Paulo", value: "Mooca heat warning", position: { x: 40, y: 65 } },
  { city: "Berlin", value: "Friedrichshain price dip", position: { x: 50, y: 33 } },
  { city: "Sydney", value: "Newtown air quality", position: { x: 82, y: 70 } },
] as const;

const globeBands = [
  { label: "Heat risk", color: "from-[#f97316]/60 to-transparent", delay: 0 },
  { label: "Mobility", color: "from-[#22d3ee]/50 to-transparent", delay: 1500 },
  { label: "Housing", color: "from-[#818cf8]/50 to-transparent", delay: 3000 },
] as const;

// -----------------------------
// Page Component
// -----------------------------
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  // --- 1) Drive scroll-based effects via a CSS variable (no React state re-renders)
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--sy", `${window.scrollY}px`);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // --- 2) Drive pointer-based parallax via CSS variables (no React state)
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        node.style.setProperty("--mx", `${x}`);
        node.style.setProperty("--my", `${y}`);
        raf = 0;
      });
    };
    const onEnter = () => node.classList.add("tilt-active");
    const onLeave = () => {
      node.classList.remove("tilt-active");
      node.style.setProperty("--mx", "0");
      node.style.setProperty("--my", "0");
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointerleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // --- 3) IntersectionObserver that toggles a class (no React state)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("is-inview");
        }
      },
      { threshold: 0.18 }
    );

    document.querySelectorAll<HTMLElement>("[data-section-id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Memo backdrop gradient string to keep it stable (CSS var-driven focus glow)
  const backdropStyle = useMemo<CSSProperties>(
    () => ({
      background: `
      radial-gradient(circle at calc((var(--mx,0) + 0.5) * 100%) calc((var(--my,0) + 0.5) * 100%), rgba(56, 189, 248, 0.3), transparent 45%),
      radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.18), transparent 60%),
      radial-gradient(circle at 85% 25%, rgba(59, 130, 246, 0.22), transparent 60%),
      radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.12), transparent 55%),
      radial-gradient(circle at 15% 85%, rgba(129, 140, 248, 0.16), transparent 55%),
      #010617`,
    }),
    []
  );

  // Parallax transforms now read CSS vars; we do not transition continuously
  const parallaxTransform: CSSProperties = {
    transform: `translate3d(calc(var(--mx,0) * 40px), calc(var(--my,0) * 36px + (var(--sy,0px) * -0.12)), 0)
       rotateX(calc(var(--my,0) * 10deg)) rotateY(calc(var(--mx,0) * -16deg))`,
    // no transitions during per-frame updates (we add a small transition only when .tilt-active)
    willChange: "transform",
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <CustomKeyframes />

      {/* HERO */}
      <section ref={heroRef} className="relative isolate overflow-hidden" style={{ minHeight: "110vh" }}>
        {/* backdrop */}
        <div className="absolute inset-0 -z-20" style={backdropStyle} />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(8,47,73,0.35)_0%,transparent_68%)]" />

        {/* gentle scroll glows driven by --sy */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[55vh] bg-gradient-to-b from-sky-500/20 via-transparent to-transparent blur-xl" style={{ transform: "translate3d(0, calc(var(--sy,0px) * -0.22), 0)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" style={{ transform: "translate3d(0, calc(var(--sy,0px) * 0.18), 0)" }} />

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-32 pb-24 sm:px-10">
          <div className="relative w-full max-w-5xl [transition:transform_120ms_ease-out] tilt-active:[transition:transform_100ms_ease-out]" style={parallaxTransform}>
            <div className="absolute inset-0 transform-gpu">
              <HeatmapGlobe bands={globeBands} signals={heatSignals} />
              <OrbitalRing delay={0} size="large" />
              <OrbitalRing delay={2400} size="medium" />
              <OrbitalRing delay={4800} size="small" />
            </div>
            <div className="relative space-y-10 rounded-[2.75rem] border border-white/10 bg-white/5 p-12 shadow-[0_30px_100px_-40px_rgba(56,189,248,0.40)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.45em] text-cyan-200">Urbanlytics</span>
                <span className="text-[10px] uppercase tracking-[0.35em] text-white/70">Scroll to analyse the city</span>
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Neighbourhood intelligence for every city on Earth.</h1>
                <p className="max-w-3xl text-base text-slate-200 sm:text-lg">Urbanlytics reveals how safety, pricing, and environmental quality shift block by block so you can choose, invest, and plan with confidence.</p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid w-full max-w-4xl gap-6 sm:grid-cols-3 [transition:transform_240ms_ease-out]" style={{ transform: "translate3d(0, calc(var(--sy,0px) * -0.05), 0)" }}>
            {vignetteFacts.map((fact) => (
              <div key={fact.metric} className="rounded-3xl border border-white/5 bg-white/5 p-6">
                <p className="text-3xl font-semibold text-cyan-200">{fact.metric}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-white/60">City signal</p>
                <p className="mt-3 text-sm text-slate-200/90">{fact.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS (reveal-on-scroll via class) */}
      <RevealSection id="search" className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#020617] via-[#031121] to-[#020617] py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.2),transparent_55%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-200">Start exploring</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Search any city and compare its neighbourhoods side by side.</h2>
            <p className="text-base text-slate-200 sm:text-lg">Urbanlytics stitches together property records, police feeds, and environmental monitors so you can instantly benchmark neighbourhoods across safety, price, and livability.</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/base"
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/30 transition duration-200 hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200">
                Start searching
              </a>
              <span className="text-xs uppercase tracking-[0.4em] text-white/60">No download · live datasets</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative mx-auto aspect-square max-w-[420px]">
              <HeatmapGlobe bands={globeBands} signals={heatSignals} variant="emphasis" />
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="compare" className="relative overflow-hidden border-y border-white/5 bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950 py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.16),transparent_65%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-10 lg:flex-row lg:items-center">
          <div className="lg:w-[42%]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-200">Neighbourhood stack</p>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Overlay the forces shaping each neighbourhood in minutes.</h2>
            <p className="mt-4 text-base text-slate-200 sm:text-lg">Urbanlytics renders every district as a responsive heat layer so planners, analysts, and newcomers can see where to live, invest, or intervene next.</p>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            {strataLayers.map((item, index) => (
              <div key={item.label} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/10">
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-white/50">
                  <span>{item.label}</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection id="crime" className="relative isolate overflow-hidden py-28">
        <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_120deg_at_50%_50%,rgba(14,116,144,0.06),rgba(56,189,248,0.22),rgba(14,116,144,0.06))]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Crime lenses spotlight risk street by street.</h2>
            <p className="text-base text-slate-200 sm:text-lg">Track incident density, trending offences, and police response times to understand where intervention or community programs make the biggest impact.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Live heat maps of reported incidents", "Safe-route scoring for commuters", "Predictive hotspots based on history", "Shareable briefings for stakeholders"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-100 transition hover:border-cyan-200/40 hover:bg-white/10">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="relative h-[420px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#f97316]/10 via-[#020817] to-[#020817] shadow-[0_30px_100px_-50px_rgba(249,115,22,0.55)]">
              <AuroraSwirl variant="crime" />
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="pricing" className="relative isolate overflow-hidden border-t border-white/5 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950 py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(129,140,248,0.18),transparent_60%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pricing layers expose affordability in real time.</h2>
            <p className="text-base text-slate-200 sm:text-lg">Compare rent and sale trends, gentrification pressure, and tax burdens to see where budgets stretch or shrink throughout a city.</p>
            <div className="space-y-3 text-sm text-slate-200/80">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-violet-300" /> Mix MLS, rental, and short-term stay feeds in one panel.
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-300" /> Project affordability under different income scenarios.
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-lime-300" /> Export comparisons for investor or policy briefings.
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative h-[420px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/40 shadow-[0_30px_100px_-50px_rgba(129,140,248,0.55)]">
              <AuroraSwirl variant="pricing" />
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="pollution" className="relative isolate overflow-hidden border-t border-white/5 bg-gradient-to-br from-[#031221] via-[#041a2f] to-[#01070e] py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_40%,rgba(45,212,191,0.16),transparent_60%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pollution monitors decode air and climate stress.</h2>
            <p className="text-base text-slate-200 sm:text-lg">Blend particulate sensors, emissions inventories, and green canopy coverage to pinpoint which neighbourhoods breathe easier.</p>
            <div className="space-y-3 text-sm text-slate-200/80">
              {["Track AQI, NO₂, and PM₂.₅ in near real time", "Overlay flood, heat, and wildfire risk layers", "Surface mitigation opportunities street by street"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="relative h-[420px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/40 shadow-[0_30px_100px_-50px_rgba(45,212,191,0.55)]">
              <AuroraSwirl variant="pollution" />
            </div>
          </div>
        </div>
      </RevealSection>
    </main>
  );
}

// -----------------------------
// RevealSection: uses class toggled by IntersectionObserver
// -----------------------------
function RevealSection({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section
      id={id}
      data-section-id={id}
      className={`reveal ${className ?? ""}`}
      // start hidden; .is-inview will override via CSS (see CustomKeyframes <style>)
      style={{ transform: "translate3d(0,48px,0)", opacity: 0 }}>
      {children}
    </section>
  );
}

// -----------------------------
// Visual components (memoized)
// -----------------------------
const OrbitalRing = memo(function OrbitalRing({ delay, size }: { delay: number; size: "large" | "medium" | "small" }) {
  const sizeClasses: Record<typeof size, string> = {
    large: "h-[520px] w-[520px]",
    medium: "h-[420px] w-[420px]",
    small: "h-[320px] w-[320px]",
  } as const;

  return (
    <div
      className="absolute left-1/2 top-1/2 rounded-full border border-cyan-400/20"
      style={{
        animation: "spinOrbit 18s linear infinite",
        animationDelay: `${delay}ms`,
        transform: "translate(-50%, -50%)",
      }}>
      <div className={`${sizeClasses[size]} rounded-full`} style={{ background: "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.28), rgba(8,47,73,0.12) 55%, transparent 72%)" }} />
    </div>
  );
});

const HeatmapGlobe = memo(function HeatmapGlobe({ bands, signals, variant = "hero" }: { bands: typeof globeBands; signals: typeof heatSignals; variant?: "hero" | "emphasis" }) {
  const sizeClass = variant === "hero" ? "h-[420px] w-[420px]" : "h-[380px] w-[380px]";
  const blur = variant === "hero" ? "blur-2xl" : "blur-xl"; // toned down blur

  return (
    <div className={`relative left-1/2 top-1/2 ${sizeClass}`} style={{ transform: "translate(-50%, -50%)" }}>
      <div className={`absolute inset-0 rounded-full bg-cyan-500/10 ${blur}`} />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.45),rgba(8,47,73,0.6)_58%,rgba(2,6,23,0.9)_85%)]" />
      <div className="absolute inset-[8%] rounded-full border border-cyan-200/20" style={{ animation: "globeSpin 36s linear infinite" }} />

      {bands.map((band) => (
        <div
          key={band.label}
          className="absolute inset-[12%] rounded-full border border-transparent"
          style={{
            animation: `bandSweep 18s linear infinite`,
            animationDelay: `${band.delay}ms`,
            maskImage: "radial-gradient(circle at 50% 50%, transparent 45%, black 60%, transparent 75%)",
          }}>
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${band.color} opacity-70`} style={{ filter: "blur(12px)" }} />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-semibold uppercase tracking-[0.4em] text-white/50">{band.label}</span>
        </div>
      ))}

      {signals.map((signal, index) => (
        <div
          key={signal.city}
          style={{
            left: `${signal.position.x}%`,
            top: `${signal.position.y}%`,
            animation: `heatPulse 3.6s ease-in-out ${index * 250}ms infinite`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2">
          <span className="relative block h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.7)]">
            <span className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/20" />
          </span>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/10 px-3 py-1 text-[10px]">
            <span className="font-semibold text-white">{signal.city}</span>
            <span className="ml-2 text-white/70">{signal.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

const AuroraSwirl = memo(function AuroraSwirl({ variant = "default" }: { variant?: "default" | "crime" | "pricing" | "pollution" }) {
  const palette = {
    default: {
      radial: "bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.6),transparent_55%)]",
      conicA: "bg-[conic-gradient(from_180deg_at_50%_50%,rgba(125,211,252,0.6),rgba(14,165,233,0.12),rgba(59,130,246,0.45),rgba(56,189,248,0.6))]",
      conicB: "bg-[conic-gradient(from_90deg_at_20%_40%,rgba(56,189,248,0.4),transparent,rgba(20,184,166,0.35),transparent,rgba(59,130,246,0.4))]",
      title: "Forecast how safety, affordability, and climate risk shift across priority corridors this quarter.",
    },
    crime: {
      radial: "bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.5),transparent_55%)]",
      conicA: "bg-[conic-gradient(from_180deg_at_50%_50%,rgba(249,115,22,0.5),rgba(250,204,21,0.1),rgba(248,113,113,0.5),rgba(249,115,22,0.5))]",
      conicB: "bg-[conic-gradient(from_90deg_at_20%_40%,rgba(248,113,113,0.45),transparent,rgba(250,204,21,0.35),transparent,rgba(249,115,22,0.45))]",
      title: "Review weekly offence trends and priority response corridors at a glance.",
    },
    pricing: {
      radial: "bg-[radial-gradient(circle_at_30%_20%,rgba(129,140,248,0.5),transparent_55%)]",
      conicA: "bg-[conic-gradient(from_180deg_at_50%_50%,rgba(129,140,248,0.5),rgba(59,130,246,0.12),rgba(167,139,250,0.5),rgba(129,140,248,0.5))]",
      conicB: "bg-[conic-gradient(from_90deg_at_20%_40%,rgba(167,139,250,0.45),transparent,rgba(56,189,248,0.35),transparent,rgba(129,140,248,0.45))]",
      title: "Visualize asking prices, rent, and affordability corridors without switching tools.",
    },
    pollution: {
      radial: "bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.5),transparent_55%)]",
      conicA: "bg-[conic-gradient(from_180deg_at_50%_50%,rgba(16,185,129,0.48),rgba(45,212,191,0.12),rgba(56,189,248,0.35),rgba(16,185,129,0.48))]",
      conicB: "bg-[conic-gradient(from_90deg_at_20%_40%,rgba(45,212,191,0.45),transparent,rgba(34,197,94,0.35),transparent,rgba(16,185,129,0.45))]",
      title: "Track AQI swings, canopy coverage, and flood alerts for every block.",
    },
  } as const;

  const { radial, conicA, conicB, title } = palette[variant];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2.2rem]">
      <div className={`absolute inset-0 ${radial} blur-xl opacity-60`} />
      <div className={`absolute inset-0 animate-[aurora_14s_ease-in-out_infinite] ${conicA} opacity-80 mix-blend-screen`} />
      <div className={`absolute inset-0 animate-[auroraReverse_16s_ease-in-out_infinite] ${conicB} opacity-70`} />
      <div className="absolute inset-x-10 bottom-10 rounded-3xl border border-white/15 bg-black/40 p-6 text-sm text-slate-200/80">
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-100/80">Insight preview</p>
        <p className="mt-2 text-base text-white">{title}</p>
      </div>
    </div>
  );
});

// -----------------------------
// Global keyframes + reveal CSS
// -----------------------------
function CustomKeyframes() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          :root { --sy: 0px; }
          /* pointer vars default */
          [data-section-id] { --mx: 0; --my: 0; }

          @keyframes spinOrbit {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            50% { transform: translate(-50%, -50%) rotate(180deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes globeSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes bandSweep {
            0% { transform: rotate(0deg) scale(1); opacity: 0.5; }
            50% { transform: rotate(180deg) scale(1.02); opacity: 0.9; }
            100% { transform: rotate(360deg) scale(1); opacity: 0.5; }
          }
          @keyframes heatPulse { 0%,100%{ transform: scale(0.95); opacity: 0.75; } 50%{ transform: scale(1.18); opacity: 1; } }
          @keyframes aurora { 0%{ transform: rotate(0deg) scale(1); opacity: 0.85; } 50%{ transform: rotate(35deg) scale(1.05); opacity: 0.65; } 100%{ transform: rotate(0deg) scale(1); opacity: 0.85; } }
          @keyframes auroraReverse { 0%{ transform: rotate(0deg) scale(1.02); opacity: 0.75; } 50%{ transform: rotate(-25deg) scale(1.06); opacity: 0.55; } 100%{ transform: rotate(0deg) scale(1.02); opacity: 0.75; } }

          /* Reveal sections: start hidden, animate once when .is-inview is set */
          .reveal { transition: transform 700ms cubic-bezier(0.2, 0.8, 0.25, 1), opacity 600ms ease; will-change: transform, opacity; }
          .reveal.is-inview { transform: translate3d(0,0,0) !important; opacity: 1 !important; }

          /* Tilt easing only when hovering hero */
          .tilt-active { transition: transform 100ms ease-out; }
        `,
      }}
    />
  );
}
