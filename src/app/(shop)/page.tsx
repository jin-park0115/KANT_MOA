import { Suspense } from "react";
import { ArtistPicker } from "@/components/product/ArtistPicker";
import { ArtistShowcase, ArtistShowcaseSkeleton } from "@/components/product/ArtistShowcase";
import { LoadError } from "@/components/product/LoadError";
import { MainHeroCarousel } from "@/components/product/MainHeroCarousel";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";
import { EmptyState, SectionHeader, Skeleton } from "@/components/ui";
import { getArtists, getProducts } from "@/services/products";
import type { Artist, ProductSummary } from "@/types/app";

const HERO_LIMIT = 8;

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">KANT MOA 공식 굿즈샵</h1>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-none md:h-80" />}>
        <MainHero />
      </Suspense>

      <div className="content-shell space-y-6 py-6 md:space-y-8 md:py-8">
        <Suspense fallback={<Skeleton className="h-52 w-full rounded-lg" />}>
          <RecommendedArtists />
        </Suspense>

        <section aria-label="아티스트별 굿즈">
          <Suspense fallback={<ArtistShowcaseSkeleton />}>
            <ArtistShowcases />
          </Suspense>
        </section>

        <section aria-label="새로 나온 굿즈" className="pt-6">
          <SectionHeader title="새로 나온 굿즈" />
          <Suspense fallback={<ProductGridSkeleton />}>
            <NewProducts />
          </Suspense>
        </section>
      </div>
    </>
  );
}

async function MainHero() {
  let products: ProductSummary[];
  try {
    products = (await getProducts({ limit: HERO_LIMIT })).items;
  } catch {
    return null; // 배너는 부가 영역이라 실패 시 숨기고, 아래 상품 영역에서 에러를 안내합니다.
  }
  if (products.length === 0) return null;
  return <MainHeroCarousel products={products} />;
}

async function RecommendedArtists() {
  let artists: Artist[];
  try {
    artists = await getArtists();
  } catch (error) {
    return <LoadError error={error} retryHref="/" />;
  }
  if (artists.length === 0) return null;
  return <ArtistPicker artists={artists} />;
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
