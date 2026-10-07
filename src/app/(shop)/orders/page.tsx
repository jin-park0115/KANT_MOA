"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Button, Card, EmptyState, SectionHeader, Skeleton } from "@/components/ui";
import { getOrders, type OrderSummary } from "@/mocks/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <div className="content-shell py-8 md:py-12">
      <SectionHeader title="주문 내역" />
      {orders === null ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="주문 내역이 없어요"
          description="첫 굿즈를 주문해보세요."
          action={<Link href="/category/all"><Button>상품 보러가기</Button></Link>}
        />
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
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
                    <p className="mt-2 truncate font-bold">{order.firstItemName}</p>
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
