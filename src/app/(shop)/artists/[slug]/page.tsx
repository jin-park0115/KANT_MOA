import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArtistHero } from "@/components/product/ArtistHero";
import type { SearchParams } from "@/components/product/listParams";
import { LoadError } from "@/components/product/LoadError";
import { ProductGridSkeleton } from "@/components/product/ProductGrid";
import { ProductListSection } from "@/components/product/ProductListSection";
import { Skeleton } from "@/components/ui";
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
    <>
      <ArtistHero artist={artist} />
      <div className="content-shell py-8 md:py-12">
        <h2 className="mb-6 text-xl font-black md:text-2xl">{artist.name} 굿즈</h2>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductListSection filter={{ artistSlug: artist.slug }} basePath={`/artists/${artist.slug}`} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

function ArtistPageSkeleton() {
  return (
    <>
      <Skeleton className="h-72 w-full rounded-none md:h-96" />
      <div className="content-shell py-8 md:py-12">
        <ProductGridSkeleton />
      </div>
    </>
  );
}
