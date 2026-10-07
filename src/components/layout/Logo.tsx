import Link from "next/link";
import styles from "./Logo.module.css";

export function Logo() {
  return (
    <Link href="/" aria-label="KANT MOA 홈" className={`${styles.link} group inline-flex items-center gap-2`}>
      <svg aria-hidden="true" viewBox="0 0 48 44" className="size-10 overflow-visible transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
        <defs>
          <radialGradient id="moa-balloon" cx="0" cy="0" r="1" gradientTransform="translate(14 10) rotate(48) scale(40)">
            <stop stopColor="#F5FFFF" />
            <stop offset="0.22" stopColor="#9CF2E5" />
            <stop offset="0.55" stopColor="#67D2D4" />
            <stop offset="0.8" stopColor="#9B8BE6" />
            <stop offset="1" stopColor="#E7ACD8" />
          </radialGradient>
          <linearGradient id="moa-gloss" x1="10" y1="6" x2="32" y2="31" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.94" />
            <stop offset="0.45" stopColor="white" stopOpacity="0.2" />
            <stop offset="1" stopColor="#D8C8FF" stopOpacity="0" />
          </linearGradient>
          <filter id="moa-soft-shadow" x="-40%" y="-40%" width="180%" height="190%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#8B7ED0" floodOpacity="0.3" />
          </filter>
        </defs>

        <g filter="url(#moa-soft-shadow)">
          <path d="M5.5 19.2C5.5 10.5 12.4 4 21 4c6.5 0 11.9 3.3 14.4 8.3 5.2.5 9.1 4.7 9.1 9.9 0 5.6-4.5 10.1-10.1 10.1h-.7A14.8 14.8 0 0 1 21 39.7c-8.3 0-15-6.7-15-15 0-1.9.3-3.7 1-5.3-.5 0-1-.1-1.5-.2Z" fill="url(#moa-balloon)" stroke="#D9D3FF" strokeWidth="1.2" />
          <path d="M10.6 15.5c1.7-5.1 6-8.1 10.8-8.1 3 0 5.3.9 7 2.3" stroke="url(#moa-gloss)" strokeWidth="4" strokeLinecap="round" />
          <path d="M11.5 17.2v11c0 1.2.9 2.1 2.1 2.1 1.1 0 2-.9 2-2.1v-5.7l3.7 4.2a2.7 2.7 0 0 0 4 0l3.7-4.2v5.7c0 1.2.9 2.1 2.1 2.1 1.1 0 2-.9 2-2.1v-11c0-1.2-.9-2.2-2.1-2.2-.6 0-1.2.3-1.7.8l-6 6.8-6-6.8a2.1 2.1 0 0 0-3.8 1.4Z" fill="white" fillOpacity="0.92" stroke="#FFFFFF" strokeWidth="0.5" />
        </g>

        <circle cx="39.5" cy="6.5" r="3.2" fill="#D9D2FF" fillOpacity="0.72" stroke="white" strokeWidth="0.9" />
        <circle cx="44" cy="14" r="1.5" fill="#A8F0E6" stroke="white" strokeWidth="0.6" />
        <circle cx="5" cy="34" r="2.3" fill="#EDC1E1" fillOpacity="0.8" stroke="white" strokeWidth="0.8" />
        <circle cx="38.6" cy="5.6" r="0.8" fill="white" />
      </svg>

      <span className="inline-flex items-center">
        <span className={styles.wordmark}>KANT MOA</span>
        <span className={styles.dot} aria-hidden="true" />
      </span>
    </Link>
  );
}
