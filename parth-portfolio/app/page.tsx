"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import Vinyl from "@/components/Vinyl";
import styles from "./page.module.css";

const categories = [
  {
    id: "athletics",
    index: "01",
    title: "Athletics",
    summary: "International, national, and state-level triathlon achievements.",
    meta: "8 details",
    phase: 0.04,
    items: [
      {
        title: "International Race in Nepal",
        desc: "2nd-fastest swim in the Indian contingent. Raced at age 16 against athletes above 25, using a bike purchased two days before the race.",
        tag: "International Triathlon",
      },
      {
        title: "IRONMAN 5150 Triathlon Chennai 2026",
        desc: "Finished 23rd in the 18-24 age category despite the race being run-bike-run, which removed swimming, my strongest suit.",
        tag: "IRONMAN 5150",
      },
      {
        title: "37th National Games, Goa",
        desc: "Competed at the national level but could not complete the race after being stung by a jellyfish.",
        tag: "National Games",
      },
      {
        title: "Telangana CM Cup",
        desc: "Silver medalist at the Telangana CM Cup.",
        tag: "Silver Medalist",
      },
    ],
  },
  {
    id: "technology-research",
    index: "02",
    title: "Technology & Research",
    summary: "Research software and custom client systems for niche workflows.",
    meta: "5 details",
    phase: 0.32,
    items: [
      {
        title: "BITS Pilani Research Software",
        desc: "Software development and research intern for a postdoctoral researcher, building a custom application for a specialized device.",
        tag: "Research Dev",
      },
      {
        title: "Portable, Lower-Cost Device Integration",
        desc: "The application is designed to integrate into a device that significantly improves portability and reduces the cost of current industry solutions.",
        tag: "Applied Research",
      },
      {
        title: "Custom Software Services",
        desc: "Providing tailored software services to clients whose operational needs are not handled well by generalized platforms.",
        tag: "Client Systems",
      },
      {
        title: "Rent Management Platform",
        desc: "Building a rent management system for a property owner managing 27 properties across multiple locations.",
        tag: "Full Stack",
      },
    ],
  },
  {
    id: "entrepreneurship-business",
    index: "03",
    title: "Entrepreneurship & Business",
    summary: "Fellowships, analytics, and agentic AI programs.",
    meta: "2 details",
    phase: 0.58,
    items: [
      {
        title: "Yale Entrepreneurial Society",
        desc: "Completed the Yale Entrepreneurial Society High School Fellowship with a full-ride scholarship.",
        tag: "Full-Ride Scholar",
      },
      {
        title: "BITSoM Certificate Program",
        desc: "Completed the BITSoM certificate program in Business Analytics and Agentic AI.",
        tag: "Analytics + AI",
      },
    ],
  },
  {
    id: "impact-recognition",
    index: "04",
    title: "Leadership, Impact & Recognition",
    summary: "Fundraising, readiness recognition, and external validation.",
    meta: "5 details",
    phase: 0.82,
    items: [
      {
        title: "Habitat for Humanity Fundraiser",
        desc: "Raised INR 31,000 independently through door-to-door outreach, the highest amount raised by anyone in the program.",
        tag: "Top Fundraiser",
      },
      {
        title: "Fundraising Margin",
        desc: "The second-highest fundraiser raised INR 17,000, making the final result a clear program-leading effort.",
        tag: "Community Impact",
      },
      {
        title: "Callido College Readiness Skills",
        desc: "Placed in the top 25 percentile globally in the Callido college readiness skills program.",
        tag: "Top 25% Globally",
      },
      {
        title: "Brown University Faculty Signed",
        desc: "Received faculty-signed recognition connected to the Callido college readiness program.",
        tag: "Recognition",
      },
    ],
  },
];

type Category = (typeof categories)[number];
type CardPosition = { left: string; top: string };

const initialPositions = Object.fromEntries(
  categories.map((category) => [category.id, pointOnPath(category.phase)])
) as Record<string, CardPosition>;

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const positions = useLazyCardPositions(hoveredId, selectedId);

  return (
    <>
      <a className={styles.skipLink} href="#highlights">
        Skip to highlights
      </a>
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.layout}>
        <main className={styles.main} id="main-content">

          {/* Left panel */}
          <aside className={styles.identity} aria-label="Profile summary">
            <div>
              <h1 className={styles.name}>
                Parth<br />
                <em>Sankhla</em>
              </h1>

              <div className={styles.descriptor}>
                <span>Software Developer</span>
                <span>Triathlete</span>
                <span>Builder</span>
              </div>

              <div className={styles.statusBlock}>
                <p className={styles.statusLabel}>Currently</p>
                <p className={styles.statusItem}><span>01</span>BITS Pilani — Research Dev</p>
                <p className={styles.statusItem}><span>02</span>Client Software — Rent Management</p>
                <p className={styles.statusItem}><span>03</span>Triathlon Training</p>
              </div>
            </div>

            <div>
              <Vinyl />
              <p className={styles.location}>Hyderabad, India</p>
            </div>
          </aside>

          <section className={styles.experiencePanel} id="highlights" aria-label="Interactive highlights">
            <div className={`${styles.pathStage} ${hoveredId ? styles.stagePaused : ""}`}>
              <FluidPath />

              <div className={styles.categoryNodes} aria-label="Highlight categories">
                {categories.map((category) => (
                  <CategoryNode
                    key={category.id}
                    category={category}
                    position={positions[category.id] ?? initialPositions[category.id]}
                    selected={category.id === selectedId}
                    expanded={category.id === selectedId}
                    onSelect={() => setSelectedId((current) => current === category.id ? null : category.id)}
                    onHoverChange={(hovering) => setHoveredId(hovering ? category.id : null)}
                  />
                ))}
              </div>

            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <span className={styles.footerLogo}>PS</span>
          <nav className={styles.footerNav} aria-label="Footer">
            <a href="https://www.linkedin.com/in/parth-sankhla/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="mailto:parth9102007@gmail.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}

function CategoryNode({
  category,
  position,
  selected,
  expanded,
  onSelect,
  onHoverChange,
}: {
  category: Category;
  position: CardPosition;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onHoverChange: (hovering: boolean) => void;
}) {
  return (
    <button
      className={`${styles.categoryNode} ${selected ? styles.categoryNodeActive : ""} ${expanded ? styles.categoryNodeExpanded : ""}`}
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      aria-pressed={selected}
      aria-expanded={expanded}
      style={{ "--card-left": position.left, "--card-top": position.top } as CSSProperties}
    >
      <span className={styles.nodeIndex}>{category.index}</span>
      <span className={styles.nodeTitle}>{category.title}</span>
      <span className={styles.nodeSummary}>{category.summary}</span>
      <span className={styles.nodeMeta}>{expanded ? "Click to collapse" : category.meta}</span>

      {expanded && (
        <ol className={styles.expandedDetails}>
          {category.items.map((item, index) => (
            <li key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <em>{item.tag}</em>
              </div>
            </li>
          ))}
        </ol>
      )}
    </button>
  );
}

function useLazyCardPositions(hoveredId: string | null, selectedId: string | null) {
  const progressRef = useRef(
    Object.fromEntries(categories.map((category) => [category.id, category.phase])) as Record<string, number>
  );
  const lastTimeRef = useRef<number | null>(null);
  const [positions, setPositions] = useState(initialPositions);

  useEffect(() => {
    let frame = 0;

    const tick = (time: number) => {
      const lastTime = lastTimeRef.current ?? time;
      const delta = Math.min(time - lastTime, 48);
      lastTimeRef.current = time;

      const nextPositions: Record<string, CardPosition> = {};

      for (const category of categories) {
        const current = progressRef.current[category.id];
        const isHovered = hoveredId === category.id;
        const isSelected = selectedId === category.id;
        const speed = isSelected ? 0 : isHovered ? 0.000006 : 0.000026;
        const next = (current + delta * speed) % 1;

        progressRef.current[category.id] = next;
        nextPositions[category.id] = pointOnPath(next);
      }

      setPositions(nextPositions);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hoveredId, selectedId]);

  return positions;
}

function pointOnPath(progress: number): CardPosition {
  const angle = progress * Math.PI * 2;
  const left = 50 + 36 * Math.sin(angle + 0.34) + 9 * Math.sin(angle * 2.7 + 1.1);
  const top = 49 + 27 * Math.sin(angle * 1.35 - 1.2) + 8 * Math.cos(angle * 2.1 + 0.55);

  return {
    left: `${Math.max(16, Math.min(84, left))}%`,
    top: `${Math.max(16, Math.min(78, top))}%`,
  };
}

function FluidPath() {
  return (
    <svg className={styles.fluidPath} viewBox="0 0 1200 720" aria-hidden="true" focusable="false">
      <path className={styles.pathLine} d="M45 360 C145 120 310 320 430 210 C575 78 690 312 820 185 C1015 -2 1190 140 1126 342 C1066 533 890 355 748 498 C558 690 456 468 282 560 C118 646 -30 540 45 360Z" />
      <path className={styles.pathLine} d="M80 364 C170 170 312 348 438 248 C568 142 690 350 818 226 C980 70 1138 172 1084 338 C1035 488 876 364 738 480 C570 622 462 442 304 520 C158 590 12 520 80 364Z" />
      <path className={styles.pathLine} d="M118 370 C198 220 318 374 448 282 C560 202 690 388 816 268 C950 140 1088 208 1040 338 C996 446 862 378 728 456 C584 540 468 418 326 482 C196 540 58 504 118 370Z" />
      <path className={styles.pathLine} d="M164 374 C228 268 332 398 462 316 C564 250 690 424 816 310 C928 204 1030 246 994 342 C960 412 846 394 722 432 C596 470 482 398 356 442 C244 480 118 474 164 374Z" />
      <path className={styles.pathLine} d="M212 380 C258 314 352 414 480 348 C574 300 692 456 820 354 C910 282 976 284 944 348 C914 388 834 410 716 410 C604 410 500 380 390 404 C298 424 178 438 212 380Z" />
    </svg>
  );
}
