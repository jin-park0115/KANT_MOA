// docs/API_SPEC.md 3·5장 services/orders.ts, services/auth.ts(프로필)의 임시 구현 (localStorage 기반).
// services가 올라오면 각 페이지의 import를 "@/services/orders", "@/services/auth"로 교체하고 이 파일은 삭제합니다.

import { getCart, removeFromCart } from "./cart";
import { AppError } from "./errors";

export type OrderStatus = "pending" | "paid" | "cancelled";

export type OrderItem = {
  variantId: number;
  productName: string;
  optionName: string;
  unitPrice: number;
  quantity: number;
};

export type OrderSummary = {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  itemCount: number;
  firstItemName: string;
  createdAt: string;
};

export type Order = OrderSummary & {
  recipientName: string;
  recipientPhone: string;
  address: string;
  paidAt: string | null;
  cancelledAt: string | null;
  items: OrderItem[];
};

export type Profile = {
  id: string;
  email: string;
  nickname: string;
  phone: string | null;
};

const ORDERS_KEY = "mock_orders";
const PROFILE_KEY = "mock_profile";
const DEFAULT_PROFILE: Profile = { id: "mock-user", email: "fan@kantmoa.dev", nickname: "모아팬", phone: "01012345678" };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readOrders() {
  return read<Order[]>(ORDERS_KEY, []);
}

function writeOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function toSummary(order: Order): OrderSummary {
  const { id, status, totalPrice, itemCount, firstItemName, createdAt } = order;
  return { id, status, totalPrice, itemCount, firstItemName, createdAt };
}

export async function createOrder(input: { recipientName: string; recipientPhone: string; address: string }): Promise<string> {
  const cart = await getCart();
  if (cart.items.length === 0) throw new AppError("CART_EMPTY");
  if (cart.items.some((item) => !item.isAvailable)) throw new AppError("UNAVAILABLE_ITEM");

  const items: OrderItem[] = cart.items.map((item) => ({
    variantId: item.variantId,
    productName: item.product.name,
    optionName: item.optionName,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
  }));
  const itemCount = items.length;
  const order: Order = {
    id: crypto.randomUUID(),
    status: "pending",
    totalPrice: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    itemCount,
    firstItemName: itemCount > 1 ? `${items[0].productName} 외 ${itemCount - 1}건` : items[0].productName,
    createdAt: new Date().toISOString(),
    ...input,
    paidAt: null,
    cancelledAt: null,
    items,
  };
  writeOrders([order, ...readOrders()]);
  return order.id;
}

export async function payOrder(orderId: string): Promise<void> {
  const orders = readOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order || order.status !== "pending") throw new AppError("INVALID_ORDER");

  order.status = "paid";
  order.paidAt = new Date().toISOString();
  writeOrders(orders);
  for (const item of order.items) await removeFromCart(item.variantId);
}

export async function cancelOrder(orderId: string): Promise<void> {
  const orders = readOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) throw new AppError("INVALID_ORDER");
  if (order.status === "cancelled") throw new AppError("ALREADY_CANCELLED");

  order.status = "cancelled";
  order.cancelledAt = new Date().toISOString();
  writeOrders(orders);
}

export async function getOrders(): Promise<OrderSummary[]> {
  return readOrders().map(toSummary);
}

export async function getOrder(orderId: string): Promise<Order | null> {
  return readOrders().find((o) => o.id === orderId) ?? null;
}

export async function getProfile(): Promise<Profile | null> {
  return read<Profile>(PROFILE_KEY, DEFAULT_PROFILE);
}

export async function updateProfile(input: { nickname?: string; phone?: string }): Promise<Profile> {
  const next = { ...read<Profile>(PROFILE_KEY, DEFAULT_PROFILE), ...input };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  return next;
}
