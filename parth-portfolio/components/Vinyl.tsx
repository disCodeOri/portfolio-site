"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Vinyl.module.css";

gsap.registerPlugin(useGSAP);

export default function Vinyl() {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(`.${styles.disk}`, {
          rotation: 360,
          duration: 6,
          ease: "none",
          repeat: -1,
        });
      });
    },
    { scope: root, dependencies: [] }
  );

  return (
    <div ref={root} className={styles.wrap}>
      <span className={styles.label}>Listening to</span>
      <div className={styles.row}>
        <div className={styles.disk}>
          <div className={styles.center} />
        </div>
        <div className={styles.meta}>
          <span className={styles.title}>Teri Deewani</span>
          <span className={styles.artist}>Kailash Kher</span>
        </div>
      </div>
    </div>
  );
}
