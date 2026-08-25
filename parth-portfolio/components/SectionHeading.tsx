import styles from "./SectionHeading.module.css";

type Props = {
  index: string;
  title: string;
  hint?: string;
};

/** Eyebrow + title block shared by every major section (3 call sites). */
export default function SectionHeading({ index, title, hint }: Props) {
  return (
    <div className={styles.wrap} data-section-head>
      <div className={styles.row}>
        <span className={styles.index}>{index}</span>
        <span className={styles.label}>{hint}</span>
        <span className={styles.rule} aria-hidden="true" />
      </div>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
