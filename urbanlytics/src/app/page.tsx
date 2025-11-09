"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

// ------- Olive + Beige palette -------
const PALETTE = {
  beigeBg: "#F6F0E9",
  beigePanel: "#FBF7EF",
  beigeBorder: "#E6DCCD",
  ink: "#2B271F",
  subInk: "#3A342A",
  inkSoft: "#5A5246",
  olive: "#6B8F71",
  oliveDark: "#3E5F43",
  oliveLight: "#A3B18A",
  oliveTint: "#DDE6D7",
} as const;

const capabilitySections = [
  {
    id: "crime",
    title: "Crime analytics for safer streets",
    description: "Visualize incidents, response times, and predictive hotspots so teams can intervene where it matters.",
    bullets: ["Live incident heat maps", "Safe-route guidance", "Predictive policing insights"],
  },
  {
    id: "pricing",
    title: "Affordability signals without spreadsheets",
    description: "Blend MLS, rental, and taxation feeds to compare neighbourhood affordability under different scenarios.",
    bullets: ["Adaptive rent & sale dashboards", "Income-based affordability scoring", "Shareable investor briefs"],
  },
  {
    id: "pollution",
    title: "Environmental intelligence block by block",
    description: "Overlay air quality, flood plains, and canopy coverage to plan resilient neighbourhoods.",
    bullets: ["AQI & emission monitoring", "Flood and heat risk overlays", "Mitigation opportunity finder"],
  },
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
      frame = requestAnimationFrame(() => setScrollY(window.scrollY || window.pageYOffset || 0));
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
          if (entry.isIntersecting) setRevealedSections((prev) => ({ ...prev, [id]: true }));
        });
      },
      { threshold: 0.2 }
    );
    const sections = document.querySelectorAll<HTMLElement>("[data-section-id]");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const clampedScroll = Math.min(scrollY, 1200);

  // Beige base + olive tints in hero glow
  const heroBackground = useMemo<CSSProperties>(() => {
    const x = mousePosition.x * 100;
    const y = mousePosition.y * 100;
    return {
      background: `
        radial-gradient(circle at ${x}% ${y}%, rgba(221,230,215,0.55), transparent 55%),
        radial-gradient(circle at 20% 30%, rgba(251,247,239,0.65), transparent 70%),
        radial-gradient(circle at 80% 25%, rgba(163,177,138,0.35), transparent 65%),
        ${PALETTE.beigeBg}
      `,
      transition: tiltActive ? "background 0.12s ease-out" : "background 0.8s ease",
    };
  }, [mousePosition, tiltActive]);

  const heroTransform = useMemo<CSSProperties>(() => {
    const rotateX = (mousePosition.y - 0.5) * 8 * (tiltActive ? 1 : 0);
    const rotateY = (mousePosition.x - 0.5) * -10 * (tiltActive ? 1 : 0);
    const translateX = (mousePosition.x - 0.5) * 24;
    const translateY = (mousePosition.y - 0.5) * 20 + clampedScroll * -0.08;
    return {
      transform: `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: tiltActive ? "transform 0.2s ease-out" : "transform 0.8s ease",
      willChange: "transform",
    };
  }, [mousePosition, tiltActive, clampedScroll]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: PALETTE.beigeBg, color: PALETTE.ink }}>
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0" style={heroBackground} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/80 to-transparent" />

        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-20 sm:px-10">
          <div
            className="relative w-full max-w-4xl space-y-10 overflow-hidden rounded-[3.5rem] px-16 py-28 text-center backdrop-blur"
            style={{
              ...heroTransform,
              background: `linear-gradient(180deg, rgba(255,255,255,0.88), rgba(251,247,239,0.88))`,
              border: `1px solid ${PALETTE.beigeBorder}`,
              boxShadow: `0 80px 220px -80px rgba(62,95,67,0.40)`, // olive shadow
            }}>
            <div className="pointer-events-none absolute inset-0 rounded-[3.5rem]" style={{ border: "1px solid rgba(255,255,255,0.5)" }} />
            <div className="relative space-y-8">
              <span
                className="inline-flex items-center justify-center rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.6em]"
                style={{
                  color: PALETTE.oliveDark,
                  border: `1px solid ${PALETTE.beigeBorder}`,
                  background: `linear-gradient(180deg, ${PALETTE.beigePanel}, #FFFFFF)`,
                }}>
                Neighbourhood Analytics Platform
              </span>
              <h1 className="text-[clamp(4rem,9vw,8.5rem)] font-serif leading-none" style={{ color: PALETTE.ink }}>
                Urbanlytics
              </h1>
              <p className="mx-auto max-w-3xl text-lg sm:text-xl" style={{ color: PALETTE.inkSoft }}>
                Discover how Urbanlytics layers crime, affordability, and environmental signals for any city. Scroll to see the capabilities before you launch the explorer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ScrollRevealSection id="overview" revealed={revealedSections.overview} scrollY={scrollY} parallaxStrength={0.06} className="py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-6 text-center">
          <h2 className="text-3xl font-semibold" style={{ color: PALETTE.ink }}>
            What you can do with Urbanlytics
          </h2>
          <p className="text-base sm:text-lg" style={{ color: `${PALETTE.inkSoft}CC` }}>
            Load any city to compare neighbourhoods, trace historical shifts, and share interactive stories with your team. Urbanlytics adapts to the context you bring.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {["Search by city and dive into its neighbourhoods", "Toggle safety, affordability, and climate layers", "Save views and brief collaborators instantly"].map((item) => (
              <div
                key={item}
                className="rounded-3xl p-5 text-sm shadow-sm"
                style={{
                  background: `linear-gradient(180deg, #FFFFFF, ${PALETTE.beigePanel})`,
                  border: `1px solid ${PALETTE.beigeBorder}`,
                  color: PALETTE.subInk,
                }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {capabilitySections.map((section, index) => (
        <ScrollRevealSection key={section.id} id={section.id} revealed={revealedSections[section.id]} scrollY={scrollY} parallaxStrength={0.08 + index * 0.02} className="py-24">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl font-semibold sm:text-4xl" style={{ color: PALETTE.ink }}>
                {section.title}
              </h3>
              <p className="text-base sm:text-lg" style={{ color: `${PALETTE.inkSoft}CC` }}>
                {section.description}
              </p>
              <ul className="space-y-3 text-sm" style={{ color: PALETTE.subInk }}>
                {section.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: PALETTE.oliveLight }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <div
                className="rounded-[2.5rem] p-10 text-sm shadow-[0_45px_120px_-60px_rgba(62,95,67,0.28)]"
                style={{
                  background: `linear-gradient(180deg, #FFFFFF, ${PALETTE.beigePanel})`,
                  border: `1px solid ${PALETTE.beigeBorder}`,
                  color: PALETTE.subInk,
                }}>
                <p className="text-xs uppercase tracking-[0.35em]" style={{ color: PALETTE.oliveDark }}>
                  Insight preview
                </p>
                <p className="mt-4">Create shareable snapshots, export side-by-side comparisons, and automate alerts for the neighbourhoods you monitor most.</p>
              </div>
            </div>
          </div>
        </ScrollRevealSection>
      ))}

      <ScrollRevealSection id="cta" revealed={revealedSections.cta} scrollY={scrollY} parallaxStrength={0.16} className="py-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center">
          <h3 className="text-3xl font-semibold sm:text-4xl" style={{ color: PALETTE.ink }}>
            Ready to explore a city?
          </h3>
          <p className="max-w-2xl text-base sm:text-lg" style={{ color: `${PALETTE.inkSoft}CC` }}>
            Jump into the Urbanlytics explorer to search any city, layer neighbourhood insights, and build the dashboards your team needs.
          </p>
          <a
            href="/base"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition duration-200"
            style={{
              backgroundColor: PALETTE.oliveDark,
              color: PALETTE.beigeBg,
              boxShadow: "0 25px 80px -50px rgba(62,95,67,0.65)",
            }}
            onMouseEnter={(e) => ((e.currentTarget.style.backgroundColor = PALETTE.olive), (e.currentTarget.style.boxShadow = "0 25px 80px -50px rgba(107,143,113,0.6)"))}
            onMouseLeave={(e) => ((e.currentTarget.style.backgroundColor = PALETTE.oliveDark), (e.currentTarget.style.boxShadow = "0 25px 80px -50px rgba(62,95,67,0.65)"))}>
            Enter the explorer
          </a>
        </div>
      </ScrollRevealSection>
    </main>
  );
}

function ScrollRevealSection({ id, revealed, className, children, scrollY, parallaxStrength }: { id: string; revealed?: boolean; className?: string; children: ReactNode; scrollY: number; parallaxStrength?: number }) {
  const parallaxOffset = -(scrollY * (parallaxStrength ?? 0));
  const style: CSSProperties = {
    transform: `translate3d(0, ${parallaxOffset + (revealed ? 0 : 48)}px, 0)`,
    opacity: revealed ? 1 : 0,
    transition: "transform 1s cubic-bezier(0.2, 0.8, 0.25, 1), opacity 0.8s ease",
    willChange: "transform, opacity",
    background: id === "overview" ? `linear-gradient(180deg, ${PALETTE.beigePanel}, #FFFFFF)` : id === "cta" ? "#FFFFFF" : indexBg(id),
    borderTop: id === "overview" || id === "cta" ? `1px solid ${PALETTE.beigeBorder}` : undefined,
  };

  return (
    <section id={id} data-section-id={id} className={className ?? ""} style={style}>
      {children}
    </section>
  );
}

// alternating soft backgrounds for capability blocks
function indexBg(id: string) {
  return id === "crime" || id === "pollution" ? `linear-gradient(180deg, #FFFFFF, ${PALETTE.beigePanel})` : PALETTE.oliveTint + "1A"; // very light olive tint
}
