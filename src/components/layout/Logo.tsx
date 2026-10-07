import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" aria-label="KANT MOA 홈" className="group inline-flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-[11px] bg-brand text-sm font-black tracking-[-0.08em] text-white transition-transform group-hover:-rotate-6">KM</span>
      <span className="text-[19px] font-black tracking-[-0.055em]">KANT <span className="text-brand">MOA</span></span>
    </Link>
  );
}
