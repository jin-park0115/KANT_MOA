import Link from "next/link";
import { AccountActions } from "./AccountActions";
import { CartIcon, SearchIcon } from "./Icons";
import { Logo } from "./Logo";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/artists", label: "아티스트" },
  { href: "/category/all", label: "상품" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-lg">
      <div className="content-shell flex h-16 items-center gap-6 md:h-[72px]">
        <Logo />
        <nav aria-label="주요 메뉴" className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => <Link key={item.href} href={item.href} className="text-sm font-semibold text-neutral-700 transition-colors hover:text-brand">{item.label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link href="/search" aria-label="검색" className="grid size-10 place-items-center rounded-full transition-colors hover:bg-neutral-100"><SearchIcon /></Link>
          <Link href="/cart" aria-label="장바구니" className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-neutral-100">
            <CartIcon />
            <span className="absolute right-0.5 top-0.5 grid size-[17px] place-items-center rounded-full bg-brand text-[10px] font-bold text-white">0</span>
          </Link>
          <AccountActions />
        </div>
      </div>
    </header>
  );
}
