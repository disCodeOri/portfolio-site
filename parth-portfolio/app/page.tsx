import Vinyl from "@/components/Vinyl";
import styles from "./page.module.css";

const projects = [
  {
    index: "01",
    tag: "Research",
    name: "BITS Pilani Diagnostic Software",
    desc: "Point-of-Care diagnostic application built for a Raspberry Pi 5. Handles automated well detection, real-time intensity plotting, and multi-format data export for biomedical research labs.",
    status: "Patent Pending",
    statusLive: false,
    href: null,
    linkLabel: null,
  },
  {
    index: "02",
    tag: "Product",
    name: "OakMBac",
    desc: "In-house alternative to ManageBac, the school management platform used across the Nord Anglia international school network. Leading a team of four developers from architecture to deployment.",
    status: "In Development",
    statusLive: false,
    href: null,
    linkLabel: null,
  },
  {
    index: "03",
    tag: "Full Stack",
    name: "Zariya",
    desc: "Full-stack e-commerce platform for a sustainable fashion brand. Handles payments, order management, and dynamic inventory. Built solo and deployed to production.",
    status: "Live",
    statusLive: true,
    href: "https://zariya-one.vercel.app",
    linkLabel: "Visit Site →",
  },
  {
    index: "04",
    tag: "Application",
    name: "IBDP SIMS",
    desc: "Student Information Management System built as an IBDP Computer Science Internal Assessment. Assessed at grade 7 equivalent. Scope described by my teacher as requiring four to five developers.",
    status: "IBDP CS IA — Grade 7",
    statusLive: false,
    href: "https://github.com/disCodeOri/IBDP-SIMS",
    linkLabel: "View on GitHub →",
  },
];

export default function Home() {
  return (
    <>
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.layout}>
        <main className={styles.main}>

          {/* Left panel */}
          <aside className={styles.identity}>
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
                <p className={styles.statusItem}><span>02</span>OakMBac — Team Lead</p>
                <p className={styles.statusItem}><span>03</span>Triathlon Training</p>
              </div>
            </div>

            <div>
              <Vinyl />
              <p className={styles.location}>Hyderabad, India</p>
            </div>
          </aside>

          {/* Projects grid */}
          <section className={styles.projectsPanel}>
          {projects.map((p) => {
            const isLink = !!p.href;
            const Tag = isLink ? "a" : "div";
            const tagProps = isLink
              ? {
                  href: p.href as string,
                  target: p.href!.startsWith("http") ? "_blank" : undefined,
                  rel: p.href!.startsWith("http") ? "noopener noreferrer" : undefined,
                }
              : {};

            return (
              <Tag
                key={p.index}
                className={`${styles.projectCard} ${!isLink ? styles.projectCardStatic : ""}`}
                {...(tagProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
              >
                <div>
                  <div className={styles.projectTop}>
                    <span className={styles.projectIndex}>{p.index}</span>
                    <span className={styles.projectTag}>{p.tag}</span>
                  </div>
                  <h2 className={styles.projectName}>{p.name}</h2>
                  <p className={styles.projectDesc}>{p.desc}</p>
                </div>
                <div className={styles.projectFooter}>
                  <span className={`${styles.projectStatus} ${p.statusLive ? styles.live : ""}`}>
                    {p.status}
                  </span>
                  {p.linkLabel && (
                    <span className={styles.projectLink}>{p.linkLabel}</span>
                  )}
                </div>
              </Tag>
            );
          })}
          </section>

        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <span className={styles.footerLogo}>PS</span>
          <nav className={styles.footerNav}>
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
