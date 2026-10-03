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
  character: string;
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
  const gridRef = useRef<HTMLCanvasElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = root.current?.querySelector<HTMLDivElement>(`.${styles.spotlight}`);
        const images = root.current
          ? (Array.from(root.current.querySelectorAll<HTMLDivElement>(`.${styles.spotlightImg}`)))
          : [];
        const canvas = gridRef.current;
        if (!section || !canvas || images.length === 0) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const totalImages = images.length;
        const totalTransitions = totalImages - 1;
        const travelRange = 1 + SPREAD_ABOVE + SPREAD_BELOW;

        /* Stack order: first image on top, wiped first. */
        images.forEach((img, i) => {
          img.style.zIndex = String(totalImages - i);
        });

        // Draw the same cells on one surface instead of thousands of DOM nodes.
        let columns = 0;
        let rows = 0;
        let width = 0;
        let height = 0;
        const cells: Cell[] = [];
        let visibilityRandom: number[] = [];
        let scatterOffset: number[] = [];
        let progress = 0;
        let frame: number | null = null;
        let lastDraw = 0;
        let bandVisible = false;

        const resize = () => {
          width = Math.max(1, section.clientWidth);
          height = Math.max(1, section.clientHeight);
          columns = Math.ceil(width / CELL);
          rows = Math.ceil(height / CELL);
          const scale = Math.min(1, Math.sqrt(1_000_000 / Math.max(1, width * height)));
          canvas.width = Math.max(1, Math.floor(width * scale));
          canvas.height = Math.max(1, Math.floor(height * scale));
          ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
          ctx.font = `500 11px ${getComputedStyle(canvas).fontFamily}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          cells.length = 0;
          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
              cells.push({ character: CHARACTERS[Math.floor(hashFromPosition(row, col, 73.7) * CHARACTERS.length)], row, col, normalizedY: (row + 0.5) / rows });
            }
          }
          visibilityRandom = cells.map((c) =>
            hashFromPosition(c.row, c.col, 127.1)
          );
          scatterOffset = cells.map(
            (c) => (hashFromPosition(c.row, c.col, 269.3) - 0.5) * SCATTER_INTENSITY
          );
        };

        const hideAll = () => {
          if (bandVisible) ctx.clearRect(0, 0, width, height);
          bandVisible = false;
        };

        const previousClips = new Array<number>(totalTransitions).fill(-1);
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
            if (clipPercent !== previousClips[i]) {
              images[i].style.clipPath = `inset(${clipPercent}% 0 0 0)`;
              previousClips[i] = clipPercent;
            }
          }
        };

        const updateBand = (bandCenterY: number) => {
          ctx.clearRect(0, 0, width, height);
          bandVisible = true;
          // Rows outside the band cannot contribute pixels.
          const margin = SCATTER_INTENSITY / 2;
          const firstRow = Math.max(0, Math.floor((bandCenterY - SPREAD_ABOVE - margin) * rows));
          const lastRow = Math.min(rows, Math.ceil((bandCenterY + SPREAD_BELOW + margin) * rows));
          for (let i = firstRow * columns; i < lastRow * columns; i++) {
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
              continue;
            }
            const density =
              (1 - normalizedDistance) * (1 - normalizedDistance);
            const isVisible =
              density > visibilityRandom[i] * VISIBILITY_THRESHOLD;
            if (isVisible) {
              const x = cell.col * CELL;
              const y = cell.row * CELL;
              ctx.fillStyle = "#ff3b14";
              ctx.fillRect(x, y, CELL, CELL);
              ctx.fillStyle = "#000";
              ctx.fillText(cell.character, x + CELL / 2, y + CELL / 2);
            }
          }
        };

        const draw = (now: number) => {
          frame = null;
          if (document.hidden) return;
          if (now - lastDraw < 1000 / 30 - 1) {
            frame = requestAnimationFrame(draw);
            return;
          }
          lastDraw = now;
          const scrollProgress = progress;
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
        };
        const scheduleDraw = () => {
          if (frame === null && !document.hidden) frame = requestAnimationFrame(draw);
        };
        resize();
        const resizeObserver = new ResizeObserver(() => {
          resize();
          scheduleDraw();
        });
        resizeObserver.observe(section);
        const onVisibilityChange = () => {
          if (document.hidden && frame !== null) {
            cancelAnimationFrame(frame);
            frame = null;
          } else if (!document.hidden) scheduleDraw();
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${totalTransitions * window.innerHeight}`,
          invalidateOnRefresh: true,
          pin: true,
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            progress = self.progress;
            scheduleDraw();
          },
        });

        /* matchMedia reverts triggers, but direct style writes need this. */
        return () => {
          hideAll();
          if (frame !== null) cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          document.removeEventListener("visibilitychange", onVisibilityChange);
          gsap.set(images, { clearProps: "clipPath,zIndex" });
        };
      });
      return () => mm.revert();
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
        <canvas className={styles.dissolveGrid} ref={gridRef} />
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
