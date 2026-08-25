"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./StartupIntro.module.css";

gsap.registerPlugin(useGSAP);

interface StartupIntroProps {
  onComplete?: () => void;
}

export default function StartupIntro({ onComplete }: StartupIntroProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const microLogoRef = useRef<HTMLDivElement | null>(null);
  const microTextRef = useRef<HTMLDivElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Lock scroll during startup sequence
    document.body.style.overflow = "hidden";
    if (window.__lenis) {
      window.__lenis.stop();
    }

    // Expose replay function for debugging / interactive triggering
    window.__replayStartupIntro = () => {
      if (root.current) {
        root.current.style.display = "grid";
        gsap.set(root.current, { autoAlpha: 1 });
      }
      if (microLogoRef.current) {
        gsap.set(microLogoRef.current, { autoAlpha: 1, scale: 1 });
      }
      if (microTextRef.current) {
        gsap.set(microTextRef.current, { yPercent: 120, autoAlpha: 0 });
      }
      if (curtainRef.current) {
        gsap.set(curtainRef.current, { scaleY: 0, transformOrigin: "bottom center" });
      }
      timelineRef.current?.restart();
    };

    return () => {
      document.body.style.overflow = "";
      if (window.__lenis) {
        window.__lenis.start();
      }
      delete window.__replayStartupIntro;
    };
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        document.body.style.overflow = "";
        if (window.__lenis) window.__lenis.start();
        if (root.current) {
          root.current.style.display = "none";
        }
        onComplete?.();
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          document.body.style.overflow = "";
          if (window.__lenis) {
            window.__lenis.start();
          }
          if (root.current) {
            root.current.style.display = "none";
          }
          onComplete?.();
        },
      });
      timelineRef.current = tl;
      (window as any).__introTimeline = tl;

      // 1. Initial State
      tl.set(root.current, { autoAlpha: 1, display: "grid" }, 0);
      tl.set(curtainRef.current, { scaleY: 0, transformOrigin: "bottom center" }, 0);
      tl.set(microLogoRef.current, { autoAlpha: 1, scale: 1 }, 0);
      tl.set(microTextRef.current, { yPercent: 120, autoAlpha: 0 }, 0);

      // 2. Micro-logo reveal (masked vertical wipe)
      tl.to(microTextRef.current, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.65,
        ease: "power4.out",
      }, 0.2);

      // Subtle hold / micro-scale
      tl.to(microLogoRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: "power2.out",
      }, 0.65);

      // 3. Flash Curtain Wipe (electric vermilion expands from bottom to top)
      tl.to(curtainRef.current, {
        scaleY: 1,
        duration: 0.48,
        ease: "power4.inOut",
      }, 0.95);

      // Hide micro logo while under the curtain
      tl.set(microLogoRef.current, { autoAlpha: 0 }, 1.3);

      // Curtain collapses towards top to reveal hero section
      tl.to(curtainRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.52,
        ease: "power4.inOut",
      }, 1.35);

      // 4. Fade out overlay root completely
      tl.to(root.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.out",
      }, 1.65);
    },
    { scope: root }
  );

  return (
    <div ref={root} className={styles.introOverlay} aria-hidden="true">
      {/* Centered micro-brand mark */}
      <div ref={microLogoRef} className={styles.microWrap}>
        <div className={styles.microMask}>
          <div ref={microTextRef} className={styles.microText}>
            <span className={styles.nameFirst}>Parth</span>{" "}
            <span className={styles.nameLast}>
              Sankhla<span className={styles.dot}>.</span>
            </span>
          </div>
        </div>
      </div>

      {/* Solid Vermilion Curtain Flash */}
      <div ref={curtainRef} className={styles.curtain} />
    </div>
  );
}
