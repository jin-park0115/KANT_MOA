"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";

export type ArtistBanner = {
  key: string;
  href: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  imageAlt: string;
  variant: "cover" | "product"; // cover: 배경 꽉 채움, product: 오른쪽에 상품 이미지
};

interface ArtistBannerCarouselProps {
  banners: ArtistBanner[];
  themeStyle: CSSProperties;
}

// 위버스샵 아티스트 상단처럼 배너 2개씩 보이는 캐러셀 (모바일은 1개)
export function ArtistBannerCarousel({ banners, themeStyle }: ArtistBannerCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  function handleScroll() {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    setActive(Math.round(track.scrollLeft / first.offsetWidth));
  }

  function handleMove(direction: 1 | -1) {
    trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth, behavior: "smooth" });
  }

  const arrowClass = "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white text-lg shadow-card md:grid";

  return (
    <section aria-label="아티스트 배너" className="relative" style={themeStyle}>
      <ul ref={trackRef} onScroll={handleScroll} className="-mx-2 flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none]">
        {banners.map((banner) => (
          <li key={banner.key} className="shrink-0 basis-full snap-start px-2 md:basis-1/2">
            <BannerCard banner={banner} />
          </li>
        ))}
      </ul>
      {banners.length > 2 && (
        <>
          <button type="button" aria-label="이전 배너" onClick={() => handleMove(-1)} className={`${arrowClass} -left-5`}>‹</button>
          <button type="button" aria-label="다음 배너" onClick={() => handleMove(1)} className={`${arrowClass} -right-5`}>›</button>
        </>
      )}
      {banners.length > 1 && (
        <div className="mt-4 flex justify-center gap-1" aria-hidden="true">
          {banners.map((banner, index) => (
            <span key={banner.key} className={`h-0.5 w-6 rounded-full ${index === active ? "bg-foreground" : "bg-line"}`} />
          ))}
        </div>
      )}
    </section>
  );
}

function BannerCard({ banner }: { banner: ArtistBanner }) {
  return (
    <Link href={banner.href} className="group relative isolate flex aspect-video items-end overflow-hidden rounded-lg bg-linear-to-br from-(--artist-color) to-foreground p-6 text-white md:p-8">
      {banner.imageUrl && banner.variant === "cover" && (
        <Image src={banner.imageUrl} alt={banner.imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" loading="eager" className="-z-10 object-cover" />
      )}
      {banner.imageUrl && banner.variant === "product" && (
        <div className="absolute inset-y-6 right-6 -z-10 aspect-square overflow-hidden rounded-md bg-white shadow-card md:inset-y-8 md:right-8">
          <Image src={banner.imageUrl} alt={banner.imageAlt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/60 via-black/10 to-transparent" aria-hidden="true" />
      <div className="w-3/5">
        <h2 className="text-xl font-black leading-snug md:text-2xl">{banner.title}</h2>
        <p className="mt-1.5 text-sm opacity-90">{banner.subtitle}</p>
      </div>
    </Link>
  );
}
