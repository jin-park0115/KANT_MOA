import Image from "next/image";
import type { Artist } from "@/types/app";
import { artistThemeStyle } from "./artistTheme";

export function ArtistHero({ artist }: { artist: Artist }) {
  return (
    <section
      aria-label={`${artist.name} 소개`}
      style={artistThemeStyle(artist.themeColor)}
      className="relative isolate h-72 overflow-hidden bg-linear-to-br from-(--artist-color) to-foreground md:h-96"
    >
      {artist.heroImageUrl && (
        <Image
          src={artist.heroImageUrl}
          alt={`${artist.name} 대표 이미지`}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="-z-10 object-cover object-center"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/70 via-black/20 to-transparent" aria-hidden="true" />
      <div className="content-shell flex h-full flex-col justify-end pb-8 text-white md:pb-12">
        <p className="text-sm font-semibold opacity-80">{artist.nameKo}</p>
        <h1 className="mt-1 text-4xl font-black tracking-tight md:text-6xl">{artist.name}</h1>
      </div>
    </section>
  );
}
