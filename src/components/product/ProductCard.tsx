import Link from "next/link";
import type { ProductSummary } from "@/types/app";
import { formatPrice } from "./formatPrice";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative">
        <ProductImage
          src={product.thumbnailUrl}
          alt={`${product.artist.name} ${product.name}`}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="aspect-square rounded-md transition-opacity group-hover:opacity-90"
        />
        {product.isSoldOut && (
          <span className="absolute inset-0 grid place-items-center rounded-md bg-black/45 text-sm font-black text-white">품절</span>
        )}
      </div>
      <p className="mt-3 text-xs font-bold text-muted">{product.artist.name}</p>
      <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5">{product.name}</h3>
      <p className="mt-1.5 text-base font-black">{formatPrice(product.price)}</p>
    </Link>
  );
}
