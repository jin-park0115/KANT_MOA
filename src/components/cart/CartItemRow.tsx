import Link from "next/link";
import { Badge } from "@/components/ui";
import type { CartItem } from "@/types/app";
import { QuantityStepper } from "./QuantityStepper";

interface CartItemRowProps {
  item: CartItem;
  busy?: boolean;
  onQuantityChange: (variantId: number, quantity: number) => void;
  onRemove: (variantId: number) => void;
}

export function CartItemRow({ item, busy, onQuantityChange, onRemove }: CartItemRowProps) {
  // 재고와 1인 구매 제한 중 더 작은 값이 선택 가능한 최대 수량
  const limits = [item.stock, item.maxPerUser].filter((value): value is number => value !== null);
  const max = Math.min(...limits);

  return (
    <li className="flex gap-4 py-5">
      <Link href={`/products/${item.product.id}`} className="size-24 shrink-0 overflow-hidden rounded-md bg-neutral-100 md:size-28">
        {item.product.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.product.thumbnailUrl} alt={item.product.name} className="size-full object-cover" />
        ) : (
          <span className="grid size-full place-items-center text-xs text-muted">이미지 없음</span>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/products/${item.product.id}`} className="line-clamp-2 text-sm font-bold md:text-base">{item.product.name}</Link>
            <p className="mt-1 text-xs text-muted">옵션: {item.optionName}</p>
          </div>
          <button type="button" aria-label={`${item.product.name} 삭제`} disabled={busy} onClick={() => onRemove(item.variantId)} className="shrink-0 text-sm text-muted hover:text-danger disabled:opacity-50">삭제</button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          {item.isAvailable ? (
            <QuantityStepper quantity={item.quantity} max={max} disabled={busy} onChange={(quantity) => onQuantityChange(item.variantId, quantity)} />
          ) : (
            <Badge className="bg-red-50 text-danger">품절·재고 부족</Badge>
          )}
          <p className="text-base font-black">{(item.unitPrice * item.quantity).toLocaleString("ko-KR")}원</p>
        </div>
      </div>
    </li>
  );
}
