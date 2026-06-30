"use client";

import styles from "./Vinyl.module.css";

export default function Vinyl() {
  return (
    <div className={styles.vinylSection}>
      <span className={styles.vinylLabel}>Listening to</span>
      <div className={styles.vinylRow}>
        <div className={styles.vinylOuter}>
          <div className={styles.vinylDisk}>
            <div className={styles.vinylCenter} />
          </div>
          <svg
            className={styles.needle}
            viewBox="0 0 40 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="34" cy="5" r="4" fill="#444" stroke="#555" strokeWidth="0.5" />
            <line x1="34" y1="9" x2="16" y2="40" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="15" cy="41" r="2.5" fill="#777" />
          </svg>
        </div>
        <div className={styles.songMeta}>
          <span className={styles.songTitle}>Teri Deewani</span>
          <span className={styles.songArtist}>Kailash Kher</span>
        </div>
      </div>
    </div>
  );
}
