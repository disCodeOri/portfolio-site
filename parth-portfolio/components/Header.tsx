"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./Header.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINKS = [
  { href: "#profile", label: "Profile" },
  { href: "#work", label: "Work" },
  { href: "#proof", label: "Proof" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const barRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const bar = barRef.current;
    if (!bar) return;

    ScrollTrigger.create({
      trigger: "footer",
      start: "top 80%",
      onEnter: () => gsap.to(bar, { opacity: 0, pointerEvents: "none", duration: 0.3 }),
      onLeaveBack: () => gsap.to(bar, { opacity: 1, pointerEvents: "auto", duration: 0.3 }),
    });
  });

  return (
    <header ref={barRef} className={styles.bar} aria-label="Site">
      <a className={styles.monogram} href="#top" aria-label="Back to top">
        PS
      </a>
      <nav className={styles.nav} aria-label="Sections">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className={styles.link}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
