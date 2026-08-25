"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";
import { PROOF_GROUPS } from "@/lib/content";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import styles from "./Proof.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Proof() {
  const root = useRef<HTMLElement | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-proof-row]", {
          autoAlpha: 0,
          y: 36,
          duration: DUR.base,
          stagger: STAGGER * 2,
          ease: EASE.out,
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        });
      });
    },
    { scope: root }
  );

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    const closing = openId;
    setOpenId(next);

    const animate = (el: HTMLElement, open: boolean) => {
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
            duration: DUR.base * 1.1,
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
          { height: 0, duration: DUR.base * 0.9, ease: EASE.inOut }
        );
      }
    };

    const rows = Array.from(
      root.current?.querySelectorAll<HTMLElement>("[data-proof-panel]") ?? []
    );
    for (const row of rows) {
      const rowId = row.getAttribute("data-proof-panel");
      if (!rowId) continue;
      if (rowId === closing && rowId !== next) animate(row, false);
      if (rowId === next) animate(row, true);
    }
  };

  return (
    <section
      ref={root}
      id="proof"
      className={styles.section}
      aria-label="Proof of work"
    >
      <SectionHeading index="04" title="Proof of Work" hint="Receipts" />

      <ul className={styles.list}>
        {PROOF_GROUPS.map((group) => {
          const open = openId === group.id;
          return (
            <li data-proof-row key={group.id} className={styles.item}>
              <button
                type="button"
                className={`${styles.rowBtn} ${open ? styles.rowBtnOpen : ""}`}
                aria-expanded={open}
                aria-controls={`proof-panel-${group.id}`}
                onClick={() => toggle(group.id)}
              >
                <span className={styles.index}>{group.index}</span>
                <span className={styles.titleWrap}>
                  <span className={`${styles.title} serif`}>{group.title}</span>
                  <span className={styles.summary}>{group.summary}</span>
                </span>
                <span className={styles.signal}>{group.signal}</span>
                <span className={styles.plus} aria-hidden="true">
                  +
                </span>
              </button>

              <div
                id={`proof-panel-${group.id}`}
                className={styles.panel}
                data-open={open || undefined}
                data-proof-panel={group.id}
              >
                <div className={styles.panelContent}>
                  {group.image && (
                    <div className={styles.proofCardVisual}>
                      <div className={styles.visualFrame}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={group.image}
                          alt={group.title}
                          className={styles.visualImg}
                        />
                        <span className={`${styles.corner} ${styles.tl}`} />
                        <span className={`${styles.corner} ${styles.tr}`} />
                        <span className={`${styles.corner} ${styles.bl}`} />
                        <span className={`${styles.corner} ${styles.br}`} />
                        <div className={styles.visualBadge}>
                          <span className={styles.badgeSignal}>{group.signal}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <ol className={styles.items}>
                    {group.items.map((item, i) => (
                      <li key={item.title} className={styles.entry}>
                        <div className={styles.entryHead}>
                          <span className={styles.entryIndex}>
                            {group.index}.{i + 1}
                          </span>
                          <h3 className={styles.entryTitle}>{item.title}</h3>
                        </div>
                        <p className={styles.entryBody}>{item.body}</p>
                        <span className={styles.entryMeta}>{item.meta}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
