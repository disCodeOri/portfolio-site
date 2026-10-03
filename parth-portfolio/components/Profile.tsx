"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";
import Vinyl from "./Vinyl";
import { CURRENTLY, STATEMENT } from "@/lib/content";
import { DUR, STAGGER } from "@/lib/motion";
import styles from "./Profile.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Profile() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          words,
          { opacity: 0.45 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 72%",
              end: "center 42%",
              scrub: true,
            },
          }
        );

        gsap.from("[data-row]", {
          autoAlpha: 0,
          y: 28,
          duration: DUR.base,
          stagger: STAGGER * 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-rows]",
            start: "top 82%",
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="profile"
      className={styles.section}
      aria-label="Profile"
    >
      <SectionHeading index="02" title="Profile" hint="Who is racing" />

      <p className={styles.statement}>
        {STATEMENT.split(" ").map((word, i) => (
          <span data-word key={`${word}-${i}`}>
            {word}{" "}
          </span>
        ))}
      </p>

      <div className={styles.grid} data-rows>
        <ol className={styles.rows} aria-label="Currently">
          {CURRENTLY.map((item) => (
            <li data-row key={item.index} className={styles.row}>
              <span className={styles.rowIndex}>{item.index}</span>
              <div>
                <h3 className={styles.rowTitle}>{item.title}</h3>
                <p className={styles.rowDetail}>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.aside}>
          <div className={styles.photoCard}>
            <div className={styles.photoFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/placeholders/profile-portrait.jpg"
                alt="Parth Sankhla training"
                className={styles.photoImg}
                loading="lazy"
                decoding="async"
              />
              <span className={`${styles.corner} ${styles.tl}`} />
              <span className={`${styles.corner} ${styles.tr}`} />
              <span className={`${styles.corner} ${styles.bl}`} />
              <span className={`${styles.corner} ${styles.br}`} />
              <div className={styles.photoBadge}>
                <span className={styles.badgeDot} />
                <span className={styles.badgeText}>HYD · BASE SEASON</span>
              </div>
            </div>
          </div>
          <Vinyl />
        </div>
      </div>
    </section>
  );
}
