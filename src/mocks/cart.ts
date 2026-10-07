// docs/API_SPEC.md 4장 services/cart.ts의 임시 구현 (백엔드 준비 전까지 사용).
// services/cart.ts가 develop에 올라오면 useCart.ts의 import만 "@/services/cart"로 교체하고 이 파일은 삭제합니다.
// 타입은 src/types/app.ts(백엔드 작성)로 대체될 예정입니다.

export type CartItem = {
  variantId: number;
  quantity: number;
  product: { id: number; name: string; thumbnailUrl: string | null };
  optionName: string;
  unitPrice: number;
  stock: number;
  maxPerUser: number | null;
  isAvailable: boolean;
};

export type Cart = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
};

type GuestCartItem = { variant_id: number; quantity: number };

const STORAGE_KEY = "guest_cart";

const CATALOG: Record<number, Omit<CartItem, "quantity" | "isAvailable">> = {
  1: { variantId: 1, product: { id: 1, name: "ORBIT:ON 공식 응원봉", thumbnailUrl: null }, optionName: "기본", unitPrice: 39000, stock: 20, maxPerUser: 2 },
  2: { variantId: 2, product: { id: 2, name: "DAYLOG 아크릴 키링", thumbnailUrl: null }, optionName: "지아", unitPrice: 9000, stock: 50, maxPerUser: null },
  3: { variantId: 3, product: { id: 2, name: "DAYLOG 아크릴 키링", thumbnailUrl: null }, optionName: "희수", unitPrice: 9000, stock: 0, maxPerUser: null },
  4: { variantId: 4, product: { id: 3, name: "SODAFM 후드 집업", thumbnailUrl: null }, optionName: "L", unitPrice: 59000, stock: 8, maxPerUser: 1 },
};

function readGuest(): GuestCartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuest(items: GuestCartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function toCart(guest: GuestCartItem[]): Cart {
  const items = guest.flatMap(({ variant_id, quantity }) => {
    const base = CATALOG[variant_id];
    return base ? [{ ...base, quantity, isAvailable: base.stock >= quantity }] : [];
  });
  return {
    items,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.filter((item) => item.isAvailable).reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  };
}

export async function getCart(): Promise<Cart> {
  return toCart(readGuest());
}

export async function addToCart(variantId: number, quantity: number): Promise<Cart> {
  const items = readGuest();
  const found = items.find((item) => item.variant_id === variantId);
  if (found) found.quantity += quantity;
  else items.push({ variant_id: variantId, quantity });
  writeGuest(items);
  return toCart(items);
}

export async function updateQuantity(variantId: number, quantity: number): Promise<Cart> {
  const items = readGuest().map((item) => (item.variant_id === variantId ? { ...item, quantity } : item));
  writeGuest(items);
  return toCart(items);
}

export async function removeFromCart(variantId: number): Promise<Cart> {
  const items = readGuest().filter((item) => item.variant_id !== variantId);
  writeGuest(items);
  return toCart(items);
}

/** 개발용: 담긴 목록이 없을 때 샘플 상품을 넣는다. */
export function seedCart() {
  writeGuest([
    { variant_id: 1, quantity: 1 },
    { variant_id: 2, quantity: 2 },
    { variant_id: 3, quantity: 1 },
  ]);
}
