"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductSummary } from "@/types/app";
import { formatPrice } from "./formatPrice";
import { ProductImage } from "./ProductImage";

const pad = (n: number) => String(n).padStart(2, "0");

// 메인 상단 전체 폭 배너 (위버스샵 메인 상단 참고). 최신 상품을 한 장씩 넘겨 보여줍니다.
export function MainHeroCarousel({ products }: { products: ProductSummary[] }) {
  const [index, setIndex] = useState(0);
  const product = products[index];
  const count = products.length;
  const move = (step: number) => setIndex((current) => (current + step + count) % count);
  const arrowClass = "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-xl text-white transition-colors hover:bg-black/50 md:grid";

  return (
    <section aria-roledescription="carousel" aria-label="추천 굿즈" className="bg-neutral-500">
      <div className="content-shell relative py-6 md:py-8">
        <Link href={`/products/${product.id}`} className="group grid items-center gap-5 md:grid-cols-2 md:gap-10 md:px-14">
          <ProductImage
            src={product.thumbnailUrl}
            alt={`${product.artist.name} ${product.name}`}
            sizes="(min-width: 768px) 40vw, 100vw"
            eager
            className="aspect-4/3 rounded-lg"
          />
          <div className="text-white">
            <p className="text-sm font-bold opacity-80">{product.artist.name}</p>
            <h2 className="mt-1 text-2xl font-black leading-snug md:text-4xl">{product.name}</h2>
            <p className="mt-2 text-sm opacity-80">
              {product.category.name} · {formatPrice(product.price)}
            </p>
          </div>
        </Link>

        {count > 1 && (
          <>
            <button type="button" aria-label="이전 배너" onClick={() => move(-1)} className={`${arrowClass} left-0`}>‹</button>
            <button type="button" aria-label="다음 배너" onClick={() => move(1)} className={`${arrowClass} right-0`}>›</button>
            <div className="mt-5 flex items-center gap-3 md:absolute md:bottom-8 md:left-1/2 md:mt-0 md:ml-10">
              <div className="flex gap-1" aria-hidden="true">
                {products.map((item, i) => (
                  <span key={item.id} className={`h-0.5 w-4 rounded-full ${i === index ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
              <p className="rounded-full bg-black/30 px-2.5 py-0.5 text-xs tabular-nums" aria-live="polite">
                <span className="font-bold text-white">{pad(index + 1)}</span>
                <span className="mx-1 text-white/50" aria-hidden="true">|</span>
                <span className="text-white/70">{pad(count)}</span>
              </p>
              <div className="flex gap-1 md:hidden">
                <button type="button" aria-label="이전 배너" onClick={() => move(-1)} className="grid size-8 place-items-center rounded-full bg-black/30 text-white">‹</button>
                <button type="button" aria-label="다음 배너" onClick={() => move(1)} className="grid size-8 place-items-center rounded-full bg-black/30 text-white">›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
