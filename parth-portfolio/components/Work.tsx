"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";
import { PROJECTS } from "@/lib/content";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import styles from "./Work.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Work() {
  const root = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [openId, setOpenId] = useState<string | null>(PROJECTS[0].id);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const activeId = hoverId ?? PROJECTS[0].id;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-project-row]", {
          autoAlpha: 0,
          y: 40,
          duration: DUR.base,
          stagger: STAGGER * 2,
          ease: EASE.out,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
      });

      // Reduced motion: panels snap without animation.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        for (const [id, panel] of Object.entries(panelRefs.current)) {
          if (panel) panel.style.height = openId === id ? "auto" : "0px";
        }
      });
      // Cursor-following preview card — pointer devices with room, only.
      mm.add("(hover: hover) and (min-width: 901px)", () => {
        const preview = previewRef.current;
        if (!preview || !listRef.current) return;

        gsap.set(preview, { xPercent: -50, yPercent: -50 });
        const xTo = gsap.quickTo(preview, "x", { duration: 0.45, ease: EASE.out });
        const yTo = gsap.quickTo(preview, "y", { duration: 0.45, ease: EASE.out });

        const move = (event: MouseEvent) => {
          const host = listRef.current;
          if (!host) return;
          const rect = host.getBoundingClientRect();
          xTo(event.clientX - rect.left);
          yTo(event.clientY - rect.top);
        };
        const enter = () => gsap.to(preview, { autoAlpha: 1, scale: 1, duration: DUR.fast, ease: EASE.out });
        const leave = () => gsap.to(preview, { autoAlpha: 0, scale: 0.9, duration: DUR.fast, ease: EASE.inOut });

        const list = listRef.current;
        list.addEventListener("mousemove", move);
        list.addEventListener("mouseenter", enter);
        list.addEventListener("mouseleave", leave);
        return () => {
          list.removeEventListener("mousemove", move);
          list.removeEventListener("mouseenter", enter);
          list.removeEventListener("mouseleave", leave);
        };
      });
    },
    { scope: root }
  );

  const toggleOpen = (id: string) => {
    const next = openId === id ? null : id;
    const closing = openId;
    setOpenId(next);

    const animate = (el: HTMLDivElement, open: boolean) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.height = open ? "auto" : "0px";
        return;
      }
      if (open) {
        gsap.fromTo(
          el,
          { height: 0 },
          {
            height: el.scrollHeight,
            duration: DUR.base,
            ease: EASE.inOut,
            onComplete: () => {
              el.style.height = "auto";
            },
          }
        );
      } else {
        gsap.fromTo(
          el,
          { height: el.scrollHeight },
          { height: 0, duration: DUR.base, ease: EASE.inOut }
        );
      }
    };

    if (closing && closing !== next) {
      const panel = panelRefs.current[closing];
      if (panel) animate(panel, false);
    }
    if (next) {
      const panel = panelRefs.current[next];
      if (panel) animate(panel, true);
    }
  };

  return (
    <section
      ref={root}
      id="work"
      className={styles.section}
      aria-label="Selected work"
    >
      <SectionHeading index="03" title="Selected Work" hint="Things shipped" />

      <div className={styles.stage}>
        <ul ref={listRef} className={styles.list}>
          {PROJECTS.map((project) => {
            const open = openId === project.id;
            return (
              <li data-project-row key={project.id} className={styles.item}>
                <button
                  type="button"
                  className={`${styles.rowBtn} ${open ? styles.rowBtnOpen : ""}`}
                  aria-expanded={open}
                  aria-controls={`project-panel-${project.id}`}
                  onMouseEnter={() => setHoverId(project.id)}
                  onFocus={() => setHoverId(project.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onBlur={() => setHoverId(null)}
                  onClick={() => toggleOpen(project.id)}
                >
                  <span className={styles.index}>{project.index}</span>
                  <span className={`${styles.name} serif`}>{project.name}</span>
                  <span className={styles.meta}>
                    <span>{project.tag}</span>
                    <span className={styles.year}>{project.year}</span>
                  </span>
                  <span className={styles.plus} aria-hidden="true">
                    +
                  </span>
                </button>

                <div
                  id={`project-panel-${project.id}`}
                  className={styles.panel}
                  data-open={open || undefined}
                  ref={(el) => {
                    panelRefs.current[project.id] = el;
                  }}
                >
                  <div className={styles.panelInner}>
                    <div className={styles.panelTile}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={project.name}
                        className={styles.panelImg}
                      />
                      <span className={`${styles.corner} ${styles.tl}`} />
                      <span className={`${styles.corner} ${styles.tr}`} />
                      <span className={`${styles.corner} ${styles.bl}`} />
                      <span className={`${styles.corner} ${styles.br}`} />
                    </div>
                    <div className={styles.panelCopy}>
                      <p className={styles.blurb}>{project.blurb}</p>
                      {project.link ? (
                        <a
                          className={styles.panelLink}
                          href={project.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.link.label} ↗
                        </a>
                      ) : (
                        <span className={styles.panelNote}>
                          Private client build — details on request.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Floating preview (desktop pointer only) */}
        <div ref={previewRef} className={styles.preview} aria-hidden="true">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className={styles.previewTile}
              data-active={activeId === project.id || undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.name}
                className={styles.previewImg}
              />
              <div className={styles.previewOverlay} />
              <span className={`${styles.corner} ${styles.tl}`} />
              <span className={`${styles.corner} ${styles.tr}`} />
              <span className={`${styles.corner} ${styles.bl}`} />
              <span className={`${styles.corner} ${styles.br}`} />
              <div className={styles.previewMeta}>
                <span className={styles.previewIndex}>{project.index}</span>
                <span className={styles.previewTag}>{project.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
