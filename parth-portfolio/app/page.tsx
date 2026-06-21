"use client";

import { useMemo, useState } from "react";
import Vinyl from "@/components/Vinyl";
import styles from "./page.module.css";

const categories = [
  {
    id: "athletics",
    index: "01",
    title: "Athletics",
    summary: "International, national, and state-level triathlon achievements.",
    meta: "8 details",
    position: styles.nodeAthletics,
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
    position: styles.nodeTech,
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
    position: styles.nodeVenture,
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
    position: styles.nodeImpact,
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

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedId) ?? null,
    [selectedId]
  );

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

          <section className={styles.experiencePanel} id="highlights" aria-labelledby="highlights-heading">
            <div className={styles.panelHeader}>
              <p className={styles.eyebrow}>Selected work, sport, and leadership</p>
              <h2 id="highlights-heading">Highlights</h2>
            </div>

            <div className={`${styles.pathStage} ${isHovering ? styles.stagePaused : ""}`}>
              <FluidPath />

              <div className={styles.categoryNodes} aria-label="Highlight categories">
                {categories.map((category) => (
                  <CategoryNode
                    key={category.id}
                    category={category}
                    selected={category.id === selectedCategory?.id}
                    onSelect={() => setSelectedId(category.id)}
                    onHoverChange={setIsHovering}
                  />
                ))}
              </div>

              {selectedCategory ? (
                <DetailPanel category={selectedCategory} onClose={() => setSelectedId(null)} />
              ) : (
                <div className={styles.stageHint}>
                  <span>Choose a category</span>
                  <p>Follow the gold path to open a focused achievement dossier.</p>
                </div>
              )}
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
  selected,
  onSelect,
  onHoverChange,
}: {
  category: Category;
  selected: boolean;
  onSelect: () => void;
  onHoverChange: (hovering: boolean) => void;
}) {
  return (
    <button
      className={`${styles.categoryNode} ${category.position} ${selected ? styles.categoryNodeActive : ""}`}
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      aria-pressed={selected}
    >
      <span className={styles.nodeIndex}>{category.index}</span>
      <span className={styles.nodeTitle}>{category.title}</span>
      <span className={styles.nodeSummary}>{category.summary}</span>
      <span className={styles.nodeMeta}>{category.meta}</span>
    </button>
  );
}

function DetailPanel({ category, onClose }: { category: Category; onClose: () => void }) {
  return (
    <article className={styles.detailPanel} aria-live="polite">
      <div className={styles.detailHeader}>
        <div>
          <p className={styles.detailBreadcrumb}>Highlights / {category.title}</p>
          <h3>{category.title}</h3>
          <p>{category.summary}</p>
        </div>
        <button className={styles.detailClose} type="button" onClick={onClose}>
          Back to categories
        </button>
      </div>

      <ol className={styles.detailList}>
        {category.items.map((item, index) => (
          <li className={styles.detailItem} key={item.title}>
            <span className={styles.detailIndex}>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <span>{item.tag}</span>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
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
