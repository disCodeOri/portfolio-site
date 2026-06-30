"use client";

import { useEffect, useState } from "react";
import styles from "./Vinyl.module.css";

type ListeningTrack = {
  albumImageUrl: string | null;
  artist: string;
  id: string;
  isPlaying: boolean;
  source: "live" | "playlist" | "unconfigured" | "error";
  title: string;
  url: string | null;
};

const initialTrack: ListeningTrack = {
  albumImageUrl: null,
  artist: "Connecting to Spotify",
  id: "loading",
  isPlaying: false,
  source: "playlist",
  title: "Acquiring signal",
  url: null,
};

export default function Vinyl() {
  const [track, setTrack] = useState<ListeningTrack>(initialTrack);

  useEffect(() => {
    let isMounted = true;

    const loadTrack = async () => {
      try {
        const response = await fetch("/api/listening", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Listening route failed with ${response.status}`);
        }

        const nextTrack = (await response.json()) as ListeningTrack;
        if (isMounted) {
          setTrack(nextTrack);
        }
      } catch {
        if (isMounted) {
          setTrack({
            albumImageUrl: null,
            artist: "Spotify uplink unavailable",
            id: "client-error",
            isPlaying: false,
            source: "error",
            title: "Signal interrupted",
            url: null,
          });
        }
      }
    };

    loadTrack();
    const interval = window.setInterval(loadTrack, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const statusLabel =
    track.source === "live"
      ? "Now transmitting"
      : track.source === "playlist"
        ? "Playlist fallback"
        : "Signal status";
  const content = (
    <>
      <div className={styles.pulseCore} aria-hidden="true">
        <div className={styles.coreFace}>
          {track.albumImageUrl ? (
            <img className={styles.albumImage} src={track.albumImageUrl} alt="" />
          ) : null}
          <span className={styles.coreRing} />
          <span className={styles.coreDot} />
        </div>
        <span className={styles.coreGlow} />
      </div>
      <div className={styles.songMeta}>
        <span className={styles.signalLabel}>{statusLabel}</span>
        <span className={styles.songTitle}>{track.title}</span>
        <span className={styles.songArtist}>{track.artist}</span>
        <span className={styles.equalizer} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} />
          ))}
        </span>
      </div>
    </>
  );

  return (
    <div className={styles.vinylSection}>
      <span className={styles.vinylLabel}>Listening to</span>
      {track.url ? (
        <a className={styles.vinylRow} href={track.url} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <div className={styles.vinylRow}>{content}</div>
      )}
    </div>
  );
}
