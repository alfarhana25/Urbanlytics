"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

const livabilityCards = [
  {
    icon: "🛡️",
    title: "Safety & Security",
    description: "Identify low-risk zones and monitor community safety trends.",
  },
  {
    icon: "🏘️",
    title: "Affordability & Housing",
    description: "Compare cost of living, property value, and housing stability.",
  },
  {
    icon: "🌿",
    title: "Environment & Access",
    description: "Track air quality, green space, and walkability in real time.",
  },
];

const trustPillars = [
  {
    icon: "📊",
    title: "Open data sources",
    note: "World Bank, OpenStreetMap, civic datasets",
  },
  {
    icon: "⚙️",
    title: "Real-time updates",
    note: "Automatic refresh when new public data arrives",
  },
  {
    icon: "💡",
    title: "AI-driven summaries",
    note: "Readable insights instead of raw numbers",
  },
];

const mapFeatures = [
  {
    icon: "🗺️",
    title: "Explore the Map",
    description: "View citywide livability patterns with intuitive colour-coded zones.",
  },
  {
    icon: "🔥",
    title: "Toggle Data Layers",
    description: "Instantly reveal insights for crime, cost of living, or air quality.",
  },
  {
    icon: "📈",
    title: "Get Local Analytics",
    description: "Each area opens a panel with detailed metrics, comparisons, and trends.",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const currentScroll = window.scrollY || window.pageYOffset || 0;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const ratio = docHeight > 0 ? Math.min(currentScroll / docHeight, 1) : 0;
        setScrollY(currentScroll);
        setProgress(ratio);
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
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll<HTMLElement>("[data-section-id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const clampedScroll = Math.min(scrollY, 1200);

  const heroBackground = useMemo<CSSProperties>(() => {
    const x = 50 + Math.sin(clampedScroll / 400) * 15;
    const y = 40 + Math.cos(clampedScroll / 450) * 12;
    return {
      background: `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.55), transparent 55%),
        radial-gradient(circle at 25% 35%, rgba(226, 210, 188, 0.35), transparent 70%),
        radial-gradient(circle at 78% 28%, rgba(210, 191, 161, 0.28), transparent 65%),
        #f6f0e9`,
    };
  }, [clampedScroll]);

  return (
    <main className="min-h-screen bg-[#f6f0e9] text-[#2e261b]">
      <section
        ref={heroRef}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0" style={heroBackground} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/80 to-transparent" />

        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-20 sm:px-10">
          <div className="relative w-full max-w-4xl space-y-12 overflow-hidden rounded-[3.5rem] border border-[#dacbb4] bg-white/80 px-16 py-32 text-center shadow-[0_80px_220px_-80px_rgba(122,101,69,0.55)] backdrop-blur">
            <div className="pointer-events-none absolute inset-0 rounded-[3.5rem] border border-white/40" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#e5d6c2] to-transparent" />
            <div className="relative space-y-8">
              <span className="inline-flex items-center justify-center rounded-full border border-[#ddccb6] px-6 py-2 text-xs font-semibold uppercase tracking-[0.6em] text-[#8d7253]">
                Neighbourhood Analytics Platform
              </span>
              <h1 className="text-[clamp(4.5rem,10vw,9rem)] font-serif leading-none text-[#1f1b16]">
                Urbanlytics
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-[#4d4134] sm:text-xl">
                See your city come alive through data.
                <br className="hidden sm:block" /> Urbanlytics visualizes how neighbourhoods compare across safety, housing, environment, and access — all in one interactive map.
              </p>
              <div className="text-xs uppercase tracking-[0.45em] text-[#9d8463]">↓ Learn more</div>
            </div>
          </div>
        </div>
      </section>

      <ScrollRevealSection
        id="what-we-do"
        revealed={revealedSections["what-we-do"]}
        scrollY={scrollY}
        parallaxStrength={0.08}
        className="relative border-t border-[#e5d6c2] bg-[#fdf8f1]"
      >
        <div className="flex min-h-[90vh] flex-col gap-16 px-[min(12vw,7rem)] py-24">
          <ReadingShowcase
            active={Boolean(revealedSections["what-we-do"])}
            lines={["One interactive map", "that brings every", "layer of your city", "together"]}
            subtext="Explore every neighbourhood through real-time urban data. Toggle between layers like crime, affordability, pollution, and transit — and watch the city change before your eyes."
          />
          <div className="relative -mx-[min(12vw,7rem)]">
            <div
              className="flex gap-6 overflow-x-auto px-[min(12vw,7rem)] py-4 scrollbar-hide"
              onWheel={(event) => {
                const container = event.currentTarget;
                container.scrollLeft += event.deltaY * 2;
              }}
            >
              {mapFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative min-w-[62vw] max-w-[62vw] rounded-[3rem] border border-[#e5d6c2] bg-white/85 p-14 shadow-[0_25px_80px_-60px_rgba(120,97,60,0.25)] transition duration-300 hover:-translate-y-1 hover:border-[#c9b192] hover:shadow-[0_35px_100px_-60px_rgba(120,97,60,0.35)] sm:min-w-[48vw] sm:max-w-[48vw] lg:min-w-[36vw] lg:max-w-[36vw]"
                >
                  <FeatureBackground type={feature.title} />
                  <div className="relative flex min-h-[22rem] flex-col justify-between">
                    <div>
                      <div className="text-4xl">{feature.icon}</div>
                      <h3 className="mt-8 text-3xl font-semibold text-[#2e261b]">{feature.title}</h3>
                      <p className="mt-4 text-lg text-[#4d4134]/85">{feature.description}</p>
                    </div>
                    <div className="mt-10 h-px w-full origin-left scale-x-0 bg-[#c9b192] transition duration-300 group-hover:scale-x-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection
        id="livability"
        revealed={revealedSections.livability}
        scrollY={scrollY}
        parallaxStrength={0.08}
        className="bg-white py-28"
      >
        <div className="flex min-h-[90vh] flex-col gap-16 px-[min(12vw,7rem)]">
          <ReadingShowcase
            active={Boolean(revealedSections.livability)}
            lines={["Discover", "what defines", "your community."]}
            subtext="Urbanlytics breaks down livability into measurable categories that help residents, planners, and researchers understand their neighbourhoods better."
          />
          <div className="relative -mx-[min(12vw,7rem)] mb-24">
            <div
              className="flex gap-6 overflow-x-auto px-[min(12vw,7rem)] py-4 scrollbar-hide"
              onWheel={(event) => {
                const container = event.currentTarget;
                container.scrollLeft += event.deltaY * 2;
              }}
            >
              {livabilityCards.map((card) => (
                <div
                  key={card.title}
                  className="group relative min-w-[60vw] max-w-[60vw] rounded-[3rem] border border-[#e5d6c2] bg-[#fbf3e8] p-12 shadow-[0_25px_80px_-60px_rgba(120,97,60,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_100px_-60px_rgba(120,97,60,0.35)] sm:min-w-[48vw] sm:max-w-[48vw] lg:min-w-[34vw] lg:max-w-[34vw]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_40%_20%,rgba(216,196,167,0.35),transparent_70%)]" />
                  <div className="relative flex min-h-[21rem] flex-col justify-between">
                    <div>
                      <div className="text-3xl">{card.icon}</div>
                      <h3 className="mt-8 text-3xl font-semibold text-[#2e261b]">{card.title}</h3>
                      <p className="mt-4 text-lg text-[#4d4134]/80">{card.description}</p>
                    </div>
                    <div className="mt-8 h-px w-full origin-left scale-x-0 bg-[#c9b192] transition duration-300 group-hover:scale-x-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection
        id="preview"
        revealed={revealedSections.preview}
        scrollY={scrollY}
        parallaxStrength={0.14}
        className="bg-[#fbf3e8] py-28"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-[#2e261b] sm:text-4xl">See your city’s story unfold.</h2>
            <p className="text-base text-[#564b3c]/80 sm:text-lg">
              Watch how Urbanlytics turns city maps into living dashboards — showing safety, affordability, and environmental health at a glance.
            </p>
          </div>
          <div className="relative rounded-[3rem] border border-[#e5d6c2] bg-white/90 p-10 shadow-[0_35px_90px_-60px_rgba(120,97,60,0.3)]">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { label: "Crime", gradient: "from-[#d67560] to-[#f3c7b8]" },
                { label: "Air Quality", gradient: "from-[#88af7d] to-[#cfe3c8]" },
                { label: "Transit", gradient: "from-[#8197d8] to-[#d7def7]" },
              ].map((layer) => (
                <div key={layer.label} className={`rounded-[2rem] border border-white/60 bg-gradient-to-br ${layer.gradient} p-6 text-left shadow-inner transition duration-500 animate-[pulse_8s_ease-in-out_infinite]`}> 
                  <p className="text-xs uppercase tracking-[0.4em] text-white/70">Layer</p>
                  <h3 className="mt-4 text-lg font-semibold text-white">{layer.label}</h3>
                  <p className="mt-2 text-sm text-white/80">Sample heat map preview</p>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-[#e5d6c2] bg-white/90 p-6 text-left shadow">
                <p className="text-xs uppercase tracking-[0.4em] text-[#9d8463]">Neighbourhood panel</p>
                <p className="mt-3 text-sm text-[#3c3227]">
                  Dynamic cards slide in with safety, affordability, and environment metrics tailored to the block you select.
                </p>
              </div>
              <div className="rounded-[2rem] border border-[#e5d6c2] bg-white/90 p-6 text-left shadow">
                <p className="text-xs uppercase tracking-[0.4em] text-[#9d8463]">Comparison view</p>
                <p className="mt-3 text-sm text-[#3c3227]">
                  Pick two neighbourhoods to see score animations, category breakdowns, and narrative summaries in one panel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection
        id="cta"
        revealed={revealedSections.cta}
        scrollY={scrollY}
        parallaxStrength={0.18}
        className="relative border-t border-[#e5d6c2] bg-white py-36"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-[#fdf3e7] to-white" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(233,216,189,0.45),transparent_70%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_30%,rgba(207,188,161,0.35),transparent_75%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[-20%] -z-10 h-[55vh] bg-[url('/citylines.svg')] bg-contain bg-bottom bg-no-repeat opacity-40 animate-[slowPan_20s_linear_infinite]" />

        {showConfetti ? <ConfettiOverlay onDone={() => setShowConfetti(false)} /> : null}

        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 text-center">
          <div className="space-y-6">
            <h3 className="text-[clamp(3.2rem,7vw,5rem)] font-serif leading-tight text-[#2e261b]">
              Ready to explore your city?
            </h3>
            <p className="mx-auto max-w-3xl text-lg text-[#574a39]/85 sm:text-xl">
              Dive into the Urbanlytics Explorer to uncover insights, compare neighbourhoods, and visualize your city like never before.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.4em] text-[#8d7253]/70">
            <span className="rounded-full border border-[#e5d6c2] px-4 py-2">Safety layers</span>
            <span className="rounded-full border border-[#e5d6c2] px-4 py-2">Affordability insights</span>
            <span className="rounded-full border border-[#e5d6c2] px-4 py-2">Environmental health</span>
          </div>
          <a
            href="/base"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#2e261b] px-16 py-5 text-xl font-semibold text-[#f6f0e9] shadow-[0_45px_120px_-70px_rgba(46,38,27,0.75)] transition duration-300 hover:bg-[#46392d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d7253]"
            onClick={(event) => {
              event.preventDefault();
              if (showConfetti) return;
              setShowConfetti(true);
              setTimeout(() => {
                router.push("/base");
              }, 700);
            }}
          >
            <span className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(120deg, rgba(233,216,189,0.4), transparent 60%)" }} />
            <span className="relative flex items-center gap-4 text-lg">
              <span className="text-2xl">🗺️</span>
              Enter the Explorer
            </span>
            <span className="absolute -inset-3 opacity-0 transition duration-300 group-hover:opacity-100" style={{ boxShadow: "0 0 80px rgba(46,38,27,0.35)" }} />
          </a>
          <p className="text-xs uppercase tracking-[0.45em] text-[#b49d80]/70">
            Built for residents · planners · researchers
          </p>
        </div>
      </ScrollRevealSection>

      <div className="fixed bottom-6 left-1/2 z-50 hidden w-full max-w-4xl -translate-x-1/2 px-6 sm:flex">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#e5d6c2]">
          <div className="h-full bg-[#8d7253] transition-[width] duration-300" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>
    </main>
  );
}

function ReadingShowcase({
  lines,
  subtext,
  active,
}: {
  lines: string[];
  subtext: string;
  active: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const midpoint = window.innerHeight / 2;
      let nextActive = 0;
      lineRefs.current.forEach((el, index) => {
        if (!el) return;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= midpoint && bottom >= midpoint) {
          nextActive = index;
        }
      });
      setActiveIndex(nextActive);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="space-y-8 text-left">
      {lines.map((line, index) => (
        <div
          key={line}
          ref={(el) => {
            lineRefs.current[index] = el;
          }}
          className="overflow-hidden"
        >
          <span
            className={`block text-[clamp(3.8rem,8.2vw,9rem)] font-serif uppercase leading-[1.05] tracking-[-0.015em] transition duration-700 ${
              active && activeIndex === index ? "text-[#1f1b16]" : "text-[#c3b39f]"
            }`}
          >
            {line}
          </span>
        </div>
      ))}
      <p
        className={`max-w-3xl text-[clamp(1.1rem,2vw,1.5rem)] leading-relaxed transition duration-700 ${
          active && activeIndex >= lines.length - 1 ? "text-[#4d4134]" : "text-[#b9a791]"
        }`}
      >
        {subtext}
      </p>
    </div>
  );
}

function FeatureBackground({ type }: { type: string }) {
  let gradient = "linear-gradient(135deg, rgba(217,203,182,0.15), transparent)";
  if (type.includes("Map")) {
    gradient = "radial-gradient(circle at 30% 30%, rgba(173, 206, 235, 0.25), transparent 65%)";
  } else if (type.includes("Toggle")) {
    gradient = "radial-gradient(circle at 70% 20%, rgba(255, 174, 120, 0.25), transparent 70%)";
  } else if (type.includes("Analytics")) {
    gradient = "radial-gradient(circle at 50% 80%, rgba(209, 189, 231, 0.25), transparent 70%)";
  }

  return <div className="pointer-events-none absolute inset-0 rounded-[3rem]" style={{ background: gradient }} />;
}

function ConfettiOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timeout = setTimeout(onDone, 1200);
    return () => clearTimeout(timeout);
  }, [onDone]);

  const pieces = Array.from({ length: 80 }, (_, index) => index);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {pieces.map((piece) => {
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 0.5;
        const duration = 1.2 + Math.random() * 0.6;
        const colors = ["#c59f74", "#f4ead6", "#8d7253", "#dac6a4"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 6;

        return (
          <span
            key={piece}
            className="absolute top-0 block rounded-sm"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * 0.6}px`,
              backgroundColor: color,
              animation: `fall ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${animationDelay}s forwards`,
            }}
          />
        );
      })}
    </div>
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
    <section id={id} data-section-id={id} className={className ?? ""} style={style}>
      {children}
    </section>
  );
}
