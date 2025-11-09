"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const strataLayers = [
  { label: "Safety", description: "Live crime scoring for every block, refreshed nightly." },
  { label: "Affordability", description: "Monitor rent shifts, home prices, and tax deltas in context." },
  { label: "Climate", description: "Overlay flood plains, heat islands, and air-quality corridors." },
  { label: "Mobility", description: "Explore transit reach, bike safety, and accessibility gaps." },
];

const vignetteFacts = [
  { metric: "±45%", caption: "Safety swing between the safest and riskiest neighbourhoods" },
  { metric: "12M+", caption: "Daily records ingested from civic, mobility, and open-data feeds" },
  { metric: "8x", caption: "Speed-up teams gain when comparing neighbourhood dashboards" },
];

const heatSignals = [
  { city: "Tokyo", value: "Shinjuku rent spike", position: { x: 68, y: 36 } },
  { city: "Nairobi", value: "Kilimani safety gains", position: { x: 55, y: 58 } },
  { city: "São Paulo", value: "Mooca heat warning", position: { x: 40, y: 65 } },
  { city: "Berlin", value: "Friedrichshain price dip", position: { x: 50, y: 33 } },
  { city: "Sydney", value: "Newtown air quality", position: { x: 82, y: 70 } },
];

const globeBands = [
  { label: "Heat risk", color: "from-[#f97316]/60 to-transparent", delay: 0 },
  { label: "Mobility", color: "from-[#22d3ee]/50 to-transparent", delay: 1500 },
  { label: "Housing", color: "from-[#818cf8]/50 to-transparent", delay: 3000 },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [tiltActive, setTiltActive] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrollY(window.scrollY || window.pageYOffset || 0);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };

    const handlePointerEnter = () => setTiltActive(true);
    const handlePointerLeave = () => {
      setTiltActive(false);
      setMousePosition({ x: 0.5, y: 0.5 });
    };

    const node = heroRef.current;
    if (node) {
      node.addEventListener("pointermove", handlePointerMove);
      node.addEventListener("pointerenter", handlePointerEnter);
      node.addEventListener("pointerleave", handlePointerLeave);
    }

    return () => {
      if (node) {
        node.removeEventListener("pointermove", handlePointerMove);
        node.removeEventListener("pointerenter", handlePointerEnter);
        node.removeEventListener("pointerleave", handlePointerLeave);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-section-id");
          if (!id) return;
          if (entry.isIntersecting) {
            setRevealedSections((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.18 },
    );

    const sections = document.querySelectorAll<HTMLElement>("[data-section-id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const clampedScroll = Math.min(scrollY, 1400);

  const backdropStyle = useMemo<CSSProperties>(() => {
    const x = mousePosition.x * 100;
    const y = mousePosition.y * 100;
    return {
      background: `
        radial-gradient(circle at ${x}% ${y}%, rgba(56, 189, 248, 0.35), transparent 45%),
        radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.2), transparent 60%),
        radial-gradient(circle at 85% 25%, rgba(59, 130, 246, 0.25), transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.15), transparent 55%),
        radial-gradient(circle at 15% 85%, rgba(129, 140, 248, 0.18), transparent 55%),
        #010617
      `,
      transition: tiltActive ? "background 0.12s ease-out" : "background 0.6s ease-out",
    };
  }, [mousePosition, tiltActive]);

  const heroGlowStyleTop = useMemo<CSSProperties>(() => {
    return {
      transform: `translate3d(0, ${clampedScroll * -0.22}px, 0)`,
      transition: "transform 0.6s ease-out",
    };
  }, [clampedScroll]);

  const heroGlowStyleBottom = useMemo<CSSProperties>(() => {
    return {
      transform: `translate3d(0, ${clampedScroll * 0.18}px, 0)`,
      transition: "transform 0.6s ease-out",
    };
  }, [clampedScroll]);

  const parallaxTransform = useMemo<CSSProperties>(() => {
    const rotateX = (mousePosition.y - 0.5) * 10 * (tiltActive ? 1 : 0);
    const rotateY = (mousePosition.x - 0.5) * -16 * (tiltActive ? 1 : 0);
    const translateX = (mousePosition.x - 0.5) * 40;
    const translateY = (mousePosition.y - 0.5) * 36 + clampedScroll * -0.12;
    return {
      transform: `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: tiltActive ? "transform 0.1s ease-out" : "transform 0.6s ease-out",
      willChange: "transform",
    };
  }, [mousePosition, tiltActive, clampedScroll]);

  return (
    <main className="h-dvh w-dvw overflow-hidden">
      <TopBar />
      <div className="flex h-[calc(100vh-56px)]">
        <LeftPanel />
        <div className="flex-1">
          <RiskMap />
        </div>
      </div>
    </main>
  );
}

function ScrollRevealSection({
  id,
  revealed,
  className,
  children,
  scrollY,
  parallaxStrength,
}: {
  id: string;
  revealed?: boolean;
  className?: string;
  children: ReactNode;
  scrollY: number;
  parallaxStrength?: number;
}) {
  const parallaxOffset = -(scrollY * (parallaxStrength ?? 0));
  const style: CSSProperties = {
    transform: `translate3d(0, ${parallaxOffset + (revealed ? 0 : 48)}px, 0)`,
    opacity: revealed ? 1 : 0,
    transition: "transform 1s cubic-bezier(0.2, 0.8, 0.25, 1), opacity 0.8s ease",
    willChange: "transform, opacity",
  };

  return (
    <section
      id={id}
      data-section-id={id}
      className={className ?? ""}
      style={style}
    >
      {children}
    </section>
  );
}

function OrbitalRing({ delay, size }: { delay: number; size: "large" | "medium" | "small" }) {
  const sizeClasses: Record<typeof size, string> = {
    large: "h-[520px] w-[520px]",
    medium: "h-[420px] w-[420px]",
    small: "h-[320px] w-[320px]",
  };

  return (
    <div
      className="absolute left-1/2 top-1/2 rounded-full border border-cyan-400/20"
      style={{
        animation: "spinOrbit 18s linear infinite",
        animationDelay: `${delay}ms`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className={`${sizeClasses[size]} rounded-full`}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.28), rgba(8,47,73,0.12) 55%, transparent 72%)",
        }}
      />
    </div>
  );
}

function HeatmapGlobe({
  bands,
  signals,
  variant = "hero",
}: {
  bands: typeof globeBands;
  signals: typeof heatSignals;
  variant?: "hero" | "emphasis";
}) {
  const sizeClass = variant === "hero" ? "h-[420px] w-[420px]" : "h-[380px] w-[380px]";
  const blur = variant === "hero" ? "blur-3xl" : "blur-2xl";

  return (
    <div className={`relative left-1/2 top-1/2 ${sizeClass}`} style={{ transform: "translate(-50%, -50%)" }}>
      <div className={`absolute inset-0 rounded-full bg-cyan-500/10 ${blur}`} />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.45),rgba(8,47,73,0.6)_58%,rgba(2,6,23,0.9)_85%)]" />
      <div className="absolute inset-[8%] rounded-full border border-cyan-200/20" style={{ animation: "globeSpin 36s linear infinite" }} />

      {bands.map((band, index) => (
        <div
          key={band.label}
          className="absolute inset-[12%] rounded-full border border-transparent"
          style={{
            animation: `bandSweep 18s linear infinite`,
            animationDelay: `${band.delay}ms`,
            maskImage: "radial-gradient(circle at 50% 50%, transparent 45%, black 60%, transparent 75%)",
          }}
        >
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr ${band.color} opacity-70`}
            style={{ filter: "blur(12px)" }}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-semibold uppercase tracking-[0.4em] text-white/50">
            {band.label}
          </span>
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
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <span className="relative block h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.7)]">
            <span className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/20" />
          </span>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/10 px-3 py-1 text-[10px] backdrop-blur">
            <span className="font-semibold text-white">{signal.city}</span>
            <span className="ml-2 text-white/70">{signal.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AuroraSwirl({ variant = "default" }: { variant?: "default" | "crime" | "pricing" | "pollution" }) {
  const palette = {
    default: {
      radial: "bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.6),transparent_55%)]",
      conicA:
        "bg-[conic-gradient(from_180deg_at_50%_50%,rgba(125,211,252,0.6),rgba(14,165,233,0.12),rgba(59,130,246,0.45),rgba(56,189,248,0.6))]",
      conicB:
        "bg-[conic-gradient(from_90deg_at_20%_40%,rgba(56,189,248,0.4),transparent,rgba(20,184,166,0.35),transparent,rgba(59,130,246,0.4))]",
      accent: "text-cyan-100/80",
      title: "Forecast how safety, affordability, and climate risk shift across priority corridors this quarter.",
    },
    crime: {
      radial: "bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.55),transparent_55%)]",
      conicA:
        "bg-[conic-gradient(from_180deg_at_50%_50%,rgba(249,115,22,0.55),rgba(250,204,21,0.1),rgba(248,113,113,0.5),rgba(249,115,22,0.55))]",
      conicB:
        "bg-[conic-gradient(from_90deg_at_20%_40%,rgba(248,113,113,0.45),transparent,rgba(250,204,21,0.35),transparent,rgba(249,115,22,0.45))]",
      accent: "text-orange-100/80",
      title: "Review weekly offence trends and priority response corridors at a glance.",
    },
    pricing: {
      radial: "bg-[radial-gradient(circle_at_30%_20%,rgba(129,140,248,0.55),transparent_55%)]",
      conicA:
        "bg-[conic-gradient(from_180deg_at_50%_50%,rgba(129,140,248,0.55),rgba(59,130,246,0.12),rgba(167,139,250,0.5),rgba(129,140,248,0.55))]",
      conicB:
        "bg-[conic-gradient(from_90deg_at_20%_40%,rgba(167,139,250,0.45),transparent,rgba(56,189,248,0.35),transparent,rgba(129,140,248,0.45))]",
      accent: "text-indigo-100/80",
      title: "Visualize asking prices, rent, and affordability corridors without switching tools.",
    },
    pollution: {
      radial: "bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.55),transparent_55%)]",
      conicA:
        "bg-[conic-gradient(from_180deg_at_50%_50%,rgba(16,185,129,0.5),rgba(45,212,191,0.12),rgba(56,189,248,0.35),rgba(16,185,129,0.5))]",
      conicB:
        "bg-[conic-gradient(from_90deg_at_20%_40%,rgba(45,212,191,0.45),transparent,rgba(34,197,94,0.35),transparent,rgba(16,185,129,0.45))]",
      accent: "text-emerald-100/80",
      title: "Track AQI swings, canopy coverage, and flood alerts for every block.",
    },
  } as const;

  const { radial, conicA, conicB, accent, title } = palette[variant];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2.2rem]">
      <div className={`absolute inset-0 ${radial} blur-3xl opacity-60`} />
      <div className={`absolute inset-0 animate-[aurora_14s_ease-in-out_infinite] ${conicA} opacity-80 mix-blend-screen`} />
      <div className={`absolute inset-0 animate-[auroraReverse_16s_ease-in-out_infinite] ${conicB} opacity-70`} />
      <div className="absolute inset-x-10 bottom-10 rounded-3xl border border-white/15 bg-black/50 p-6 text-sm text-slate-200/80 backdrop-blur">
        <p className={`text-[10px] uppercase tracking-[0.35em] ${accent}`}>Insight preview</p>
        <p className="mt-2 text-base text-white">{title}</p>
      </div>
    </div>
  );
}

function CustomKeyframes() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes spinOrbit {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            50% { transform: translate(-50%, -50%) rotate(180deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes globeSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes bandSweep {
            0% { transform: rotate(0deg) scale(1); opacity: 0.5; }
            50% { transform: rotate(180deg) scale(1.02); opacity: 0.9; }
            100% { transform: rotate(360deg) scale(1); opacity: 0.5; }
          }
          @keyframes heatPulse {
            0%, 100% { transform: scale(0.95); opacity: 0.75; }
            50% { transform: scale(1.18); opacity: 1; }
          }
          @keyframes aurora {
            0% { transform: rotate(0deg) scale(1); opacity: 0.85; }
            50% { transform: rotate(35deg) scale(1.05); opacity: 0.65; }
            100% { transform: rotate(0deg) scale(1); opacity: 0.85; }
          }
          @keyframes auroraReverse {
            0% { transform: rotate(0deg) scale(1.02); opacity: 0.75; }
            50% { transform: rotate(-25deg) scale(1.06); opacity: 0.55; }
            100% { transform: rotate(0deg) scale(1.02); opacity: 0.75; }
          }
        `,
      }}
    />
  );
}

