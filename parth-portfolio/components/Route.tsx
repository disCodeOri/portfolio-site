"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";
import { DUR } from "@/lib/motion";
import styles from "./Route.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function SwimArt() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <path d="M10 120 Q 35 100 60 120 T 110 120 T 160 120 T 210 120" />
      <path d="M10 145 Q 35 125 60 145 T 110 145 T 160 145 T 210 145" />
      <path d="M10 170 Q 35 150 60 170 T 110 170 T 160 170 T 210 170" />
      <circle cx="100" cy="72" r="13" />
      <path d="M66 98 Q 100 52 134 98" />
    </svg>
  );
}

function BikeArt() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="55" cy="140" r="33" />
      <circle cx="145" cy="140" r="33" />
      <path d="M55 140 L92 88 L138 88 L145 140" />
      <path d="M92 88 L112 140 L55 140" />
      <path d="M138 88 L130 74 L152 74" />
      <path d="M92 88 L86 76 L70 76" />
    </svg>
  );
}

function CodeArt() {
  return (
    <svg viewBox="0 0 300 200" aria-hidden="true">
      <path d="M118 66 L74 100 L118 134" />
      <path d="M182 66 L226 100 L182 134" />
      <path d="M164 56 L136 144" />
      <path d="M40 168 H260" />
    </svg>
  );
}

function FlagArt() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <path d="M72 28 V172" />
      <path d="M72 42 L152 58 L72 84 Z" />
      <path d="M40 172 H160" />
    </svg>
  );
}

const STAGES = [
  {
    index: "01",
    label: "Start line / Open water",
    title: "Open water 1500m",
    meta: "PACE · 1:18/100M",
    image: "/placeholders/route-swim.jpg",
    art: <SwimArt />,
  },
  {
    index: "02",
    label: "Racing up a decade",
    title: "World Triathlon Asia Cup",
    body: "World Triathlon Asia Cup, Pokhara — second-fastest swim in the Indian contingent at sixteen, against a field a decade older. Silver medalist at the Telangana CM Cup.",
    meta: "40KM BIKE SPLIT",
    image: "/placeholders/route-bike.jpg",
    art: <BikeArt />,
  },
  {
    index: "03",
    label: "Building between sessions",
    title: "Shipping research & systems",
    body: "Research software for a BITS Pilani postdoc device. Zariya, an end-to-end storefront for a sustainable fashion label. Rent management system spanning 27 properties.",
    meta: "BITS PILANI & CLIENTS",
    image: "/placeholders/route-code.jpg",
    art: <CodeArt />,
  },
  {
    index: "04",
    label: "Next transition",
    title: "Open for research & client work",
    meta: "TRANSITION // 2026",
    image: "/placeholders/route-finish.jpg",
    art: <FlagArt />,
  },
] as const;

export default function Route() {
  const root = useRef<HTMLElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      const spotlight = spotlightRef.current;
      if (!path || !spotlight) return;

      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = String(pathLength);
      path.style.strokeDashoffset = String(pathLength);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: spotlight,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(path, { strokeDashoffset: 0, duration: DUR.fast });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="route" className={styles.section} aria-label="The route">
      <div className={styles.heading}>
        <SectionHeading index="01" title="The Route" hint="Swim, build, repeat" />
        <p className={`${styles.statement} serif`}>
          Every season has a shape. This is the line so far.
        </p>
      </div>

      <div ref={spotlightRef} className={styles.spotlight}>
        {/* Stage 01: Top Banner */}
        <div className={styles.row}>
          <figure className={styles.stageFrameWide}>
            <div className={styles.stageVisual}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={STAGES[0].image} alt={STAGES[0].label} className={styles.stageImg} />
              <div className={styles.stageOverlay} />
              <span className={`${styles.corner} ${styles.tl}`} />
              <span className={`${styles.corner} ${styles.tr}`} />
              <span className={`${styles.corner} ${styles.bl}`} />
              <span className={`${styles.corner} ${styles.br}`} />
              <div className={styles.stageBadge}>
                <span className={styles.badgeIndex}>{STAGES[0].index}</span>
                <span className={styles.badgeMeta}>{STAGES[0].meta}</span>
              </div>
            </div>
            <figcaption className={styles.caption}>
              {STAGES[0].index} — {STAGES[0].label}
            </figcaption>
          </figure>
        </div>

        {/* Stage 02: 2-Column Split */}
        <div className={styles.row}>
          <div className={styles.col}>
            <article className={styles.card}>
              <span className={styles.cardIndex}>{STAGES[1].index}</span>
              <h3 className={`${styles.cardTitle} serif`}>{STAGES[1].title}</h3>
              <p className={styles.cardBody}>{STAGES[1].body}</p>
              <div className={styles.cardTag}>{STAGES[1].meta}</div>
            </article>
          </div>
          <div className={styles.col}>
            <figure className={styles.stageFrame}>
              <div className={styles.stageVisual}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={STAGES[1].image} alt={STAGES[1].label} className={styles.stageImg} />
                <div className={styles.stageOverlay} />
                <span className={`${styles.corner} ${styles.tl}`} />
                <span className={`${styles.corner} ${styles.tr}`} />
                <span className={`${styles.corner} ${styles.bl}`} />
                <span className={`${styles.corner} ${styles.br}`} />
              </div>
            </figure>
          </div>
        </div>

        {/* Stage 03: 2-Column Split (Reversed) */}
        <div className={styles.row}>
          <div className={styles.col}>
            <figure className={styles.stageFrame}>
              <div className={styles.stageVisual}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={STAGES[2].image} alt={STAGES[2].label} className={styles.stageImg} />
                <div className={styles.stageOverlay} />
                <span className={`${styles.corner} ${styles.tl}`} />
                <span className={`${styles.corner} ${styles.tr}`} />
                <span className={`${styles.corner} ${styles.bl}`} />
                <span className={`${styles.corner} ${styles.br}`} />
              </div>
            </figure>
          </div>
          <div className={styles.col}>
            <article className={styles.card}>
              <span className={styles.cardIndex}>{STAGES[2].index}</span>
              <h3 className={`${styles.cardTitle} serif`}>{STAGES[2].title}</h3>
              <p className={styles.cardBody}>{STAGES[2].body}</p>
              <div className={styles.cardTag}>{STAGES[2].meta}</div>
            </article>
          </div>
        </div>

        {/* Stage 04: Bottom Banner */}
        <div className={styles.row}>
          <figure className={styles.stageFrameWide}>
            <div className={styles.stageVisual}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={STAGES[3].image} alt={STAGES[3].label} className={styles.stageImg} />
              <div className={styles.stageOverlay} />
              <span className={`${styles.corner} ${styles.tl}`} />
              <span className={`${styles.corner} ${styles.tr}`} />
              <span className={`${styles.corner} ${styles.bl}`} />
              <span className={`${styles.corner} ${styles.br}`} />
              <div className={styles.stageBadge}>
                <span className={styles.badgeIndex}>{STAGES[3].index}</span>
                <span className={styles.badgeMeta}>{STAGES[3].meta}</span>
              </div>
            </div>
            <figcaption className={styles.caption}>
              {STAGES[3].index} — {STAGES[3].label}
            </figcaption>
          </figure>
        </div>

        <div className={styles.svgPath} aria-hidden="true">
          <svg
            viewBox="0 0 1378 2760"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMin meet"
          >
            <path
              ref={pathRef}
              d="M639.668 100C639.668 100 105.669 100 199.669 601.503C293.669 1103.01 1277.17 691.502 1277.17 1399.5C1277.17 2107.5 -155.332 1968 140.168 1438.5C435.669 909.002 1442.66 2093.5 713.168 2659.5"
              stroke="#ff3b14"
              strokeOpacity="0.22"
              strokeWidth="200"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
