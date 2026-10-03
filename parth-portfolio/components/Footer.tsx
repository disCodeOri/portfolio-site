"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PROFILE } from "@/lib/content";
import styles from "./Footer.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const POOLS = [
  " ",
  "·.,",
  ":;`-~^",
  "=+<>?!:;",
  "|/\\()[]{}«»",
  "÷×±≈≠≤≥∞∑∏√∫",
  "¤†‡§¶©®™°¬",
  "%&#$@¥€£¢",
];

function esc(ch: string): string {
  if (ch === "<") return "&lt;";
  if (ch === ">") return "&gt;";
  if (ch === "&") return "&amp;";
  return ch;
}

let seed = 42;
function rand() {
  seed = (seed * 16807 + 0) % 2147483647;
  return seed / 2147483647;
}

function imageToAscii(img: HTMLImageElement, cols: number) {
  seed = 42;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  if (!ctx) return { text: "", poolGrid: [] as number[][] };
  const aspect = img.naturalHeight / img.naturalWidth || 1;
  const rows = Math.round(cols * aspect * 1.0);
  c.width = cols;
  c.height = rows;
  ctx.drawImage(img, 0, 0, cols, rows);
  const data = ctx.getImageData(0, 0, cols, rows).data;
  const lines: string[] = [];
  const poolGrid: number[][] = [];

  for (let y = 0; y < rows; y++) {
    let line = "";
    const poolRow: number[] = [];
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 15) {
        line += " ";
        poolRow.push(-1);
        continue;
      }
      let brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      brightness *= a / 255;
      let pi = Math.floor(brightness * (POOLS.length - 1) * 0.85);
      pi = Math.min(pi, POOLS.length - 1);
      const pool = POOLS[pi];
      line += pool[Math.floor(rand() * pool.length)];
      poolRow.push(pi);
    }
    lines.push(line);
    poolGrid.push(poolRow);
  }
  return { text: lines.join("\n"), poolGrid };
}

function setupHover(preEl: HTMLPreElement, poolGrid: number[][]) {
  let origLines: string[] | null = null;
  let origGrid: string[][] | null = null;
  let mxC = -1000;
  let myC = -1000;
  const radius = 3.2;
  const cols = poolGrid[0] ? poolGrid[0].length : 1;
  const rows = poolGrid.length;
  const noise: number[][] = [];
  const hitTime: number[][] = [];
  const cellDuration: number[][] = [];

  for (let ny = 0; ny < rows; ny++) {
    const nr: number[] = [];
    const ht: number[] = [];
    const cd: number[] = [];
    for (let nx = 0; nx < cols; nx++) {
      const h =
        ((Math.sin(nx * 12.9898 + ny * 78.233) * 43758.5453) % 1 + 1) % 1;
      nr.push(h * 5 - 2.5);
      ht.push(0);
      cd.push(h > 0.5 ? 240 : 120);
    }
    noise.push(nr);
    hitTime.push(ht);
    cellDuration.push(cd);
  }

  let animating = false;
  let rafId: number | null = null;
  let lastDraw = 0;

  function initGrid() {
    origLines = preEl.textContent ? preEl.textContent.split("\n") : [];
    origGrid = origLines.map((l) => l.split(""));
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!origGrid) initGrid();
    const rect = preEl.getBoundingClientRect();
    const charW = rect.width / cols;
    const charH = rect.height / rows;
    mxC = (e.clientX - rect.left) / charW;
    myC = (e.clientY - rect.top) / charH;

    const now = performance.now();
    const maxR = radius + 3;
    const yMin = Math.max(0, Math.floor(myC - maxR));
    const yMax = Math.min(rows - 1, Math.ceil(myC + maxR));
    const xMin = Math.max(0, Math.floor(mxC - maxR));
    const xMax = Math.min(cols - 1, Math.ceil(mxC + maxR));

    for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
        const dx = x - mxC;
        const dy = y - myC;
        const threshold = radius + noise[y][x];
        if (dx * dx + dy * dy < threshold * threshold) {
          hitTime[y][x] = now;
        }
      }
    }
    if (!animating) {
      animating = true;
      tick();
    }
  };

  const onMouseLeave = () => {
    mxC = -1000;
    myC = -1000;
  };

  function tick(now = performance.now()) {
    rafId = null;
    if (now - lastDraw < 1000 / 30 - 1) {
      rafId = requestAnimationFrame(tick);
      return;
    }
    lastDraw = now;
    let anyActive = false;
    let html = "";

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const pi = poolGrid[y][x];
        if (pi < 0 || pi === 0) {
          html += " ";
          continue;
        }
        const elapsed = now - hitTime[y][x];
        if (hitTime[y][x] > 0 && elapsed < cellDuration[y][x]) {
          anyActive = true;
          const idx = POOLS.length - 1 - pi;
          const pool = POOLS[idx] || POOLS[0];
          const ch = pool[Math.floor(Math.random() * pool.length)];
          html += `<span class="${styles.activeCell}">${esc(ch)}</span>`;
        } else {
          html += esc(
            origGrid && origGrid[y] && origGrid[y][x] !== undefined
              ? origGrid[y][x]
              : " "
          );
        }
      }
      html += "\n";
    }

    preEl.innerHTML = html;

    if (anyActive) {
      rafId = requestAnimationFrame(tick);
    } else {
      animating = false;
      if (origLines) preEl.textContent = origLines.join("\n");
    }
  }

  preEl.addEventListener("mousemove", onMouseMove);
  preEl.addEventListener("mouseleave", onMouseLeave);

  return () => {
    preEl.removeEventListener("mousemove", onMouseMove);
    preEl.removeEventListener("mouseleave", onMouseLeave);
    if (rafId !== null) cancelAnimationFrame(rafId);
    if (origLines) preEl.textContent = origLines.join("\n");
  };
}

function RollingLink({
  text,
  href,
  className,
}: {
  text: string;
  href?: string;
  className?: string;
}) {
  const content = (
    <span className={styles.rollWrap}>
      {Array.from(text).map((ch, i) => {
        if (ch === " ") {
          return (
            <span key={i} style={{ width: "0.35em", display: "inline-block" }}>
              &nbsp;
            </span>
          );
        }
        return (
          <span
            key={i}
            className={styles.rollLetterWrap}
            style={{ "--char-i": i } as React.CSSProperties}
          >
            <span className={styles.rollTop}>{ch}</span>
            <span className={styles.rollBot}>{ch}</span>
          </span>
        );
      })}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${styles.navLink} ${className || ""}`}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <span className={`${styles.navText} ${className || ""}`}>{content}</span>
  );
}

export default function Contact() {
  const root = useRef<HTMLDivElement | null>(null);
  const revealerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const leftWrapRef = useRef<HTMLDivElement | null>(null);
  const rightWrapRef = useRef<HTMLDivElement | null>(null);
  const leftPreRef = useRef<HTMLPreElement | null>(null);
  const rightPreRef = useRef<HTMLPreElement | null>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const revealer = revealerRef.current;
      const footer = footerRef.current;
      const leftWrap = leftWrapRef.current;
      const rightWrap = rightWrapRef.current;
      const leftPre = leftPreRef.current;
      const rightPre = rightPreRef.current;

      if (!rootEl || !revealer || !footer) return;

      let hoverCleanups: (() => void)[] = [];
      const hands: { pre: HTMLPreElement; poolGrid: number[][] }[] = [];
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
      let visible = false;
      let loaded = false;
      let parallaxFrame: number | null = null;
      let disposed = false;

      const updateHover = () => {
        hoverCleanups.forEach((cleanup) => cleanup());
        hoverCleanups = [];
        if (visible && !document.hidden && !motionQuery.matches && pointerQuery.matches) {
          hoverCleanups = hands.map(({ pre, poolGrid }) => setupHover(pre, poolGrid));
        }
      };

      const loadHand = (src: string, pre: HTMLPreElement) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          if (disposed) return;
          const result = imageToAscii(img, 80);
          pre.textContent = result.text;
          hands.push({ pre, poolGrid: result.poolGrid });
          updateHover();
        };
        img.src = src;
      };

      const loadHands = () => {
        if (loaded) return;
        loaded = true;
        if (leftPre) loadHand("/hands/hand-left.png", leftPre);
        if (rightPre) loadHand("/hands/hand-right.png", rightPre);
      };
      const preloadObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          loadHands();
          preloadObserver.disconnect();
        }
      }, { rootMargin: "800px" });
      preloadObserver.observe(revealer);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (leftWrap && rightWrap) {
          gsap.fromTo(
            leftWrap,
            { xPercent: -100 },
            {
              xPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: revealer,
                start: "top 80%",
                end: "bottom bottom",
                scrub: true,
              },
            }
          );

          gsap.fromTo(
            rightWrap,
            { xPercent: 100 },
            {
              xPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: revealer,
                start: "top 80%",
                end: "bottom bottom",
                scrub: true,
              },
            }
          );
        }
      });

      let mx = 0;
      let my = 0;
      let sx = 0;
      let sy = 0;

      const onPointerMove = (e: MouseEvent) => {
        if (!visible || document.hidden || motionQuery.matches || !pointerQuery.matches) return;
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        if (parallaxFrame === null) parallaxFrame = requestAnimationFrame(parallaxTick);
      };

      let lastParallax = 0;
      const parallaxTick = (now: number) => {
        parallaxFrame = null;
        if (disposed || !visible || document.hidden || motionQuery.matches || !pointerQuery.matches) return;
        // Keep easing consistent on displays with different refresh rates.
        const delta = Math.min(64, lastParallax ? now - lastParallax : 16.7);
        lastParallax = now;
        const ease = 1 - Math.pow(0.95, delta / 16.7);
        sx += (mx - sx) * ease;
        sy += (my - sy) * ease;

        const lx = Math.min(0, sx * -15 - 15);
        const rx = Math.max(0, sx * 15 + 15);
        const py = sy * -10;

        if (leftPre) leftPre.style.transform = `translate(${lx}px, ${py}px)`;
        if (rightPre) rightPre.style.transform = `translate(${rx}px, ${py}px)`;

        if (Math.abs(mx - sx) > 0.001 || Math.abs(my - sy) > 0.001) {
          parallaxFrame = requestAnimationFrame(parallaxTick);
        } else {
          lastParallax = 0;
        }
      };

      const syncInteraction = () => {
        updateHover();
        if (parallaxFrame !== null) cancelAnimationFrame(parallaxFrame);
        parallaxFrame = null;
        lastParallax = 0;
        if (visible && !document.hidden && !motionQuery.matches && pointerQuery.matches) {
          parallaxFrame = requestAnimationFrame(parallaxTick);
        } else if (motionQuery.matches || !pointerQuery.matches) {
          if (leftPre) leftPre.style.transform = "";
          if (rightPre) rightPre.style.transform = "";
        }
      };
      // The footer is fixed behind the page, so observe its in-flow revealer.
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        syncInteraction();
      });
      observer.observe(revealer);
      footer.addEventListener("mousemove", onPointerMove, { passive: true });
      motionQuery.addEventListener("change", syncInteraction);
      pointerQuery.addEventListener("change", syncInteraction);
      document.addEventListener("visibilitychange", syncInteraction);

      return () => {
        disposed = true;
        observer.disconnect();
        preloadObserver.disconnect();
        mm.revert();
        footer.removeEventListener("mousemove", onPointerMove);
        motionQuery.removeEventListener("change", syncInteraction);
        pointerQuery.removeEventListener("change", syncInteraction);
        document.removeEventListener("visibilitychange", syncInteraction);
        if (parallaxFrame !== null) cancelAnimationFrame(parallaxFrame);
        hoverCleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: root }
  );

  return (
    <div ref={root} id="contact" className={styles.wrap}>
      <div ref={revealerRef} className={styles.revealer} aria-hidden="true" />

      <footer ref={footerRef} className={styles.footer} aria-label="Contact">
        <div className={styles.vignette} aria-hidden="true" />

        {/* 3-Column Top Navigation */}
        <nav className={styles.topNav} aria-label="Footer Navigation">
          <div className={styles.navCol}>
            <RollingLink
              text={PROFILE.email}
              href={`mailto:${PROFILE.email}`}
              className={styles.navEmail}
            />
            <RollingLink
              text={`© ${new Date().getFullYear()}`}
              className={styles.navDate}
            />
          </div>

          <div className={`${styles.navCol} ${styles.navColCenter}`}>
            <RollingLink
              text="GITHUB"
              href="https://github.com/parthsankhla"
            />
            <RollingLink text="LINKEDIN" href={PROFILE.linkedin} />
            <RollingLink text="BEHANCE" href="https://behance.net" />
          </div>

          <div className={`${styles.navCol} ${styles.navColRight}`}>
            <RollingLink text="WORK" href="#work" />
            <RollingLink text="PROOF" href="#proof" />
            <RollingLink text="CONTACT" href={`mailto:${PROFILE.email}`} />
          </div>
        </nav>

        {/* ASCII Art Hands Container */}
        <div className={styles.asciiWrap} aria-hidden="true">
          <div
            ref={leftWrapRef}
            className={`${styles.asciiCol} ${styles.asciiLeft}`}
          >
            <pre ref={leftPreRef} className={styles.asciiPre} />
          </div>
          <div
            ref={rightWrapRef}
            className={`${styles.asciiCol} ${styles.asciiRight}`}
          >
            <pre ref={rightPreRef} className={styles.asciiPre} />
          </div>
        </div>

        {/* Bottom Hero Typography */}
        <div className={styles.brandName} aria-hidden="true">
          <span className={styles.brandFirst}>{PROFILE.nameFirst}</span>
          <span className={styles.brandLastWrap}>
            <span className={styles.brandLast}>{PROFILE.nameLast}</span>
            <span className={styles.brandDot}>.</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
