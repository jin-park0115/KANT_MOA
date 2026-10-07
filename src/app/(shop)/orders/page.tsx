"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoginRequired } from "@/components/order/LoginRequired";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button, Card, EmptyState, SectionHeader, Skeleton } from "@/components/ui";
import { getErrorMessage } from "@/constants/error-messages";
import { getOrders } from "@/services/orders";
import type { OrderSummary } from "@/types/app";

// 결과를 사용자 id와 함께 보관해서, 다른 계정으로 바뀌면 이전 목록을 보여주지 않는다.
type Loaded = { userId: string; orders: OrderSummary[] | null; error: string | null };

function orderTitle(order: OrderSummary) {
  return order.itemCount > 1 ? `${order.firstItemName} 외 ${order.itemCount - 1}건` : order.firstItemName;
}

export default function OrdersPage() {
  const { profile, initialized } = useAuth();
  const userId = profile?.id ?? null;
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    getOrders()
      .then((orders) => active && setLoaded({ userId, orders, error: null }))
      .catch((error) => active && setLoaded({ userId, orders: null, error: getErrorMessage(error) }));
    return () => {
      active = false;
    };
  }, [userId]);

  const current = loaded?.userId === userId ? loaded : null;

  return (
    <div className="content-shell py-8 md:py-12">
      <SectionHeader title="주문 내역" />
      {!initialized || (userId && !current) ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : !userId ? (
        <LoginRequired next="/orders" />
      ) : current?.error ? (
        <p role="alert" className="text-sm text-danger">{current.error}</p>
      ) : !current?.orders?.length ? (
        <EmptyState
          title="주문 내역이 없어요"
          description="첫 굿즈를 주문해보세요."
          action={<Link href="/category/all"><Button>상품 보러가기</Button></Link>}
        />
      ) : (
        <ul className="space-y-4">
          {current.orders.map((order) => (
            <li key={order.id}>
              <Link href={`/orders/${order.id}`}>
                <Card className="flex items-center justify-between gap-4 p-5 transition-shadow hover:shadow-lg">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={order.status} />
                      <time dateTime={order.createdAt} className="text-xs text-muted">
                        {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                      </time>
                    </div>
                    <p className="mt-2 truncate font-bold">{orderTitle(order)}</p>
                  </div>
                  <p className="shrink-0 text-base font-black">{order.totalPrice.toLocaleString("ko-KR")}원</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
