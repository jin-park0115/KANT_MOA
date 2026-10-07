import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="KANT MOA 홈"
      className="group inline-flex items-center gap-2.5"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 44 42"
        className="size-10 overflow-visible drop-shadow-[0_5px_10px_rgba(117,219,211,0.25)] transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="moa-bubble" x1="7" y1="5" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9AF4E8" />
            <stop offset="0.48" stopColor="#66D8D3" />
            <stop offset="1" stopColor="#B9A7F8" />
          </linearGradient>
          <linearGradient id="moa-shimmer" x1="8" y1="9" x2="35" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.88" />
            <stop offset="1" stopColor="#FFD4EC" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <circle cx="20.5" cy="21" r="18" fill="url(#moa-bubble)" />
        <circle cx="34.5" cy="11" r="7.5" fill="#F7BFE0" fillOpacity="0.72" />
        <circle cx="37" cy="30" r="5" fill="#BFC5FF" fillOpacity="0.58" />
        <circle cx="8" cy="31" r="4.25" fill="#A8F2E6" fillOpacity="0.72" />
        <ellipse cx="14" cy="12" rx="6.5" ry="3.5" fill="url(#moa-shimmer)" transform="rotate(-28 14 12)" />
        <path
          d="M10.5 17v11.2c0 1.1.9 2 2 2s2-.9 2-2v-6.1l3.8 4.4a2.4 2.4 0 0 0 3.7 0l3.8-4.4v6.1c0 1.1.9 2 2 2s2-.9 2-2V17c0-1.2-.9-2.1-2.1-2.1-.6 0-1.2.3-1.6.7l-5.9 6.9-5.9-6.9a2.1 2.1 0 0 0-3.8 1.4Z"
          fill="white"
        />
        <circle cx="32" cy="8.5" r="1.4" fill="white" fillOpacity="0.9" />
      </svg>
      <span className="flex items-baseline text-[19px] font-extrabold leading-none tracking-[-0.045em]">
        KANT
        <span className="ml-1 bg-gradient-to-r from-[#39cdbb] via-[#64cbd8] to-[#a891ef] bg-clip-text text-transparent">MOA</span>
        <span className="ml-1 size-1.5 rounded-full bg-[#f6b9dc] shadow-[0_0_8px_2px_rgba(246,185,220,0.45)] transition-transform duration-500 group-hover:-translate-y-1" />
      </span>
    </Link>
  );
}
