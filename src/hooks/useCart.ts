"use client";

import { useSyncExternalStore } from "react";
// TODO: services/cart.ts가 올라오면 "@/services/cart"로 교체 (함수 시그니처 동일)
import { addToCart, getCart, removeFromCart, updateQuantity, type Cart } from "@/mocks/cart";

type CartState = { cart: Cart; loaded: boolean };

const EMPTY_CART: Cart = { items: [], totalQuantity: 0, totalPrice: 0 };
const SERVER_STATE: CartState = { cart: EMPTY_CART, loaded: false };

// 헤더 뱃지, 상세 페이지, 장바구니 페이지가 같은 상태를 보도록 모듈 단위로 하나만 둔다.
let state: CartState = SERVER_STATE;
let loading = false;
const listeners = new Set<() => void>();

function setCart(cart: Cart) {
  state = { cart, loaded: true };
  listeners.forEach((listener) => listener());
}

async function refresh() {
  setCart(await getCart());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!state.loaded && !loading) {
    loading = true;
    refresh().finally(() => {
      loading = false;
    });
  }
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => SERVER_STATE;

// 실패 시 AppError(OUT_OF_STOCK 등)가 그대로 던져지므로 호출하는 쪽에서 catch해서 메시지를 보여준다.
const actions = {
  addItem: async (variantId: number, quantity = 1) => setCart(await addToCart(variantId, quantity)),
  updateQuantity: async (variantId: number, quantity: number) => setCart(await updateQuantity(variantId, quantity)),
  removeItem: async (variantId: number) => setCart(await removeFromCart(variantId)),
  refresh,
};

export function useCart() {
  const { cart, loaded } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { ...cart, loaded, ...actions };
}
