import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="KANT MOA 홈"
      className="group inline-flex shrink-0 items-center"
    >
      <Image
        src="/brand/kant-moa-bubble-logo-v2.png"
        alt="KANT MOA"
        width={2172}
        height={724}
        priority
        className="h-auto w-[150px] drop-shadow-[0_4px_8px_rgba(80,56,185,0.24)] transition-transform duration-500 group-hover:scale-[1.03] sm:w-[168px]"
      />
    </Link>
  );
}
