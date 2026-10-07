import Link from "next/link";
import { AccountActions } from "./AccountActions";
import { CartIcon } from "./Icons";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-lg">
      <div className="content-shell flex h-16 items-center gap-6 md:h-[72px]">
        <Logo />
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link href="/cart" aria-label="장바구니" className="brand-gradient-icon-hover relative grid size-10 place-items-center rounded-full">
            <CartIcon />
            <span className="absolute right-0.5 top-0.5 grid size-[17px] place-items-center rounded-full bg-brand text-[10px] font-bold text-white">0</span>
          </Link>
          <AccountActions />
        </div>
      </div>
    </header>
  );
}
