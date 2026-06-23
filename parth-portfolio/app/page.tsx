import AchievementFlow from "@/components/AchievementFlow";
import Vinyl from "@/components/Vinyl";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <a className={styles.skipLink} href="#highlights">
        Skip to highlights
      </a>
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.layout}>
        <main className={styles.main} id="main-content">
          <aside className={styles.identity} aria-label="Profile summary">
            <div>
              <h1 className={styles.name}>
                Parth
                <br />
                <em>Sankhla</em>
              </h1>

              <div className={styles.descriptor}>
                <span>Software Developer</span>
                <span>Triathlete</span>
                <span>Builder</span>
              </div>

              <div className={styles.statusBlock}>
                <p className={styles.statusLabel}>Currently</p>
                <p className={styles.statusItem}>
                  <span>01</span>BITS Pilani - Research Dev
                </p>
                <p className={styles.statusItem}>
                  <span>02</span>Client Software - Rent Management
                </p>
                <p className={styles.statusItem}>
                  <span>03</span>Triathlon Training
                </p>
              </div>
            </div>

            <div>
              <Vinyl />
              <p className={styles.location}>Hyderabad, India</p>
            </div>
          </aside>

          <AchievementFlow />
        </main>

        <footer className={styles.footer}>
          <span className={styles.footerLogo}>PS</span>
          <nav className={styles.footerNav} aria-label="Footer">
            <a href="https://www.linkedin.com/in/parth-sankhla/" target="_blank" rel="noopener noreferrer"> LinkedIn </a>
            <a href="mailto:parth9102007@gmail.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}
