import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArtistBanners, ArtistBannersSkeleton } from "@/components/product/ArtistBanners";
import type { SearchParams } from "@/components/product/listParams";
import { LoadError } from "@/components/product/LoadError";
import { ProductGridSkeleton } from "@/components/product/ProductGrid";
import { ProductListSection } from "@/components/product/ProductListSection";
import { getArtist } from "@/services/products";
import type { Artist } from "@/types/app";

interface ArtistPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export default function ArtistPage({ params, searchParams }: ArtistPageProps) {
  return (
    <Suspense fallback={<ArtistPageSkeleton />}>
      <ArtistContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function ArtistContent({ params, searchParams }: ArtistPageProps) {
  const { slug } = await params;

  let artist: Artist | null;
  try {
    artist = await getArtist(slug);
  } catch (error) {
    return (
      <div className="content-shell py-8 md:py-12">
        <LoadError error={error} retryHref={`/artists/${slug}`} />
      </div>
    );
  }
  if (!artist) notFound();

  return (
    <div className="content-shell py-6 md:py-10">
      <h1 className="sr-only">{artist.name}</h1>
      <Suspense fallback={<ArtistBannersSkeleton />}>
        <ArtistBanners artist={artist} />
      </Suspense>
      <section id="artist-products" aria-label={`${artist.name} 굿즈`} className="mt-12 scroll-mt-24">
        <h2 className="mb-6 text-xl font-black md:text-2xl">{artist.name} 굿즈</h2>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductListSection filter={{ artistSlug: artist.slug }} basePath={`/artists/${artist.slug}`} searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}

function ArtistPageSkeleton() {
  return (
    <div className="content-shell py-6 md:py-10">
      <ArtistBannersSkeleton />
      <div className="mt-12">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
