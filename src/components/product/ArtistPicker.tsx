"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchIcon } from "@/components/layout/Icons";
import { Input, Modal } from "@/components/ui";
import type { Artist } from "@/types/app";
import { ArtistLogo } from "./ArtistLogo";

// 메인 "Recommended Artist": 로고를 누르면 아티스트 굿즈 페이지로, 검색 버튼은 아티스트 검색 창을 엽니다.
export function ArtistPicker({ artists }: { artists: Artist[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const keyword = query.trim().toLowerCase();
  const results = keyword
    ? artists.filter((artist) => [artist.name, artist.nameKo, artist.slug].some((text) => text.toLowerCase().includes(keyword)))
    : artists;

  function handleClose() {
    setOpen(false);
    setQuery("");
  }

  return (
    <section aria-labelledby="recommended-artist" className="rounded-lg bg-white p-4 shadow-card md:p-5">
      <h2 id="recommended-artist" className="text-lg font-black">Recommended Artist</h2>
      <ul className="-mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-1">
        {artists.map((artist) => (
          <li key={artist.id} className="w-20 shrink-0">
            <Link href={`/artists/${artist.slug}`} className="group flex flex-col items-center gap-2 text-center">
              <span className="transition-transform group-hover:-translate-y-0.5">
                <ArtistLogo artist={artist} />
              </span>
              <span className="text-xs font-semibold leading-4 text-foreground">{artist.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-line text-sm font-bold transition-colors hover:border-neutral-400"
      >
        <SearchIcon className="size-4" />
        아티스트
      </button>

      <Modal open={open} onClose={handleClose} title="아티스트 검색">
        <Input
          name="artist-search"
          label="아티스트 이름"
          placeholder="예: ORBIT:ON, 오르빗온"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
        {results.length === 0 ? (
          <p className="mt-6 text-center text-sm text-muted">검색 결과가 없어요.</p>
        ) : (
          <ul className="mt-4 max-h-80 divide-y divide-line overflow-y-auto">
            {results.map((artist) => (
              <li key={artist.id}>
                <Link href={`/artists/${artist.slug}`} onClick={handleClose} className="flex items-center gap-3 py-3 hover:bg-neutral-50">
                  <ArtistLogo artist={artist} size="sm" />
                  <span className="text-foreground">
                    <span className="block text-sm font-bold">{artist.name}</span>
                    <span className="block text-xs text-muted">{artist.nameKo}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </section>
  );
}
