"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./StudioReveal.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const IMAGES = ["/studio/img-1.jpg", "/studio/img-2.jpg", "/studio/img-3.jpg", "/studio/img-4.jpg", "/studio/img-5.jpg"];

/* Dissolve band constants (see spec) */
const CELL = 16;
const SPREAD_ABOVE = 0.25;
const SPREAD_BELOW = 0.25;
const SCATTER_INTENSITY = 0.15;
const SOLID_CORE_RADIUS = 0.025;
const MIN_SCATTER_AT_CENTER = 0.3;
const VISIBILITY_THRESHOLD = 0.65;
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*+=?!<>{}[]";

type Cell = {
  el: HTMLDivElement;
  row: number;
  col: number;
  normalizedY: number;
};

/** Deterministic per-cell hash — stable pattern, no runtime randomness. */
function hashFromPosition(row: number, col: number, seed: number): number {
  const raw = Math.sin(row * seed + col * (seed * 2.45)) * 43758.5453;
  return raw - Math.floor(raw);
}

export default function StudioReveal() {
  const root = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = root.current?.querySelector<HTMLDivElement>(`.${styles.spotlight}`);
        const images = root.current
          ? (Array.from(root.current.querySelectorAll<HTMLDivElement>(`.${styles.spotlightImg}`)))
          : [];
        const grid = gridRef.current;
        if (!section || !grid || images.length === 0) return;

        const totalImages = images.length;
        const totalTransitions = totalImages - 1;
        const travelRange = 1 + SPREAD_ABOVE + SPREAD_BELOW;

        /* Stack order: first image on top, wiped first. */
        images.forEach((img, i) => {
          img.style.zIndex = String(totalImages - i);
        });

        /* Build the dissolve grid once. */
        const columns = Math.ceil(window.innerWidth / CELL);
        const rows = Math.ceil(window.innerHeight / CELL);
        const cells: Cell[] = [];
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const el = document.createElement("div");
            el.className = styles.dissolveCell;
            el.style.left = `${col * CELL}px`;
            el.style.top = `${row * CELL}px`;
            el.style.width = `${CELL}px`;
            el.style.height = `${CELL}px`;
            el.style.fontSize = "11px";
            el.style.visibility = "hidden";
            el.textContent =
              CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            grid.appendChild(el);
            cells.push({ el, row, col, normalizedY: (row + 0.5) / rows });
          }
        }
        const visibilityRandom = cells.map((c) =>
          hashFromPosition(c.row, c.col, 127.1)
        );
        const scatterOffset = cells.map(
          (c) => (hashFromPosition(c.row, c.col, 269.3) - 0.5) * SCATTER_INTENSITY
        );

        const hideAll = () => {
          for (const cell of cells) cell.el.style.visibility = "hidden";
        };

        const updateClipPaths = (progress: number) => {
          for (let i = 0; i < totalTransitions; i++) {
            const segmentStart = i / totalTransitions;
            const segmentEnd = (i + 1) / totalTransitions;
            const raw =
              (progress - segmentStart) / (segmentEnd - segmentStart);
            const segmentProgress = gsap.utils.clamp(0, 1, raw);
            const remapped =
              -SPREAD_ABOVE + segmentProgress * travelRange;
            const clipPercent = gsap.utils.clamp(0, 100, remapped * 100);
            images[i].style.clipPath = `polygon(0% ${clipPercent}%, 100% ${clipPercent}%, 100% 100%, 0% 100%)`;
          }
        };

        const updateBand = (bandCenterY: number) => {
          for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const rawDistance = Math.abs(cell.normalizedY - bandCenterY);
            const scatterStrength = gsap.utils.clamp(
              MIN_SCATTER_AT_CENTER,
              1,
              rawDistance / SOLID_CORE_RADIUS
            );
            const scattered =
              cell.normalizedY -
              bandCenterY +
              scatterOffset[i] * scatterStrength;
            const normalizedDistance =
              scattered >= 0
                ? scattered / SPREAD_BELOW
                : Math.abs(scattered) / SPREAD_ABOVE;
            if (normalizedDistance >= 1) {
              cell.el.style.visibility = "hidden";
              continue;
            }
            const density =
              (1 - normalizedDistance) * (1 - normalizedDistance);
            const isVisible =
              density > visibilityRandom[i] * VISIBILITY_THRESHOLD;
            cell.el.style.visibility = isVisible ? "visible" : "hidden";
          }
        };

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${totalTransitions * window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            const scrollProgress = self.progress;
            const rawPosition = scrollProgress * totalTransitions;
            const currentTransition = Math.min(
              Math.floor(rawPosition),
              totalTransitions - 1
            );
            const transitionProgress = gsap.utils.clamp(
              0,
              1,
              rawPosition - currentTransition
            );
            updateClipPaths(scrollProgress);

            if (transitionProgress <= 0 || transitionProgress >= 1) {
              hideAll();
              return;
            }
            const bandCenterY =
              -SPREAD_ABOVE + transitionProgress * travelRange;
            updateBand(bandCenterY);
          },
        });

        /* matchMedia reverts triggers, but direct style writes need this. */
        return () => {
          hideAll();
          for (const cell of cells) cell.el.remove();
          gsap.set(images, { clearProps: "clipPath,zIndex" });
        };
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className={styles.wrap} aria-label="Studio gallery">
      <section className={styles.intro}>
        <div className={styles.bar}>
          <span>Studio</span>
          <span>05 frames</span>
        </div>
        <p>Scroll down to decode the craft</p>
      </section>

      <section className={styles.spotlight} aria-hidden="true">
        {IMAGES.map((src) => (
          <div className={styles.spotlightImg} key={src}>
            {/* eslint-disable-next-line @next/next/no-img-element -- pixel-perfect full-bleed stack, no optimization wanted */}
            <img src={src} alt="" loading="eager" />
          </div>
        ))}
        <div className={styles.dissolveGrid} ref={gridRef} />
      </section>

      <section className={styles.outro}>
        <p>The rest is under NDA</p>
        <div className={styles.bar}>
          <span>Parth Sankhla</span>
          <span>Selected work</span>
        </div>
      </section>
    </div>
  );
}
