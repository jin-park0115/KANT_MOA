import { Suspense } from "react";
import { ArtistShowcase, ArtistShowcaseSkeleton } from "@/components/product/ArtistShowcase";
import { LoadError } from "@/components/product/LoadError";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";
import { EmptyState, SectionHeader } from "@/components/ui";
import { getArtists, getProducts } from "@/services/products";
import type { Artist, ProductSummary } from "@/types/app";

export default function HomePage() {
  return (
    <div className="content-shell space-y-14 py-8 md:space-y-20 md:py-12">
      <section className="rounded-lg bg-foreground px-6 py-10 text-white md:px-12 md:py-16">
        <p className="text-sm font-semibold text-brand">KANT MOA OFFICIAL STORE</p>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
          좋아하는 아티스트의
          <br />
          공식 굿즈를 한곳에서
        </h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-neutral-300 md:text-base">앨범부터 응원봉, 멤버별 굿즈까지 지금 만나보세요.</p>
      </section>

      <section aria-label="아티스트별 굿즈">
        <Suspense fallback={<ArtistShowcaseSkeleton />}>
          <ArtistShowcases />
        </Suspense>
      </section>

      <section aria-label="새로 나온 굿즈">
        <SectionHeader title="새로 나온 굿즈" />
        <Suspense fallback={<ProductGridSkeleton />}>
          <NewProducts />
        </Suspense>
      </section>
    </div>
  );
}

async function ArtistShowcases() {
  let artists: Artist[];
  try {
    artists = await getArtists();
  } catch (error) {
    return <LoadError error={error} retryHref="/" />;
  }
  if (artists.length === 0) return <EmptyState title="등록된 아티스트가 없어요" />;
  return (
    <div className="space-y-6 md:space-y-8">
      {artists.map((artist) => (
        <Suspense key={artist.id} fallback={<ArtistShowcaseSkeleton />}>
          <ArtistShowcase artist={artist} />
        </Suspense>
      ))}
    </div>
  );
}

async function NewProducts() {
  let products: ProductSummary[];
  try {
    products = (await getProducts({ limit: 8 })).items;
  } catch (error) {
    return <LoadError error={error} retryHref="/" />;
  }
  return <ProductGrid products={products} />;
}
