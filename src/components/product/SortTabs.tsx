import Link from "next/link";
import { buildListHref, SORT_OPTIONS, type ProductSort } from "./listParams";

interface SortTabsProps {
  basePath: string;
  current: ProductSort;
}

export function SortTabs({ basePath, current }: SortTabsProps) {
  return (
    <nav aria-label="정렬" className="flex gap-1">
      {SORT_OPTIONS.map((option) => {
        const active = option.value === current;
        return (
          <Link
            key={option.value}
            href={buildListHref(basePath, option.value)}
            scroll={false}
            aria-current={active ? "true" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${active ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
