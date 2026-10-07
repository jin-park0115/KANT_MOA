"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { getErrorMessage } from "@/constants/error-messages";
import { cancelOrder, getOrder, payOrder, type Order } from "@/mocks/orders";

const TITLES = {
  pending: "결제가 완료되지 않았어요",
  paid: "결제가 완료됐어요",
  cancelled: "취소된 주문이에요",
} as const;

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null | undefined>(undefined); // undefined = 로딩 중, null = 없는 주문
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrder(id).then(setOrder);
  }, [id]);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(getErrorMessage(e));
    }
    setOrder(await getOrder(id));
    setBusy(false);
  }

  if (order === undefined) {
    return (
      <div className="content-shell py-8 md:py-12">
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="content-shell py-8 md:py-12">
        <EmptyState title="주문을 찾을 수 없어요" action={<Link href="/orders"><Button>주문 내역으로</Button></Link>} />
      </div>
    );
  }

  return (
    <div className="content-shell max-w-3xl py-8 md:py-12">
      <div className="mb-6 text-center">
        <OrderStatusBadge status={order.status} />
        <h1 className="mt-3 text-2xl font-black tracking-[-0.035em]">{TITLES[order.status]}</h1>
        <p className="mt-2 text-xs text-muted">주문번호 {order.id}</p>
      </div>

      <div className="space-y-6">
        <Card className="px-6">
          <h2 className="pt-6 text-lg font-black">주문 상품</h2>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.variantId} className="flex justify-between gap-4 py-4 text-sm">
                <div className="min-w-0">
                  <p className="font-bold">{item.productName}</p>
                  <p className="mt-1 text-xs text-muted">{item.optionName} · {item.quantity}개</p>
                </div>
                <p className="shrink-0 font-bold">{(item.unitPrice * item.quantity).toLocaleString("ko-KR")}원</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-line py-5 text-base">
            <span className="font-bold">총 결제 금액</span>
            <span className="font-black">{order.totalPrice.toLocaleString("ko-KR")}원</span>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-black">배송 정보</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-4"><dt className="w-16 shrink-0 text-muted">받는 분</dt><dd>{order.recipientName}</dd></div>
            <div className="flex gap-4"><dt className="w-16 shrink-0 text-muted">연락처</dt><dd>{order.recipientPhone}</dd></div>
            <div className="flex gap-4"><dt className="w-16 shrink-0 text-muted">주소</dt><dd>{order.address}</dd></div>
          </dl>
        </Card>

        {error && <p role="alert" className="text-center text-sm text-danger">{error}</p>}

        <div className="flex flex-wrap justify-center gap-3">
          {order.status === "pending" && (
            <Button loading={busy} onClick={() => run(() => payOrder(order.id))}>다시 결제하기</Button>
          )}
          {order.status !== "cancelled" && (
            <Button variant="outline" disabled={busy} onClick={() => window.confirm("주문을 취소할까요?") && run(() => cancelOrder(order.id))}>
              주문 취소
            </Button>
          )}
          <Link href="/orders"><Button variant="ghost">주문 내역</Button></Link>
          <Link href="/category/all"><Button variant="ghost">쇼핑 계속하기</Button></Link>
        </div>
      </div>
    </div>
  );
}
