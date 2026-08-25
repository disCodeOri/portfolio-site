"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { PROFILE } from "@/lib/content";
import IntroShader from "@/components/IntroShader";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.out } });

        const lines = gsap.utils.toArray<HTMLElement>("[data-line]");
        tl.from(
          lines,
          {
            yPercent: 120,
            duration: DUR.base * 1.4,
            stagger: STAGGER * 1.5,
            ease: "power4.out",
          },
          1.05
        );

        tl.from(
          "[data-hero-fade]",
          { autoAlpha: 0, y: 20, duration: DUR.base, stagger: STAGGER, ease: "power3.out" },
          1.35
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
      <IntroShader />

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
              <span className={styles.portraitStatus}>LBLR · 2026</span>
              <span className={styles.portraitLabel}>OFF SEASON</span>
            </div>
          </div>

          <p className={styles.edition}>Portfolio — Vol. 02</p>
        </div>

        <h1 className={styles.name}>
          <span className={styles.nameMask}>
            <span className={styles.nameFirst} data-line>
              Parth
            </span>
          </span>
          <span className={styles.nameMask}>
            <span className={styles.nameLast} data-line>
              Sankhla<span className={styles.accentDot}>.</span>
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
