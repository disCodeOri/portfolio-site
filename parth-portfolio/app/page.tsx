import Vinyl from "@/components/Vinyl";
import styles from "./page.module.css";

const highlights = [
  {
    index: "01",
    tag: "Triathlon",
    name: "International & National Racing",
    desc: "International racer in Nepal with the 2nd-fastest swim in the Indian contingent, competing at age 16 against athletes over 25 and on a bike purchased just two days before the race. Also raced IRONMAN 5150 Triathlon Chennai 2026, finishing 23rd in the 18-24 age category despite the run-bike-run format removing my strongest suit: swimming.",
    status: "International / 5150 / Nationals",
  },
  {
    index: "02",
    tag: "Triathlon",
    name: "Medals & Adversity",
    desc: "Telangana CM Cup silver medalist. Competed at the 37th National Games in Goa, where a jellyfish sting prevented me from completing the race.",
    status: "Silver Medalist",
  },
  {
    index: "03",
    tag: "Fundraising",
    name: "Habitat for Humanity Fundraiser",
    desc: "Raised INR 31,000 independently through door-to-door outreach, the highest amount raised by anyone in the program. The second-highest fundraiser raised INR 17,000.",
    status: "Top Fundraiser",
  },
  {
    index: "04",
    tag: "Fellowship",
    name: "Yale Entrepreneurial Society",
    desc: "Completed the Yale Entrepreneurial Society High School Fellowship on a full-ride scholarship.",
    status: "Full-Ride Scholar",
  },
  {
    index: "05",
    tag: "Readiness",
    name: "Callido College Readiness Skills",
    desc: "Placed in the top 25 percentile globally in the Callido college readiness skills program, with faculty sign-off from Brown University.",
    status: "Top 25% Globally",
  },
  {
    index: "06",
    tag: "Research Dev",
    name: "BITS Pilani Research Software",
    desc: "Software development and research intern for a postdoctoral researcher, building a custom application that will integrate into a device designed to significantly improve portability and reduce the cost of current industry solutions.",
    status: "Research Internship",
  },
  {
    index: "07",
    tag: "Analytics + AI",
    name: "BITSoM Certificate Program",
    desc: "Completed the BITSoM certificate program in Business Analytics and Agentic AI.",
    status: "Certificate Program",
  },
  {
    index: "08",
    tag: "Client Work",
    name: "Custom Software Services",
    desc: "Providing custom software services to clients. Currently building a rent management system for a property owner managing 27 properties across multiple locations, solving workflow problems that generalized platforms do not cater to.",
    status: "Client Build",
  },
];

export default function Home() {
  return (
    <>
      <a className={styles.skipLink} href="#highlights">
        Skip to highlights
      </a>
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.layout}>
        <main className={styles.main} id="main-content">

          {/* Left panel */}
          <aside className={styles.identity} aria-label="Profile summary">
            <div>
              <h1 className={styles.name}>
                Parth<br />
                <em>Sankhla</em>
              </h1>

              <div className={styles.descriptor}>
                <span>Software Developer</span>
                <span>Triathlete</span>
                <span>Builder</span>
              </div>

              <div className={styles.statusBlock}>
                <p className={styles.statusLabel}>Currently</p>
                <p className={styles.statusItem}><span>01</span>BITS Pilani — Research Dev</p>
                <p className={styles.statusItem}><span>02</span>Client Software — Rent Management</p>
                <p className={styles.statusItem}><span>03</span>Triathlon Training</p>
              </div>
            </div>

            <div>
              <Vinyl />
              <p className={styles.location}>Hyderabad, India</p>
            </div>
          </aside>

          {/* Highlights grid */}
          <section className={styles.projectsPanel} id="highlights" aria-labelledby="highlights-heading">
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>Selected work, sport, and leadership</p>
              <h2 id="highlights-heading">Highlights</h2>
            </div>
            {highlights.map((item) => (
              <article key={item.index} className={`${styles.projectCard} ${styles.projectCardStatic}`}>
                <div>
                  <div className={styles.projectTop}>
                    <span className={styles.projectIndex}>{item.index}</span>
                    <span className={styles.projectTag}>{item.tag}</span>
                  </div>
                  <h3 className={styles.projectName}>{item.name}</h3>
                  <p className={styles.projectDesc}>{item.desc}</p>
                </div>
                <div className={styles.projectFooter}>
                  <span className={styles.projectStatus}>{item.status}</span>
                </div>
              </article>
            ))}
          </section>

        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <span className={styles.footerLogo}>PS</span>
          <nav className={styles.footerNav} aria-label="Footer">
            <a href="https://www.linkedin.com/in/parth-sankhla/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="mailto:parth9102007@gmail.com">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}
