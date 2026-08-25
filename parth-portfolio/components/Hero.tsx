"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { PROFILE } from "@/lib/content";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const root = useRef<HTMLElement | null>(null);
  const routePath = useRef<SVGPathElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.out } });

        const lines = gsap.utils.toArray<HTMLElement>("[data-line]");
        tl.from(lines, {
          yPercent: 120,
          duration: DUR.base * 1.3,
          stagger: STAGGER * 2,
        });

        const path = routePath.current;
        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(
            path,
            { strokeDashoffset: 0, duration: DUR.slow * 1.6, ease: EASE.draw },
            0.15
          );
        }

        tl.from(
          "[data-hero-fade]",
          { autoAlpha: 0, y: 24, duration: DUR.base, stagger: STAGGER },
          0.45
        );

        // Exit: content drifts up and fades as the hero scrolls away.
        gsap.to("[data-hero-content]", {
          yPercent: -14,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="top"
      className={styles.hero}
      aria-label="Introduction"
    >
      <svg
        className={styles.route}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff3b14" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#ff3b14" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ff3b14" stopOpacity="0" />
          </linearGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ff3b14" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Telemetry horizontal grid lines */}
        <line x1="80" y1="780" x2="1360" y2="780" stroke="rgba(240, 236, 227, 0.05)" strokeDasharray="4 8" />
        <line x1="80" y1="620" x2="1360" y2="620" stroke="rgba(240, 236, 227, 0.05)" strokeDasharray="4 8" />
        <line x1="80" y1="460" x2="1360" y2="460" stroke="rgba(240, 236, 227, 0.05)" strokeDasharray="4 8" />

        {/* Elevation gradient area under the curve */}
        <path
          d="M -50 780 C 200 680, 360 840, 600 690 C 850 520, 1050 420, 1220 540 C 1340 620, 1420 560, 1500 500 L 1500 920 L -50 920 Z"
          fill="url(#elevationGrad)"
        />

        {/* Main elevation trajectory stroke */}
        <path
          ref={routePath}
          d="M -50 780 C 200 680, 360 840, 600 690 C 850 520, 1050 420, 1220 540 C 1340 620, 1420 560, 1500 500"
          fill="none"
          stroke="#ff3b14"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#glowEffect)"
          vectorEffect="non-scaling-stroke"
        />

        {/* Telemetry Waypoint Nodes */}
        <g className={styles.telemetryNodes}>
          {/* Swim node */}
          <g transform="translate(360, 780)">
            <circle r="4" fill="#0b0b0b" stroke="#ff3b14" strokeWidth="2" />
            <text x="0" y="18" fill="rgba(240, 236, 227, 0.75)" fontSize="10" letterSpacing="0.16em" textAnchor="middle">01 · SWIM 1.5KM</text>
          </g>
          {/* Bike crest node */}
          <g transform="translate(1050, 470)">
            <circle r="4" fill="#0b0b0b" stroke="#ff3b14" strokeWidth="2" />
            <text x="0" y="-14" fill="rgba(240, 236, 227, 0.75)" fontSize="10" letterSpacing="0.16em" textAnchor="middle">02 · BIKE 40KM · +380M</text>
          </g>
          {/* Run transition node */}
          <g transform="translate(1330, 600)">
            <circle r="4" fill="#0b0b0b" stroke="#ff3b14" strokeWidth="2" />
            <text x="0" y="18" fill="rgba(240, 236, 227, 0.75)" fontSize="10" letterSpacing="0.16em" textAnchor="middle">03 · RUN 10KM</text>
          </g>
        </g>

        {/* Live GPS Telemetry Beacon */}
        <g>
          <circle r="6" fill="#ff3b14" filter="url(#glowEffect)">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1"
              path="M -50 780 C 200 680, 360 840, 600 690 C 850 520, 1050 420, 1220 540 C 1340 620, 1420 560, 1500 500"
            />
          </circle>
        </g>
      </svg>

      <div data-hero-content>
        <div className={styles.topRow} data-hero-fade>
          <div className={styles.manifestoWrap}>
            <p className={styles.manifesto}>
              Software developer.{" "}
              <em className={styles.manifestoEm}>Triathlete.</em> Builder.
            </p>
          </div>

          <div className={styles.heroPortraitCard}>
            <div className={styles.portraitFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/placeholders/hero-portrait.jpg"
                alt="Parth Sankhla"
                className={styles.portraitImg}
              />
              <span className={`${styles.corner} ${styles.tl}`} />
              <span className={`${styles.corner} ${styles.tr}`} />
              <span className={`${styles.corner} ${styles.bl}`} />
              <span className={`${styles.corner} ${styles.br}`} />
              <span className={styles.portraitDot} />
            </div>
            <div className={styles.portraitMeta}>
              <span className={styles.portraitStatus}>HYD · 2026</span>
              <span className={styles.portraitLabel}>ACTIVE SEASON</span>
            </div>
          </div>

          <p className={styles.edition}>Portfolio — Vol. 02</p>
        </div>

        <h1 className={styles.name}>
          <span className={styles.nameMask}>
            <span className={`${styles.nameFirst} serif`} data-line>
              Parth
            </span>
          </span>
          <span className={styles.nameMask}>
            <span className={`${styles.nameLast} serif`} data-line>
              Sankhla.
            </span>
          </span>
        </h1>

        <div className={styles.bottomBar} data-hero-fade>
          <a className={styles.scrollCue} href="#profile">
            Scroll
            <span className={styles.cueLine} aria-hidden="true" />
          </a>
          <p className={styles.location}>{PROFILE.location}</p>
          <a
            className={styles.social}
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </section>
  );
}
